"""Accès aux moniteurs, indépendant de Flask et des requêtes réseau."""

from datetime import datetime, timezone
from pathlib import Path
from typing import TypedDict

from backend.src.config.settings import DATABASE_PATH
from backend.src.database.connection import connect_database
from backend.src.services.url_validation import validate_url


class Monitor(TypedDict):
    id: int
    name: str
    url: str
    created_at: str


def create_monitor(name: str, url: str, db_path: str | Path = DATABASE_PATH) -> Monitor:
    if not isinstance(name, str) or not name.strip():
        raise ValueError("Le nom du moniteur ne doit pas être vide.")
    validate_url(url)
    name = name.strip()
    created_at = datetime.now(timezone.utc).isoformat()
    with connect_database(db_path) as connection:
        cursor = connection.execute(
            "INSERT INTO monitors (name, url, created_at) VALUES (?, ?, ?)",
            (name, url, created_at),
        )
        return {"id": cursor.lastrowid, "name": name, "url": url, "created_at": created_at}


def list_monitors(db_path: str | Path = DATABASE_PATH) -> list[Monitor]:
    with connect_database(db_path) as connection:
        rows = connection.execute(
            "SELECT id, name, url, created_at FROM monitors ORDER BY id ASC"
        ).fetchall()
        return [dict(row) for row in rows]


def get_monitor(monitor_id: int, db_path: str | Path = DATABASE_PATH) -> Monitor | None:
    with connect_database(db_path) as connection:
        row = connection.execute(
            "SELECT id, name, url, created_at FROM monitors WHERE id = ?", (monitor_id,)
        ).fetchone()
        return dict(row) if row is not None else None


def delete_monitor(monitor_id: int, db_path: str | Path = DATABASE_PATH) -> bool:
    with connect_database(db_path) as connection:
        cursor = connection.execute("DELETE FROM monitors WHERE id = ?", (monitor_id,))
        return cursor.rowcount > 0
