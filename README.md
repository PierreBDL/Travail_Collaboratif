# Uptime Monitor

Projet collaboratif de suivi de disponibilité de sites web, avec un frontend HTML/CSS et un backend Python.

## État actuel

Le backend Flask expose une route de santé, un service Python de vérification ponctuelle des sites et un stockage SQLite des moniteurs. Les routes des moniteurs, l'historique des vérifications, la planification des contrôles et le dashboard seront ajoutés dans les prochaines issues.

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

## Stocker les moniteurs dans SQLite

Au démarrage, Flask appelle `create_app()` et initialise automatiquement la base `backend/data/uptime.db`. Le dossier et la table `monitors` sont créés si nécessaire. Les démarrages suivants conservent les données existantes.

Le chemin est défini dans `backend/src/config/settings.py` et reste indépendant du répertoire courant. SQLite est fourni avec Python : aucune dépendance supplémentaire n'est nécessaire. La base et ses fichiers auxiliaires sont exclus de Git ; chaque membre du groupe possède sa propre base locale.

Un moniteur contient `id` (identifiant unique), `name`, `url` et `created_at` (date ISO 8601 en UTC). Un nom vide est refusé, les espaces en début et en fin de nom sont retirés et l'URL doit respecter la même validation HTTP/HTTPS que le service de vérification. Plusieurs moniteurs peuvent utiliser la même URL.

La couche d'accès dans `backend/src/database/monitors.py` peut être utilisée sans démarrer Flask. Depuis la racine du projet, ouvrir Python :

```powershell
./backend/.venv/Scripts/python.exe
```

Puis exécuter :

```python
from backend.src.database.connection import init_database
from backend.src.database.monitors import create_monitor, list_monitors, get_monitor, delete_monitor

init_database()
monitor = create_monitor("Exemple", "https://example.com")
print(list_monitors())
print(get_monitor(monitor["id"]))
print(delete_monitor(monitor["id"]))  # True si le moniteur a été supprimé.
print(get_monitor(monitor["id"]))     # None : il n'existe plus.
```

Sous macOS ou Linux, utiliser `./backend/.venv/bin/python`.

`list_monitors()` renvoie les moniteurs par identifiant croissant. `get_monitor(id)` renvoie `None` si l'identifiant est absent ; `delete_monitor(id)` renvoie alors `False`. Un nom ou une URL invalide lève `ValueError` sans insertion. Chaque opération ferme sa connexion ; les écritures réussies sont enregistrées et une transaction en erreur est annulée.

Pour utiliser une autre base, passer `db_path=chemin` à `init_database()` et aux fonctions d'accès. Pour une application Flask, utiliser `create_app({"DATABASE_PATH": chemin})`. Cette configuration permet notamment aux tests d'utiliser des bases temporaires. L'ajout d'un moniteur ne déclenche aucune vérification réseau.

## Lancer les tests du backend

Les tests utilisent `unittest`, fourni avec Python, simulent les réponses HTTP et créent des bases SQLite temporaires supprimées à la fin des tests. Ils ne modifient pas `backend/data/uptime.db` et ne nécessitent ni connexion Internet ni serveur Flask démarré.

Sous Windows, après installation des dépendances :

```powershell
./backend/.venv/Scripts/python.exe -m unittest discover -s backend/tests -v
```

Sous macOS ou Linux :

```sh
./backend/.venv/bin/python -m unittest discover -s backend/tests -v
```
