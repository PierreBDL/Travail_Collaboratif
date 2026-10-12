# Frontend - Uptime Monitor

Ce dossier contient le frontend de l'application web de monitoring de sites.

## Prérequis

- Node.js 18 ou plus
- npm

## Installation

Depuis le dossier `frontend`, exécutez :

```bash
npm install
```

## Démarrage du projet

Pour lancer le projet en mode développement :

```bash
npm run dev
```

Ensuite, ouvrez l’URL affichée dans le terminal, généralement :

```bash
http://localhost:5173
```

## Stack utilisée

- React
- Vite
- TypeScript
- Tailwind CSS

## Structure principale

```bash
frontend/
├── src/
│   ├── assets/
│   ├── components/
|   |    └── Card.tsx
│   ├── pages/
|   |    └── Home.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md (ce fichier)
```

## Connexion au backend

Démarrer Flask depuis la racine du projet selon le README principal, puis lancer `npm run dev` ici. Vite transmet `/api` à `http://127.0.0.1:5000`, en développement et en aperçu. Pour une autre adresse, définir `API_PROXY_TARGET` dans `.env.local` et redémarrer Vite. En production, configurer un proxy `/api` sur le serveur d’hébergement.

Les URL du fichier `WebsiteData.tsx` servent de liste initiale. Au chargement, le front envoie pour chaque site `POST /api/health` avec le corps JSON `{ "website": "https://..." }`. Les cartes affichent exclusivement les valeurs reçues : état, nom, historique et taux de disponibilité. Une erreur sur un site n’empêche pas les autres cartes de s’afficher. Le délai côté front est de 60 secondes par contrôle.

« Actualiser les sites » déclenche de nouveaux contrôles, enregistrés par le backend existant. Le bloc « Connexion au serveur » utilise séparément `GET /api/health`. L’historique présente seulement les journées pour lesquelles le backend dispose de contrôles ; les jours manquants ne sont pas inventés. Le bouton « Ajouter un site » est conservé sans formulaire, comme dans la présentation fournie.
