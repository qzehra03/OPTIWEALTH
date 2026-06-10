from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class DebtCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    principal: float = Field(..., gt=0)
    interest_rate: float = Field(..., ge=0, le=100)
    minimum_payment: float = Field(..., gt=0)
    remaining_balance: float = Field(..., gt=0)

    @field_validator("remaining_balance")
    @classmethod
    def balance_not_exceed_principal(cls, value: float, info) -> float:
        principal = info.data.get("principal")
        if principal is not None and value > principal:
            raise ValueError("remaining_balance cannot exceed principal")
        return value


class FixedDepositCreate(BaseModel):
    bank_name: str = Field(..., min_length=1, max_length=120)
    principal: float = Field(..., gt=0)
    interest_rate: float = Field(..., ge=0, le=100)
    maturity_date: date


class UserOnboardingRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=120)
    monthly_income: float = Field(..., gt=0)
    monthly_expenses: float = Field(..., ge=0)
    emergency_fund_balance: float = Field(..., ge=0)
    annual_gross_income: float = Field(..., gt=0)
    debts: List[DebtCreate] = Field(default_factory=list)
    fixed_deposits: List[FixedDepositCreate] = Field(default_factory=list)

    @field_validator("monthly_expenses")
    @classmethod
    def expenses_not_exceed_income(cls, value: float, info) -> float:
        income = info.data.get("monthly_income")
        if income is not None and value > income:
            raise ValueError("monthly_expenses cannot exceed monthly_income")
        return value


class DebtResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    principal: float
    interest_rate: float
    minimum_payment: float
    remaining_balance: float


class FixedDepositResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bank_name: str
    principal: float
    interest_rate: float
    maturity_date: date


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    monthly_income: float
    monthly_expenses: float
    emergency_fund_balance: float
    annual_gross_income: float
    debts: List[DebtResponse] = Field(default_factory=list)
    fixed_deposits: List[FixedDepositResponse] = Field(default_factory=list)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class OnboardingResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    tax_summary: dict
    debt_optimization: dict


class HealthScoreBreakdown(BaseModel):
    savings_rate_score: float
    emergency_fund_score: float
    dti_score: float
    spending_discipline_score: float


class HealthScoreResponse(BaseModel):
    user_id: int
    health_score: float
    rating: str
    breakdown: HealthScoreBreakdown
    metrics: dict


class DebtOptimizationResponse(BaseModel):
    user_id: int
    strategy: str
    optimized_order: List[dict]
    total_debt: float
    total_minimum_payment: float


class AutoAffordabilityRequest(BaseModel):
    gross_monthly_income: float = Field(..., gt=0)
    vehicle_price: float = Field(..., gt=0)
    down_payment: float = Field(..., ge=0)
    loan_term_months: int = Field(..., gt=0)
    annual_interest_rate: float = Field(..., ge=0, le=100)
    estimated_monthly_insurance: float = Field(default=0, ge=0)
    estimated_monthly_maintenance: float = Field(default=0, ge=0)


class AutoAffordabilityResponse(BaseModel):
    is_affordable: bool
    rules: dict
    monthly_payment: float
    total_monthly_auto_cost: float
    max_allowed_monthly_auto_cost: float
    recommendations: List[str]
