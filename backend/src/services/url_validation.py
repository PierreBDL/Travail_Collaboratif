from urllib.parse import urlsplit


def validate_url(url: str) -> None:
    if not isinstance(url, str) or not url or any(char.isspace() for char in url):
        raise ValueError("L'URL doit être une adresse HTTP ou HTTPS valide.")
    try:
        parsed = urlsplit(url)
        valid = parsed.scheme in {"http", "https"} and bool(parsed.hostname)
        parsed.port
    except ValueError as exc:
        raise ValueError("L'URL doit être une adresse HTTP ou HTTPS valide.") from exc
    if not valid:
        raise ValueError("L'URL doit inclure le protocole HTTP ou HTTPS et un hôte.")
