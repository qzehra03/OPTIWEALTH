from typing import Any, Dict, List


class AffordabilityService:
    """20/4/10 auto financing rule validation."""

    DOWN_PAYMENT_MIN_PERCENT = 20.0
    MAX_LOAN_TERM_MONTHS = 48
    MAX_AUTO_COST_INCOME_PERCENT = 10.0

    @staticmethod
    def _monthly_loan_payment(
        loan_amount: float,
        annual_interest_rate: float,
        loan_term_months: int,
    ) -> float:
        if loan_amount <= 0:
            return 0.0
        if annual_interest_rate <= 0:
            return loan_amount / loan_term_months

        monthly_rate = annual_interest_rate / 100 / 12
        factor = (1 + monthly_rate) ** loan_term_months
        return loan_amount * monthly_rate * factor / (factor - 1)

    @classmethod
    def evaluate_auto_affordability(
        cls,
        gross_monthly_income: float,
        vehicle_price: float,
        down_payment: float,
        loan_term_months: int,
        annual_interest_rate: float,
        estimated_monthly_insurance: float = 0.0,
        estimated_monthly_maintenance: float = 0.0,
    ) -> Dict[str, Any]:
        if down_payment > vehicle_price:
            raise ValueError("down_payment cannot exceed vehicle_price")

        down_payment_percent = (down_payment / vehicle_price) * 100 if vehicle_price > 0 else 0.0
        loan_amount = vehicle_price - down_payment
        monthly_payment = cls._monthly_loan_payment(loan_amount, annual_interest_rate, loan_term_months)
        total_monthly_auto_cost = (
            monthly_payment + estimated_monthly_insurance + estimated_monthly_maintenance
        )
        max_allowed_monthly_auto_cost = gross_monthly_income * (cls.MAX_AUTO_COST_INCOME_PERCENT / 100)

        rule_down_payment = down_payment_percent >= cls.DOWN_PAYMENT_MIN_PERCENT
        rule_loan_term = loan_term_months <= cls.MAX_LOAN_TERM_MONTHS
        rule_income_cap = total_monthly_auto_cost <= max_allowed_monthly_auto_cost

        recommendations: List[str] = []
        if not rule_down_payment:
            required_down = vehicle_price * (cls.DOWN_PAYMENT_MIN_PERCENT / 100)
            recommendations.append(
                f"Increase down payment to at least ₹{required_down:,.0f} (20% of vehicle price)."
            )
        if not rule_loan_term:
            recommendations.append(
                f"Reduce loan term to {cls.MAX_LOAN_TERM_MONTHS} months or fewer (4-year rule)."
            )
        if not rule_income_cap:
            recommendations.append(
                f"Reduce total monthly auto costs to ₹{max_allowed_monthly_auto_cost:,.0f} "
                f"(10% of gross monthly income)."
            )

        return {
            "is_affordable": rule_down_payment and rule_loan_term and rule_income_cap,
            "rules": {
                "down_payment_20_percent": {
                    "passed": rule_down_payment,
                    "required_percent": cls.DOWN_PAYMENT_MIN_PERCENT,
                    "actual_percent": round(down_payment_percent, 2),
                },
                "loan_term_4_years": {
                    "passed": rule_loan_term,
                    "max_months": cls.MAX_LOAN_TERM_MONTHS,
                    "actual_months": loan_term_months,
                },
                "total_cost_10_percent_income": {
                    "passed": rule_income_cap,
                    "max_percent": cls.MAX_AUTO_COST_INCOME_PERCENT,
                    "actual_monthly_cost": round(total_monthly_auto_cost, 2),
                    "max_allowed_monthly_cost": round(max_allowed_monthly_auto_cost, 2),
                },
            },
            "monthly_payment": round(monthly_payment, 2),
            "total_monthly_auto_cost": round(total_monthly_auto_cost, 2),
            "max_allowed_monthly_auto_cost": round(max_allowed_monthly_auto_cost, 2),
            "recommendations": recommendations,
        }
