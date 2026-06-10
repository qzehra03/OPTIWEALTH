import os
from collections.abc import AsyncGenerator
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from dotenv import load_dotenv

load_dotenv()

from models import Base

DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/optiwealth",
)

# Convert standard postgresql:// to postgresql+asyncpg:// for async compatibility
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields a transactional async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def _migrate_users_password_hash(conn) -> None:
    def _check_and_add(sync_conn):
        inspector = inspect(sync_conn)
        if "users" not in inspector.get_table_names():
            return
        columns = {col["name"] for col in inspector.get_columns("users")}
        if "password_hash" not in columns:
            sync_conn.execute(
                text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)")
            )

    await conn.run_sync(_check_and_add)


async def init_db() -> None:
    """Create all tables — intended for local/dev bootstrap."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await _migrate_users_password_hash(conn)


async def close_db() -> None:
    """Dispose of the connection pool on application shutdown."""
    await engine.dispose()


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Standalone session context for scripts and background tasks."""
    async with AsyncSessionLocal() as session:
        yield session
