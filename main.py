import os
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Literal, Optional

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import close_db, get_db, init_db
from finance_engines import DebtOptimizerEngine, TaxEngine
from models import DebtModel, FixedDepositModel, UserModel
from schemas import (
    AuthResponse,
    AutoAffordabilityRequest,
    AutoAffordabilityResponse,
    DebtOptimizationResponse,
    HealthScoreResponse,
    LoginRequest,
    OnboardingResponse,
    UserOnboardingRequest,
    UserResponse,
)
from services.affordability_service import AffordabilityService
from services.analytics_service import AnalyticsService
from services.auth_service import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="OptiWealth API",
    description="Proactive personal finance intelligence engine",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins_raw = os.getenv("CORS_ORIGINS", "")
if cors_origins_raw:
    cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]
else:
    cors_origins = ["*"]

# credentials cannot be allowed with wildcard '*' origin in FastAPI/Starlette
allow_credentials = True
if "*" in cors_origins:
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)


async def _get_user_with_relations(db: AsyncSession, user_id: int) -> Optional[UserModel]:
    result = await db.execute(
        select(UserModel)
        .where(UserModel.id == user_id)
        .options(
            selectinload(UserModel.debts),
            selectinload(UserModel.fixed_deposits),
        )
    )
    return result.scalar_one_or_none()


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> UserModel:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
    except (PyJWTError, KeyError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user = await _get_user_with_relations(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def _debts_to_engine_payload(debts: List[DebtModel]) -> List[Dict[str, Any]]:
    return [
        {
            "id": debt.id,
            "name": debt.name,
            "remaining_balance": debt.remaining_balance,
            "interest_rate": debt.interest_rate,
            "minimum_payment": debt.minimum_payment,
        }
        for debt in debts
    ]


@app.post(
    "/api/v1/auth/onboard",
    response_model=OnboardingResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Auth"],
)
async def onboard_user(
    payload: UserOnboardingRequest,
    db: AsyncSession = Depends(get_db),
) -> OnboardingResponse:
    try:
        user = UserModel(
            email=payload.email,
            password_hash=hash_password(payload.password),
            full_name=payload.full_name,
            monthly_income=payload.monthly_income,
            monthly_expenses=payload.monthly_expenses,
            emergency_fund_balance=payload.emergency_fund_balance,
            annual_gross_income=payload.annual_gross_income,
        )

        for debt_data in payload.debts:
            user.debts.append(
                DebtModel(
                    name=debt_data.name,
                    principal=debt_data.principal,
                    interest_rate=debt_data.interest_rate,
                    minimum_payment=debt_data.minimum_payment,
                    remaining_balance=debt_data.remaining_balance,
                )
            )

        for fd_data in payload.fixed_deposits:
            user.fixed_deposits.append(
                FixedDepositModel(
                    bank_name=fd_data.bank_name,
                    principal=fd_data.principal,
                    interest_rate=fd_data.interest_rate,
                    maturity_date=fd_data.maturity_date,
                )
            )

        db.add(user)
        await db.flush()
        await db.refresh(user, attribute_names=["debts", "fixed_deposits"])

        tax_summary = TaxEngine.compute_tax(payload.annual_gross_income)
        debt_optimization = DebtOptimizerEngine.optimize(
            _debts_to_engine_payload(user.debts),
            strategy="avalanche",
        )

        access_token = create_access_token(user.id, user.email)

        return OnboardingResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user),
            tax_summary=tax_summary,
            debt_optimization=debt_optimization,
        )

    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Structural validation failed", "errors": exc.errors()},
        ) from exc
    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@app.post(
    "/api/v1/auth/login",
    response_model=AuthResponse,
    tags=["Auth"],
)
async def login_user(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> AuthResponse:
    result = await db.execute(
        select(UserModel)
        .where(UserModel.email == payload.email)
        .options(
            selectinload(UserModel.debts),
            selectinload(UserModel.fixed_deposits),
        )
    )
    user = result.scalar_one_or_none()

    if user is None or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(user.id, user.email)
    return AuthResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )


@app.get(
    "/api/v1/auth/me",
    response_model=UserResponse,
    tags=["Auth"],
)
async def get_current_user_profile(
    current_user: UserModel = Depends(get_current_user),
) -> UserResponse:
    return UserResponse.model_validate(current_user)


@app.get(
    "/api/v1/analytics/health-score/{user_id}",
    response_model=HealthScoreResponse,
    tags=["Analytics"],
)
async def get_financial_health_score(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> HealthScoreResponse:
    user = await _get_user_with_relations(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found.",
        )

    result = AnalyticsService.compute_health_score(user)
    return HealthScoreResponse(**result)


@app.get(
    "/api/v1/analytics/tax/{user_id}",
    tags=["Analytics"],
)
async def get_user_tax_summary(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    user = await _get_user_with_relations(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found.",
        )

    return TaxEngine.compute_tax(user.annual_gross_income)


@app.get(
    "/api/v1/optimize/debts/{user_id}",
    response_model=DebtOptimizationResponse,
    tags=["Optimization"],
)
async def optimize_user_debts(
    user_id: int,
    strategy: Literal["snowball", "avalanche"] = Query(
        default="avalanche",
        description="Debt payoff strategy: snowball (smallest balance first) or avalanche (highest rate first).",
    ),
    db: AsyncSession = Depends(get_db),
) -> DebtOptimizationResponse:
    user = await _get_user_with_relations(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found.",
        )

    if not user.debts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User has no debts to optimize.",
        )

    try:
        optimization = DebtOptimizerEngine.optimize(
            _debts_to_engine_payload(user.debts),
            strategy=strategy,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return DebtOptimizationResponse(
        user_id=user_id,
        strategy=optimization["strategy"],
        optimized_order=optimization["optimized_order"],
        total_debt=optimization["total_debt"],
        total_minimum_payment=optimization["total_minimum_payment"],
    )


@app.post(
    "/api/v1/calculator/auto-affordability",
    response_model=AutoAffordabilityResponse,
    tags=["Calculator"],
)
async def calculate_auto_affordability(
    payload: AutoAffordabilityRequest,
) -> AutoAffordabilityResponse:
    try:
        result = AffordabilityService.evaluate_auto_affordability(
            gross_monthly_income=payload.gross_monthly_income,
            vehicle_price=payload.vehicle_price,
            down_payment=payload.down_payment,
            loan_term_months=payload.loan_term_months,
            annual_interest_rate=payload.annual_interest_rate,
            estimated_monthly_insurance=payload.estimated_monthly_insurance,
            estimated_monthly_maintenance=payload.estimated_monthly_maintenance,
        )
        return AutoAffordabilityResponse(**result)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@app.get("/health", tags=["System"])
async def health_check() -> Dict[str, str]:
    return {"status": "ok", "service": "optiwealth-api"}
