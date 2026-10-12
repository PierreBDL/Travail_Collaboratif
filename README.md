# Uptime Monitor

Application de suivi de disponibilité de sites web, réalisée en binôme dans le cadre du cours **Travail Collaboratif & Doc Technique**. Elle permet de vérifier un site, mesurer son temps de réponse et retrouver ses résultats précédents.

Le backend Python/Flask conserve les données dans SQLite. Le frontend React propose un tableau de bord avec un thème clair et sombre. Le projet sert également à pratiquer les issues, les branches, les Pull Requests et la revue de code.

## État du projet

| Disponible | À réaliser |
| --- | --- |
| Vérification HTTP/HTTPS à la demande via l’API | Connexion du tableau de bord à l’API |
| Stockage des moniteurs et des contrôles dans SQLite | Gestion des moniteurs par des routes HTTP |
| Statistiques sur 30 jours calendaires UTC | Vérifications automatiques et rafraîchissement des résultats |
| Cartes de sites et thème clair/sombre | Ajout de sites depuis l’interface |

**Le tableau de bord affiche des données de démonstration**, définies dans `frontend/src/data/WebsiteData.tsx`. Elles ne représentent pas la disponibilité réelle des sites. Le bouton « Ajouter un site » n’est pas encore fonctionnel. Les vérifications réelles se font via l’API décrite ci-dessous.

## Technologies et prérequis

| Élément | Version / rôle |
| --- | --- |
| Python | 3.12 ou supérieur, avec `pip` et `venv` |
| Flask | `>=3.1,<3.2` : API HTTP |
| requests | `>=2.32,<3` : contrôles réseau |
| SQLite | Fourni avec Python via `sqlite3` ; aucun serveur à installer |
| Node.js | 22.13+ dans la branche 22, ou 24+ ; la branche 20 est aussi acceptée à partir de 20.19 |
| npm | Fourni avec Node.js ; installation depuis `package-lock.json` |
| Frontend | React 19, TypeScript 6, Vite 8 et Tailwind CSS 4 |
| Git | Clonage et contribution au dépôt |

Une connexion Internet est nécessaire pour installer les dépendances et vérifier des sites externes. Les tests backend simulent les appels réseau.

## Installation et démarrage rapide

### 1. Cloner le dépôt

```sh
git clone https://github.com/PierreBDL/Travail_Collaboratif.git
cd Travail_Collaboratif
```

Les commandes backend s’exécutent à la **racine du dépôt**. Aucun fichier `.env` ni activation de l’environnement virtuel n’est nécessaire pour cette configuration locale.

### 2. Démarrer le backend dans un premier terminal

Sous Windows, avec PowerShell :

```powershell
python -m venv backend/.venv
./backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
./backend/.venv/Scripts/python.exe -m flask --app backend/src/app run
```

Sous macOS ou Linux :

```sh
python3 -m venv backend/.venv
./backend/.venv/bin/python -m pip install -r backend/requirements.txt
./backend/.venv/bin/python -m flask --app backend/src/app run
```

L’API écoute sur **http://127.0.0.1:5000**. La base `backend/data/uptime.db`, ses tables et son index sont créés automatiquement au démarrage. Les données existantes sont conservées.

### 3. Démarrer le frontend dans un deuxième terminal

Ouvrir un autre terminal à la **racine du dépôt**, puis :

```sh
cd frontend
npm ci
npm run dev
```

Ouvrir l’adresse affichée par Vite, généralement **http://localhost:5173**. Si le port est occupé, Vite peut en choisir un autre. Les deux applications tournent dans des terminaux séparés ; arrêter chacune avec `Ctrl+C`.

Sous PowerShell, si `npm.ps1` est bloqué, utiliser `npm.cmd ci` et `npm.cmd run dev`.

## Démonstration

### Consulter le tableau de bord

Ouvrir l’adresse Vite : les cartes affichent les états de démonstration, les historiques et les taux de disponibilité. Le bouton de thème dans l’en-tête permet de basculer entre les modes clair et sombre. L’interface ne déclenche pas encore d’appel au backend.

### Effectuer une vraie vérification

Avec le backend démarré, ouvrir http://127.0.0.1:5000/api/health : la réponse attendue est `{"status":"ok"}` avec HTTP 200. Cette route vérifie seulement que le backend répond.

