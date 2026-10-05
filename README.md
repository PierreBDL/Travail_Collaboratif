# Uptime Monitor

Projet collaboratif de suivi de disponibilité de sites web, avec un frontend HTML/CSS et un backend Python.

## État actuel

Le backend Flask expose une route de santé et un service Python de vérification ponctuelle des sites. Le stockage SQLite, les routes des moniteurs, la planification des contrôles et le dashboard seront ajoutés dans les prochaines issues.

## Prérequis

- Python 3.12 ou supérieur.
- Exécuter les commandes suivantes depuis la racine du projet.

## Installation sous Windows (PowerShell)

```powershell
python -m venv backend/.venv
./backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
```

## Démarrage sous Windows

```powershell
./backend/.venv/Scripts/python.exe -m flask --app backend/src/app run
```

Le serveur local est accessible sur http://127.0.0.1:5000. Arrêter le serveur avec Ctrl+C.

## Installation et démarrage sous macOS ou Linux

```sh
python3 -m venv backend/.venv
./backend/.venv/bin/python -m pip install -r backend/requirements.txt
./backend/.venv/bin/python -m flask --app backend/src/app run
```

## Vérifier le backend

Ouvrir http://127.0.0.1:5000/api/health dans un navigateur. La réponse attendue est un code HTTP 200 avec :

```json
{"status": "ok"}
```

Sous PowerShell, le code HTTP peut être vérifié avec :

```powershell
(Invoke-WebRequest -Uri http://127.0.0.1:5000/api/health).StatusCode
```

La racine `/` ne possède pas encore de page et renvoie un code HTTP 404.

Le serveur Flask utilisé ici est destiné au développement local.

## Vérifier la disponibilité d'un site

Le service s'utilise directement en Python, indépendamment du serveur Flask. Depuis la racine du projet, avec les dépendances installées :

```powershell
./backend/.venv/Scripts/python.exe -c "from backend.src.services.site_checker import check_site; print(check_site('https://example.com'))"
```

Sous macOS ou Linux, remplacer `./backend/.venv/Scripts/python.exe` par `./backend/.venv/bin/python`.

`check_site(url)` renvoie un dictionnaire contenant :

| Champ | Description |
| --- | --- |
| `url` | URL demandée au service. |
| `available` | `True` si le code HTTP final est compris entre 200 et 399, sinon `False`. |
| `status_code` | Code HTTP final, ou `None` en cas d'erreur réseau. |
| `response_time_ms` | Durée de la vérification en millisecondes, jusqu'à réception des en-têtes ou à l'erreur. |
| `checked_at` | Date de début de la vérification au format ISO 8601, en UTC. |
| `error` | Message d'erreur réseau, ou `None` lorsqu'une réponse HTTP est reçue. |

Le service accepte uniquement les URL HTTP ou HTTPS avec un hôte. Une URL invalide lève `ValueError` avant tout accès réseau. Les redirections sont suivies et les codes HTTP 404 ou 500 sont conservés dans le résultat. Le corps de la réponse finale n'est pas téléchargé.

Le délai réseau est fixé à cinq secondes pour la connexion et la lecture. Ce délai n'est pas une limite globale de cinq secondes pour toute la vérification : plusieurs redirections peuvent allonger la durée totale.

## Lancer les tests du backend

Les tests utilisent `unittest`, fourni avec Python, et simulent les réponses HTTP. Ils ne nécessitent ni connexion Internet ni serveur Flask démarré.

Sous Windows, après installation des dépendances :

```powershell
./backend/.venv/Scripts/python.exe -m unittest discover -s backend/tests -v
```

Sous macOS ou Linux :

```sh
./backend/.venv/bin/python -m unittest discover -s backend/tests -v
```
