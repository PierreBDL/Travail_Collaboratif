from datetime import datetime, timezone
from urllib.parse import urlsplit

from flask import Flask, request
from werkzeug.exceptions import BadRequest

from backend.src.config.settings import DATABASE_PATH
from backend.src.database.connection import init_database
from backend.src.database.checks import get_statistics, save_check
from backend.src.database.monitors import get_monitor_by_url
from backend.src.services.site_checker import check_site
from backend.src.services.url_validation import validate_url


def create_app(config: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config["DATABASE_PATH"] = DATABASE_PATH
    if config is not None:
        app.config.update(config)
    init_database(app.config["DATABASE_PATH"])

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    @app.post("/api/health")
    def website_health():
        if not request.is_json:
            return {"error": "Le Content-Type doit être application/json."}, 415
        try:
            body = request.get_json()
        except BadRequest:
            return {"error": "Le corps JSON est mal formé."}, 400
        if not isinstance(body, dict):
            return {"error": "Le corps JSON doit être un objet contenant website."}, 400
        url = body.get("website")
        try:
            validate_url(url)
        except ValueError as exc:
            return {"error": str(exc)}, 400
        result = check_site(url)
        db_path = app.config["DATABASE_PATH"]
        save_check(result, db_path)
        monitor = get_monitor_by_url(url, db_path)
        return {
            "state": "uptime" if result["available"] else "down",
            "name": monitor["name"] if monitor else urlsplit(url).hostname,
            "link": url,
            "responseTime": result["response_time_ms"],
            **get_statistics(url, datetime.now(timezone.utc), db_path),
        }

    return app
