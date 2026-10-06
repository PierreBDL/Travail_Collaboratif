from pathlib import Path


# Chemin indépendant du répertoire depuis lequel le serveur est démarré.
DATABASE_PATH = Path(__file__).resolve().parents[2] / "data" / "uptime.db"
