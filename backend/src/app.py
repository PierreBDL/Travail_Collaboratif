from flask import Flask

from backend.src.config.settings import DATABASE_PATH
from backend.src.database.connection import init_database


def create_app(config: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config["DATABASE_PATH"] = DATABASE_PATH
    if config is not None:
        app.config.update(config)
    init_database(app.config["DATABASE_PATH"])

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
