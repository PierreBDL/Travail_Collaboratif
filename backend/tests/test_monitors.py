import sqlite3
import unittest
from contextlib import closing
from datetime import datetime, timedelta
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from backend.src.app import create_app
from backend.src.config.settings import DATABASE_PATH
from backend.src.database.connection import connect_database, init_database
from backend.src.database.monitors import (
    create_monitor,
    delete_monitor,
    get_monitor,
    list_monitors,
)


class MonitorStorageTests(unittest.TestCase):
    def setUp(self):
        directory = TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.db_path = Path(directory.name) / "data" / "test.db"
        init_database(self.db_path)

    def test_initialization_creates_directory_and_table(self):
        self.assertTrue(self.db_path.is_file())
        self.assertEqual(list_monitors(self.db_path), [])
        with connect_database(self.db_path) as connection:
            columns = connection.execute("PRAGMA table_info(monitors)").fetchall()
        self.assertEqual([column["name"] for column in columns],
                         ["id", "name", "url", "created_at"])

    def test_initialization_preserves_existing_monitors(self):
        monitor = create_monitor("Exemple", "https://example.com", self.db_path)
        init_database(self.db_path)
        self.assertEqual(list_monitors(self.db_path), [monitor])

    def test_create_monitor_returns_id_trimmed_name_and_utc_date(self):
        with patch("requests.get") as request:
            monitor = create_monitor("  Exemple  ", "https://example.com", self.db_path)
        request.assert_not_called()
        self.assertIsInstance(monitor["id"], int)
        self.assertGreater(monitor["id"], 0)
        self.assertEqual(monitor["name"], "Exemple")
        self.assertEqual(monitor["url"], "https://example.com")
        self.assertEqual(datetime.fromisoformat(monitor["created_at"]).utcoffset(), timedelta(0))
        self.assertEqual(get_monitor(monitor["id"], self.db_path), monitor)

    def test_invalid_names_are_rejected_without_insertion(self):
        for name in ["", "   ", "\t\n", None]:
            with self.subTest(name=name):
                with self.assertRaises(ValueError):
                    create_monitor(name, "https://example.com", self.db_path)
        self.assertEqual(list_monitors(self.db_path), [])

    def test_invalid_urls_are_rejected_without_insertion(self):
        for url in ["", "example.com", "ftp://example.com", "https://",
                    "https://exa mple.com", "https://example.com:abc", None]:
            with self.subTest(url=url):
                with self.assertRaises(ValueError):
                    create_monitor("Exemple", url, self.db_path)
        self.assertEqual(list_monitors(self.db_path), [])

    def test_list_is_ordered_by_unique_ids(self):
        first = create_monitor("Z", "https://example.com/z", self.db_path)
        second = create_monitor("A", "https://example.com/a", self.db_path)
        self.assertLess(first["id"], second["id"])
        self.assertEqual(list_monitors(self.db_path), [first, second])

    def test_missing_monitor_returns_none_and_delete_returns_false(self):
        self.assertIsNone(get_monitor(999, self.db_path))
        self.assertFalse(delete_monitor(999, self.db_path))

    def test_delete_removes_only_requested_monitor(self):
        first = create_monitor("Premier", "https://example.com", self.db_path)
        second = create_monitor("Second", "https://example.org", self.db_path)
        self.assertTrue(delete_monitor(first["id"], self.db_path))
        self.assertIsNone(get_monitor(first["id"], self.db_path))
        self.assertFalse(delete_monitor(first["id"], self.db_path))
        self.assertEqual(list_monitors(self.db_path), [second])
        third = create_monitor("Troisième", "https://example.net", self.db_path)
        self.assertNotIn(third["id"], [first["id"], second["id"]])

    def test_data_persists_after_connection_is_closed(self):
        monitor = create_monitor("Exemple", "https://example.com", self.db_path)
        with closing(sqlite3.connect(self.db_path)) as connection:
            row = connection.execute(
                "SELECT name, url, created_at FROM monitors WHERE id = ?", (monitor["id"],)
            ).fetchone()
        self.assertEqual(row, (monitor["name"], monitor["url"], monitor["created_at"]))

    def test_sql_values_are_stored_as_data(self):
        name = "Site'); DROP TABLE monitors; --"
        url = "https://example.com/?q=';DELETE"
        monitor = create_monitor(name, url, self.db_path)
        self.assertEqual(get_monitor(monitor["id"], self.db_path), monitor)
        self.assertEqual(list_monitors(self.db_path), [monitor])
        self.assertIsNone(get_monitor("1 OR 1=1", self.db_path))
        self.assertFalse(delete_monitor("1 OR 1=1", self.db_path))
        self.assertEqual(list_monitors(self.db_path), [monitor])

    def test_connection_is_closed_and_failed_transaction_is_rolled_back(self):
        with self.assertRaises(RuntimeError):
            with connect_database(self.db_path) as connection:
                connection.execute(
                    "INSERT INTO monitors (name, url, created_at) VALUES (?, ?, ?)",
                    ("Exemple", "https://example.com", "2026-10-06T00:00:00+00:00"),
                )
                raise RuntimeError("Échec simulé")
        self.assertEqual(list_monitors(self.db_path), [])
        with self.assertRaises(sqlite3.ProgrammingError):
            connection.execute("SELECT 1")

    def test_app_initializes_configured_database_and_preserves_data(self):
        path = self.db_path.parent / "app.db"
        app = create_app({"TESTING": True, "DATABASE_PATH": path})
        self.assertTrue(path.is_file())
        monitor = create_monitor("Exemple", "https://example.com", path)
        restarted_app = create_app({"TESTING": True, "DATABASE_PATH": path})
        self.assertEqual(list_monitors(path), [monitor])
        for application in [app, restarted_app]:
            with application.test_client() as client:
                response = client.get("/api/health")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.get_json(), {"status": "ok"})

    def test_default_database_path_is_absolute_and_in_backend_data(self):
        expected = Path(__file__).resolve().parents[1] / "data" / "uptime.db"
        self.assertTrue(DATABASE_PATH.is_absolute())
        self.assertEqual(DATABASE_PATH, expected)


if __name__ == "__main__":
    unittest.main()
