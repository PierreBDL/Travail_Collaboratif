from datetime import datetime, time, timedelta, timezone
from pathlib import Path

from backend.src.config.settings import DATABASE_PATH
from backend.src.database.connection import connect_database
from backend.src.services.site_checker import CheckResult


def save_check(result: CheckResult, db_path: str | Path = DATABASE_PATH) -> None:
    checked_at = datetime.fromisoformat(result["checked_at"]).astimezone(timezone.utc)
    with connect_database(db_path) as connection:
        connection.execute(
            """INSERT INTO checks
            (url, available, status_code, response_time_ms, checked_at, error)
            VALUES (?, ?, ?, ?, ?, ?)""",
            (result["url"], int(result["available"]), result["status_code"],
             result["response_time_ms"], checked_at.isoformat(), result["error"]),
        )


def get_statistics(url: str, now: datetime, db_path: str | Path = DATABASE_PATH) -> dict:
    now = now.astimezone(timezone.utc)
    start = datetime.combine(now.date() - timedelta(days=29), time.min, timezone.utc)
    with connect_database(db_path) as connection:
        rows = connection.execute(
            """SELECT available, checked_at FROM checks
            WHERE url = ? AND checked_at >= ? AND checked_at <= ?
            ORDER BY checked_at ASC, id ASC""",
            (url, start.isoformat(), now.isoformat()),
        ).fetchall()
    days = {}
    for row in rows:
        day = row["checked_at"][:10]
        days[day] = days.get(day, True) and bool(row["available"])
    return {
        "disponibilityRate": round(100 * sum(row["available"] for row in rows) / len(rows), 2) if rows else 0,
        "lastdays": [
            {"date": day, "state": "uptime" if available else "down"}
            for day, available in days.items()
        ],
    }
