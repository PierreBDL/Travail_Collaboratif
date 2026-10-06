from datetime import datetime, timezone
from time import perf_counter
from typing import TypedDict

import requests

from backend.src.services.url_validation import validate_url

TIMEOUT_SECONDS = 5

class CheckResult(TypedDict):
    url: str
    available: bool
    status_code: int | None
    response_time_ms: float
    checked_at: str
    error: str | None


def check_site(url: str) -> CheckResult:
    validate_url(url)
    result: CheckResult = {
        "url": url,
        "available": False,
        "status_code": None,
        "response_time_ms": 0.0,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "error": None,
    }
    started_at = perf_counter()
    try:
        with requests.get(
            url, timeout=TIMEOUT_SECONDS, allow_redirects=True, stream=True
        ) as response:
            result["status_code"] = response.status_code
            result["available"] = 200 <= response.status_code < 400
    except requests.Timeout:
        result["error"] = "Délai d'attente réseau dépassé (5 secondes)."
    except requests.ConnectionError:
        result["error"] = "Impossible de se connecter au site."
    except requests.TooManyRedirects:
        result["error"] = "Nombre maximal de redirections dépassé."
    except requests.RequestException:
        result["error"] = "Erreur lors de la requête HTTP."
    finally:
        result["response_time_ms"] = round((perf_counter() - started_at) * 1000, 3)
    return result
