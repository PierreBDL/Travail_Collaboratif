# Uptime Monitor

Projet collaboratif de suivi de disponibilité de sites web, avec un frontend HTML/CSS et un backend Python.

## État actuel

Le backend Flask expose une route de santé. La vérification des sites, le stockage SQLite et le dashboard seront ajoutés dans les prochaines issues.

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
