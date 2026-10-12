import json
import unittest
from datetime import datetime, timezone
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import MagicMock, patch

import requests

from backend.src.app import create_app
from backend.src.database.checks import get_statistics, save_check
from backend.src.database.connection import connect_database
from backend.src.database.monitors import create_monitor


class WebsiteHealthTests(unittest.TestCase):
    def setUp(self):
        directory = TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.path = Path(directory.name) / "test.db"
        self.app = create_app({"TESTING": True, "DATABASE_PATH": self.path})
        self.client = self.app.test_client()
        patcher = patch("backend.src.services.site_checker.requests.get")
        self.network = patcher.start()
        self.addCleanup(patcher.stop)
        self.response = MagicMock()
        self.response.status_code = 200
        self.network.return_value.__enter__.return_value = self.response

    def test_success_contract_and_first_check(self):
        with patch("backend.src.services.site_checker.perf_counter", side_effect=[10, 10.18]):
            response = self.client.post("/api/health", json={"website": "https://example.com"})
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertEqual(set(body), {"state", "name", "link", "responseTime", "disponibilityRate", "lastdays"})
        self.assertEqual(body["state"], "uptime")
        self.assertEqual(body["name"], "example.com")
        self.assertEqual(body["link"], "https://example.com")
        self.assertEqual(body["responseTime"], 180)
        self.assertEqual(body["disponibilityRate"], 100)
        self.assertEqual(len(body["lastdays"]), 1)
        self.assertEqual(body["lastdays"][0]["state"], "uptime")
        self.assertEqual(body["lastdays"][0]["date"], datetime.now(timezone.utc).date().isoformat())

    def test_registered_name_uses_first_matching_monitor(self):
        create_monitor("Premier", "https://example.com", self.path)
        create_monitor("Second", "https://example.com", self.path)
        response = self.client.post("/api/health", json={"website": "https://example.com"})
        self.assertEqual(response.get_json()["name"], "Premier")

    def test_http_statuses_and_network_failures(self):
        cases = [(200, "uptime"), (301, "uptime"), (399, "uptime"), (400, "down"),
                 (500, "down"), (requests.Timeout(), "down"),
                 (requests.ConnectionError(), "down")]
        for index, (outcome, state) in enumerate(cases):
            with self.subTest(outcome=outcome):
                self.network.side_effect = outcome if isinstance(outcome, Exception) else None
                if isinstance(outcome, int):
                    self.response.status_code = outcome
                response = self.client.post("/api/health", json={"website": f"https://example.com/{index}"})
                self.assertEqual(response.status_code, 200)
                body = response.get_json()
                self.assertEqual(body["state"], state)
                self.assertEqual(body["disponibilityRate"], 100 if state == "uptime" else 0)
                self.assertIsInstance(body["responseTime"], (int, float))
                self.assertGreaterEqual(body["responseTime"], 0)

    def test_invalid_bodies_do_not_check_or_insert(self):
        for body in [None, [], "url", {}, {"website": None}, {"website": 42},
                     {"website": ""}, {"website": "ftp://example.com"},
                     {"website": "https://exa mple.com"}]:
            with self.subTest(body=body):
                response = self.client.post("/api/health", data=json.dumps(body), content_type="application/json")
                self.assertEqual(response.status_code, 400)
                self.assertIn("error", response.get_json())
        response = self.client.post("/api/health", data="{", content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())
        response = self.client.post("/api/health", data="website=https://example.com")
        self.assertEqual(response.status_code, 415)
        self.assertIn("error", response.get_json())
        self.network.assert_not_called()
        with connect_database(self.path) as connection:
            self.assertEqual(connection.execute("SELECT COUNT(*) FROM checks").fetchone()[0], 0)

    def test_history_survives_restart_and_includes_current_check(self):
        self.client.post("/api/health", json={"website": "https://example.com"})
        self.response.status_code = 500
        restarted = create_app({"TESTING": True, "DATABASE_PATH": self.path})
        response = restarted.test_client().post("/api/health", json={"website": "https://example.com"})
        body = response.get_json()
        self.assertEqual(body["disponibilityRate"], 50)
        self.assertEqual(body["lastdays"][0]["state"], "down")
        self.assertEqual(self.client.get("/api/health").get_json(), {"status": "ok"})

    def test_statistics_calendar_boundaries_and_url_isolation(self):
        now = datetime(2026, 10, 12, 12, tzinfo=timezone.utc)
        for timestamp, available in [
            ("2026-09-12T23:59:59+00:00", False),
            ("2026-09-13T00:00:00+00:00", True),
            ("2026-10-11T14:00:00+02:00", True),
            ("2026-10-12T09:00:00+00:00", True),
            ("2026-10-12T10:00:00+00:00", False),
            ("2026-10-12T12:00:01+00:00", False),
        ]:
            save_check({"url": "https://example.com", "available": available,
                        "status_code": 200 if available else 500, "response_time_ms": 10,
                        "checked_at": timestamp, "error": None}, self.path)
        save_check({"url": "https://other.com", "available": False, "status_code": 500,
                    "response_time_ms": 10, "checked_at": now.isoformat(), "error": None}, self.path)
        self.assertEqual(get_statistics("https://example.com", now, self.path), {
            "disponibilityRate": 75,
            "lastdays": [{"date": "2026-09-13", "state": "uptime"},
                         {"date": "2026-10-11", "state": "uptime"},
                         {"date": "2026-10-12", "state": "down"}],
        })
        self.assertEqual(get_statistics("https://missing.com", now, self.path),
                         {"disponibilityRate": 0, "lastdays": []})


if __name__ == "__main__":
    unittest.main()
