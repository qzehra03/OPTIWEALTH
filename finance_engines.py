from typing import Any, Dict, List, Literal


class TaxEngine:
    """FY 2026-27 New Regime tax computation with standard deduction and Section 87A rebate."""

    STANDARD_DEDUCTION: float = 75_000.0
    SECTION_87A_REBATE_LIMIT: float = 12_00_000.0
    SECTION_87A_MAX_REBATE: float = 60_000.0

    SLABS: List[tuple[float, float, float]] = [
        (0.0, 3_00_000.0, 0.0),
        (3_00_000.0, 7_00_000.0, 0.05),
        (7_00_000.0, 10_00_000.0, 0.10),
        (10_00_000.0, 12_00_000.0, 0.15),
        (12_00_000.0, 15_00_000.0, 0.20),
        (15_00_000.0, float("inf"), 0.30),
    ]

    @staticmethod
    def compute_tax(annual_gross_income: float) -> Dict[str, Any]:
        if annual_gross_income < 0:
            raise ValueError("annual_gross_income must be non-negative")

        taxable_income = max(0.0, annual_gross_income - TaxEngine.STANDARD_DEDUCTION)
        slab_breakdown: List[Dict[str, float]] = []
        tax_before_rebate = 0.0

        for lower, upper, rate in TaxEngine.SLABS:
            if taxable_income <= lower:
                break

            slab_amount = min(taxable_income, upper) - lower
            if slab_amount <= 0:
                continue

            slab_tax = slab_amount * rate
            tax_before_rebate += slab_tax
            slab_breakdown.append(
                {
                    "lower": lower,
                    "upper": upper if upper != float("inf") else None,
                    "rate_percent": rate * 100,
                    "taxable_amount": round(slab_amount, 2),
                    "tax": round(slab_tax, 2),
                }
            )

        rebate = 0.0
        if annual_gross_income <= TaxEngine.SECTION_87A_REBATE_LIMIT:
            rebate = min(tax_before_rebate, TaxEngine.SECTION_87A_MAX_REBATE)

        final_tax = max(0.0, tax_before_rebate - rebate)
        effective_rate = (final_tax / annual_gross_income * 100) if annual_gross_income > 0 else 0.0

        return {
            "regime": "new_fy_2026_27",
            "annual_gross_income": round(annual_gross_income, 2),
            "standard_deduction": TaxEngine.STANDARD_DEDUCTION,
            "taxable_income": round(taxable_income, 2),
            "tax_before_rebate": round(tax_before_rebate, 2),
            "section_87a_rebate": round(rebate, 2),
            "final_tax": round(final_tax, 2),
            "effective_tax_rate_percent": round(effective_rate, 2),
            "slab_breakdown": slab_breakdown,
            "rebate_eligible": annual_gross_income <= TaxEngine.SECTION_87A_REBATE_LIMIT,
        }


class DebtOptimizerEngine:
    """Snowball and Avalanche debt payoff ordering strategies."""

    @staticmethod
    def optimize(
        debts: List[Dict[str, Any]],
        strategy: Literal["snowball", "avalanche"] = "avalanche",
    ) -> Dict[str, Any]:
        if not debts:
            return {
                "strategy": strategy,
                "optimized_order": [],
                "total_debt": 0.0,
                "total_minimum_payment": 0.0,
            }

        validated: List[Dict[str, Any]] = []
        for debt in debts:
            balance = float(debt.get("remaining_balance", 0))
            rate = float(debt.get("interest_rate", 0))
            payment = float(debt.get("minimum_payment", 0))
            if balance <= 0 or payment <= 0:
                raise ValueError("Each debt requires positive remaining_balance and minimum_payment")
            validated.append({**debt, "remaining_balance": balance, "interest_rate": rate, "minimum_payment": payment})

        if strategy == "snowball":
            sorted_debts = sorted(validated, key=lambda d: d["remaining_balance"])
        elif strategy == "avalanche":
            sorted_debts = sorted(
                validated,
                key=lambda d: (-d["interest_rate"], d["remaining_balance"]),
            )
        else:
            raise ValueError("strategy must be 'snowball' or 'avalanche'")

        optimized_order = [
            {
                "priority": index + 1,
                "id": debt.get("id"),
                "name": debt.get("name"),
                "remaining_balance": round(debt["remaining_balance"], 2),
                "interest_rate": round(debt["interest_rate"], 2),
                "minimum_payment": round(debt["minimum_payment"], 2),
            }
            for index, debt in enumerate(sorted_debts)
        ]

        return {
            "strategy": strategy,
            "optimized_order": optimized_order,
            "total_debt": round(sum(d["remaining_balance"] for d in sorted_debts), 2),
            "total_minimum_payment": round(sum(d["minimum_payment"] for d in sorted_debts), 2),
        }
