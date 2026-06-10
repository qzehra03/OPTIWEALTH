from datetime import date, datetime
from typing import List

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    monthly_income: Mapped[float] = mapped_column(Float, nullable=False)
    monthly_expenses: Mapped[float] = mapped_column(Float, nullable=False)
    emergency_fund_balance: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    annual_gross_income: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    debts: Mapped[List["DebtModel"]] = relationship(
        "DebtModel",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    fixed_deposits: Mapped[List["FixedDepositModel"]] = relationship(
        "FixedDepositModel",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class DebtModel(Base):
    __tablename__ = "debts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    principal: Mapped[float] = mapped_column(Float, nullable=False)
    interest_rate: Mapped[float] = mapped_column(Float, nullable=False)
    minimum_payment: Mapped[float] = mapped_column(Float, nullable=False)
    remaining_balance: Mapped[float] = mapped_column(Float, nullable=False)

    user: Mapped["UserModel"] = relationship("UserModel", back_populates="debts")


class FixedDepositModel(Base):
    __tablename__ = "fixed_deposits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    bank_name: Mapped[str] = mapped_column(String(120), nullable=False)
    principal: Mapped[float] = mapped_column(Float, nullable=False)
    interest_rate: Mapped[float] = mapped_column(Float, nullable=False)
    maturity_date: Mapped[date] = mapped_column(Date, nullable=False)

    user: Mapped["UserModel"] = relationship("UserModel", back_populates="fixed_deposits")
