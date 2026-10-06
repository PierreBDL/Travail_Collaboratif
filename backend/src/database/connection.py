"""Initialisation et connexions SQLite à durée de vie limitée."""

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

from backend.src.config.settings import DATABASE_PATH


@contextmanager
def connect_database(db_path: str | Path = DATABASE_PATH) -> Iterator[sqlite3.Connection]:
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    try:
        # Valide la transaction en cas de succès, l'annule en cas d'erreur.
        with connection:
            yield connection
    finally:
        connection.close()


def init_database(db_path: str | Path = DATABASE_PATH) -> None:
    """Crée les dossiers et la table sans effacer les données existantes."""
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    with connect_database(db_path) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS monitors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL CHECK (length(trim(name)) > 0),
                url TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