Pour contrôler un site, ouvrir un **troisième terminal** et envoyer une requête POST.

Sous PowerShell :

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:5000/api/health -ContentType application/json -Body '{"website":"https://example.com"}' | ConvertTo-Json -Depth 5
```

Sous macOS ou Linux :

```sh
curl -X POST http://127.0.0.1:5000/api/health -H 'Content-Type: application/json' -d '{"website":"https://example.com"}'
```

Exemple de réponse lors d’un premier contrôle réussi ; la date et la durée varient :

```json
{
  "state": "uptime",
  "name": "example.com",
  "link": "https://example.com",
  "responseTime": 180,
  "disponibilityRate": 100,
  "lastdays": [{"date": "2026-10-12", "state": "uptime"}]
}
```

Le résultat est enregistré dans SQLite. Répéter la requête ajoute un contrôle à l’historique ; redémarrer le backend ne l’efface pas. Un site inaccessible produit `state: "down"` et reste un résultat valide de l’API.

## API et statistiques

| Méthode et route | Entrée | Résultat |
| --- | --- | --- |
| `GET /api/health` | Aucune | Santé du backend : `{"status":"ok"}` |
| `POST /api/health` | JSON avec `website`, une URL HTTP/HTTPS | Vérification, enregistrement et statistiques |

La route POST accepte `application/json` et les types `application/*+json`. Un JSON mal formé, un champ `website` absent ou une URL invalide renvoie **400** ; un type de contenu non JSON renvoie **415**. Ces erreurs contiennent `{"error":"message explicite"}` sans contrôle réseau ni insertion. Un résultat de contrôle, même négatif, renvoie **200**.

| Champ | Signification |
| --- | --- |
| `state` | `uptime` pour un code HTTP final de 200 à 399 ; `down` sinon, y compris timeout ou erreur de connexion |
| `name` | Nom du premier moniteur ayant cette URL, par identifiant croissant ; sinon nom d’hôte |
| `link` | URL exacte demandée |
| `responseTime` | Millisecondes jusqu’aux en-têtes ou à l’erreur ; pas le chargement complet d’une page |
| `disponibilityRate` | Pourcentage de contrôles réussis, arrondi à deux décimales ; orthographe conservée pour le contrat frontend |
| `lastdays` | Dates UTC `YYYY-MM-DD` par ordre croissant, avec un état `uptime` ou `down` |

La fenêtre couvre **30 jours calendaires UTC**, depuis minuit il y a 29 jours jusqu’à maintenant. Le contrôle courant est inclus. Un jour est `down` si au moins un contrôle échoue ; les jours sans contrôle sont omis. Au premier appel, le taux vaut 100 ou 0 et seul le jour courant apparaît. Ce taux porte sur les contrôles effectués, pas sur une durée de disponibilité mesurée en continu. Le logo `image` reste géré par le frontend.

## Stockage et utilisation depuis Python

Le chemin absolu de la base est défini dans `backend/src/config/settings.py`. `monitors` conserve `id`, `name`, `url` et `created_at` ; `checks` conserve les résultats des contrôles. Les dates sont en UTC. Les fichiers SQLite, les caches Python et les environnements virtuels sont exclus de Git.

Les fonctions restent utilisables sans Flask. Depuis la racine, ouvrir `./backend/.venv/Scripts/python.exe` sous Windows, ou `./backend/.venv/bin/python` sous macOS/Linux, puis :

```python
from backend.src.database.connection import init_database
from backend.src.database.monitors import create_monitor, list_monitors, get_monitor, delete_monitor

init_database()
monitor = create_monitor("Exemple", "https://example.com")
print(list_monitors())
print(get_monitor(monitor["id"]))
print(delete_monitor(monitor["id"]))
```

Un nom vide ou une URL invalide lève `ValueError`. La liste est triée par identifiant. Consulter un identifiant absent renvoie `None` ; supprimer renvoie `True` si une ligne est supprimée, sinon `False`. Plusieurs moniteurs peuvent partager une URL. Leur création ne lance aucun contrôle ; leur suppression n’efface pas l’historique de cette URL.

Le service `backend.src.services.site_checker.check_site(url)` s’utilise aussi directement : il renvoie `url`, `available`, `status_code`, `response_time_ms`, `checked_at` et `error`, sans enregistrer lui-même le résultat. Pour une autre base, passer `db_path` aux fonctions de stockage ou `create_app({"DATABASE_PATH": chemin})` à Flask.

## Tests et vérifications

Depuis la **racine du dépôt**, sous Windows :

```powershell
./backend/.venv/Scripts/python.exe -m unittest discover -s backend/tests -v
```

Sous macOS ou Linux :

```sh
./backend/.venv/bin/python -m unittest discover -s backend/tests -v
```

Les tests utilisent `unittest`, des appels réseau simulés et des bases temporaires supprimées après exécution. Ils ne modifient pas la base locale. Une exécution réussie se termine par `OK`.

Depuis **frontend**, après `npm ci` :

```sh
npm run lint
npm run build
```

Ces commandes vérifient les règles ESLint et la compilation TypeScript/Vite ; ce ne sont pas des tests fonctionnels. Après un build réussi, `npm run preview` permet d’ouvrir le résultat à l’adresse affichée dans le terminal.

## Structure du dépôt

```text
Travail_Collaboratif/
├── backend/
│   ├── src/
│   │   ├── app.py
│   │   ├── config/
│   │   ├── database/
│   │   └── services/
│   ├── tests/
│   ├── data/                 (créé au démarrage, ignoré par Git)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   └── pages/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

Le backend sépare la configuration, l’accès aux données et les services de vérification. Le frontend sépare les pages, les composants, les thèmes et les données de démonstration.

## Contribution et équipe

- **Matthieu** ([MathCat975](https://github.com/MathCat975)) : backend Python, API et stockage SQLite.
- **Pierre** ([PierreBDL](https://github.com/PierreBDL)) : frontend React et interface du tableau de bord.

Pour contribuer :

1. Créer une issue avec le contexte, le comportement attendu et les critères d’acceptation.
2. Créer une branche depuis `main` à jour : `feat/…`, `fix/…` ou `docs/…` selon la tâche.
3. Faire des commits ciblés au format `type(scope): description`, par exemple `docs(readme): actualise les instructions de lancement`.
4. Vérifier les changements et mettre à jour la documentation concernée.
5. Ouvrir une PR vers `main` avec le contexte, les changements, les vérifications et `Closes #numéro` pour l’issue associée.
6. Demander la revue du binôme, répondre aux retours et fusionner après approbation. Aucun changement n’est poussé directement sur `main`.

L’ADR backend sur le choix de SQLite a été rédigé séparément ; il reste à intégrer à cette branche pour être consultable et versionné dans le dépôt. La documentation utilisateur et le compte rendu illustré du cours sont des livrables distincts du README.

## Limites connues et dépannage

- **Pas de surveillance automatique** : les contrôles sont déclenchés par les appels POST. La fenêtre statistique ne purge pas les anciens résultats ; aucune rétention automatique n’est implémentée.
- **Intégration à réaliser** : aucun proxy Vite ni configuration CORS n’est en place pour les appels du navigateur vers Flask.
- **HTTP 404 sur `http://127.0.0.1:5000/`** : normal, Flask ne sert pas le dashboard ; utiliser l’adresse Vite.
- **Dépendance Python introuvable** : installer `backend/requirements.txt` avec le Python de l’environnement virtuel, puis lancer le serveur avec ce même exécutable.
- **Erreur de version Node.js** : vérifier `node --version`. Les prérequis de ce README correspondent au verrou de dépendances actuel ; le README du sous-dossier frontend indique encore Node.js 18.
- **Compilation frontend actuellement bloquée** : `npm run build` signale deux imports inutilisés (`ouvrirImg` dans `Card.tsx` et `searchImg` dans `Home.tsx`). Ils doivent être corrigés dans une tâche frontend distincte avant de produire une version compilée.
- **Vérification ESLint actuellement en échec** : `npm run lint` signale ces deux imports ainsi que la règle `react-refresh/only-export-components` dans `hooks/Theme.tsx`.
- **Temps d’attente réseau** : le délai de cinq secondes concerne la connexion et la lecture, pas la durée totale de toutes les redirections. Les contrôles sont synchrones.
- **Usage local** : le serveur Flask de développement et la validation actuelle des URL ne constituent pas une configuration de déploiement public.

## Licence

Aucune licence n’est actuellement définie dans le dépôt. Son choix doit être convenu par les auteurs ; ce README n’accorde pas de licence de réutilisation.
