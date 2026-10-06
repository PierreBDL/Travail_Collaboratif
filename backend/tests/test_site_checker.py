import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import requests

from backend.src.app import create_app
from backend.src.services.site_checker import check_site


class SiteCheckerTests(unittest.TestCase):
    def setUp(self):
        patcher = patch("backend.src.services.site_checker.requests.get")
        self.get = patcher.start()
        self.addCleanup(patcher.stop)
        self.response = MagicMock()
        self.response.status_code = 200
        self.get.return_value.__enter__.return_value = self.response

    def test_success_returns_complete_result(self):
        result = check_site("https://example.com")

        self.assertEqual(set(result), {
            "url", "available", "status_code", "response_time_ms", "checked_at", "error"
        })
        self.assertEqual(result["url"], "https://example.com")
        self.assertTrue(result["available"])
        self.assertEqual(result["status_code"], 200)
        self.assertIsNone(result["error"])
        self.assertGreaterEqual(result["response_time_ms"], 0)
        self.assertEqual(datetime.fromisoformat(result["checked_at"]).utcoffset(), timedelta(0))
        self.get.assert_called_once_with(
            "https://example.com", timeout=5, allow_redirects=True, stream=True
        )
        self.get.return_value.__exit__.assert_called_once()

    def test_final_status_after_redirect_is_used(self):
        redirect = MagicMock(status_code=301)
        self.response.history = [redirect]
        self.response.status_code = 200

        result = check_site("http://example.com")

        self.assertTrue(result["available"])
        self.assertEqual(result["status_code"], 200)
        self.assertTrue(self.get.call_args.kwargs["allow_redirects"])

    def test_status_boundaries(self):
        for status, available in [(199, False), (200, True), (204, True),
                                  (399, True), (400, False), (404, False), (500, False)]:
            with self.subTest(status=status):
                self.response.status_code = status
                result = check_site("https://example.com")
                self.assertEqual(result["available"], available)
                self.assertEqual(result["status_code"], status)
                self.assertIsNone(result["error"])

    def test_network_errors_are_returned(self):
        for exception, message in [
            (requests.Timeout(), "Délai d'attente réseau dépassé (5 secondes)."),
            (requests.ConnectionError(), "Impossible de se connecter au site."),
            (requests.TooManyRedirects(), "Nombre maximal de redirections dépassé."),
            (requests.RequestException(), "Erreur lors de la requête HTTP."),
        ]:
            with self.subTest(exception=type(exception).__name__):
                self.get.side_effect = exception
                result = check_site("https://example.com")
                self.assertFalse(result["available"])
                self.assertIsNone(result["status_code"])
                self.assertEqual(result["error"], message)
                self.assertGreaterEqual(result["response_time_ms"], 0)

    def test_invalid_urls_are_rejected_before_network_access(self):
        for url in ["", "example.com", "ftp://example.com", "https://",
                    "https:///path", "https://exa mple.com", "https://[broken",
                    "https://example.com:abc", "https://example.com:65536", None]:
            with self.subTest(url=url):
                with self.assertRaises(ValueError):
                    check_site(url)
        self.get.assert_not_called()

    def test_response_time_is_measured_in_milliseconds(self):
        with patch("backend.src.services.site_checker.perf_counter", side_effect=[10, 10.125]):
            result = check_site("https://example.com")
        self.assertEqual(result["response_time_ms"], 125.0)

    def test_health_route_still_works(self):
        with TemporaryDirectory() as directory:
            app = create_app({"TESTING": True, "DATABASE_PATH": Path(directory) / "test.db"})
            with app.test_client() as client:
                response = client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "ok"})
        self.get.assert_not_called()


if __name__ == "__main__":
    unittest.main()
