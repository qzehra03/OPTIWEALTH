from typing import Any, Dict, List

from models import UserModel


class AnalyticsService:
    """Backend financial health analytics — decoupled from API presentation."""

    WEIGHTS = {
        "savings_rate": 0.30,
        "emergency_fund": 0.30,
        "dti": 0.25,
        "spending_discipline": 0.15,
    }

    @staticmethod
    def _clamp_score(value: float) -> float:
        return max(0.0, min(100.0, value))

    @staticmethod
    def _score_savings_rate(monthly_income: float, monthly_expenses: float) -> float:
        if monthly_income <= 0:
            return 0.0
        savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100
        # 0% savings -> 0 score, 50%+ savings -> 100 score
        return AnalyticsService._clamp_score((savings_rate / 50.0) * 100)

    @staticmethod
    def _score_emergency_fund(emergency_fund: float, monthly_expenses: float) -> float:
        if monthly_expenses <= 0:
            return 100.0 if emergency_fund > 0 else 0.0
        months_covered = emergency_fund / monthly_expenses
        # Target: 6 months of expenses
        return AnalyticsService._clamp_score((months_covered / 6.0) * 100)

    @staticmethod
    def _score_dti(monthly_income: float, debts: List[Any]) -> float:
        if monthly_income <= 0:
            return 0.0
        total_debt_payments = sum(debt.minimum_payment for debt in debts)
        dti_ratio = (total_debt_payments / monthly_income) * 100
        # DTI <= 20% -> 100, DTI >= 50% -> 0
        if dti_ratio <= 20:
            return 100.0
        if dti_ratio >= 50:
            return 0.0
        return AnalyticsService._clamp_score(100 - ((dti_ratio - 20) / 30) * 100)

    @staticmethod
    def _score_spending_discipline(monthly_income: float, monthly_expenses: float) -> float:
        if monthly_income <= 0:
            return 0.0
        expense_ratio = (monthly_expenses / monthly_income) * 100
        # <= 50% expenses -> 100, >= 90% expenses -> 0
        if expense_ratio <= 50:
            return 100.0
        if expense_ratio >= 90:
            return 0.0
        return AnalyticsService._clamp_score(100 - ((expense_ratio - 50) / 40) * 100)

    @staticmethod
    def _rating_from_score(score: float) -> str:
        if score >= 80:
            return "excellent"
        if score >= 60:
            return "good"
        if score >= 40:
            return "fair"
        if score >= 20:
            return "poor"
        return "critical"

    @classmethod
    def compute_health_score(cls, user: UserModel) -> Dict[str, Any]:
        savings_score = cls._score_savings_rate(user.monthly_income, user.monthly_expenses)
        emergency_score = cls._score_emergency_fund(user.emergency_fund_balance, user.monthly_expenses)
        dti_score = cls._score_dti(user.monthly_income, user.debts)
        spending_score = cls._score_spending_discipline(user.monthly_income, user.monthly_expenses)

        health_score = (
            savings_score * cls.WEIGHTS["savings_rate"]
            + emergency_score * cls.WEIGHTS["emergency_fund"]
            + dti_score * cls.WEIGHTS["dti"]
            + spending_score * cls.WEIGHTS["spending_discipline"]
        )

        total_debt_payments = sum(debt.minimum_payment for debt in user.debts)
        savings_rate = (
            ((user.monthly_income - user.monthly_expenses) / user.monthly_income) * 100
            if user.monthly_income > 0
            else 0.0
        )
        dti_ratio = (total_debt_payments / user.monthly_income) * 100 if user.monthly_income > 0 else 0.0
        emergency_months = (
            user.emergency_fund_balance / user.monthly_expenses if user.monthly_expenses > 0 else 0.0
        )

        return {
            "user_id": user.id,
            "health_score": round(health_score, 2),
            "rating": cls._rating_from_score(health_score),
            "breakdown": {
                "savings_rate_score": round(savings_score, 2),
                "emergency_fund_score": round(emergency_score, 2),
                "dti_score": round(dti_score, 2),
                "spending_discipline_score": round(spending_score, 2),
            },
            "metrics": {
                "savings_rate_percent": round(savings_rate, 2),
                "emergency_fund_months": round(emergency_months, 2),
                "dti_percent": round(dti_ratio, 2),
                "expense_ratio_percent": round(
                    (user.monthly_expenses / user.monthly_income) * 100 if user.monthly_income > 0 else 0.0,
                    2,
                ),
                "weights": cls.WEIGHTS,
            },
        }
