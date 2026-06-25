# Frontend BCX Finance

Frontend React/Vite de BCX Finance, centre de navigation entre les deux univers du projet :

- Univers Investisseur
- Univers PME

Cette application consomme l'API backend `http://localhost:3003/api`, gere le routage cote client avec React Router, et integre MetaMask ainsi que `ethers.js` pour les interactions blockchain.

## Objectif du frontend

- Fournir une interface utilisateur pour les investisseurs.
- Fournir une interface utilisateur pour les PME.
- Exposer les pages publiques, privees et admin.
- Gerer la connexion au wallet MetaMask.
- Consommer les routes REST du backend BCX Finance.

## Stack technique

- React 19
- Vite 8
- React Router DOM 7
- Axios
- ethers.js
- Recharts
- lucide-react

## Scripts disponibles

Depuis le dossier `frontend` :

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Variables d'environnement

Le frontend attend le fichier `.env` a la racine du dossier `frontend`.

### Variable requise

```env
VITE_BCX_CONTRACT_ADDRESS=<adresse_du_contrat_sur_sepolia>
```

Cette variable est utilisee dans `src/services/web3.js` pour lire le solde BCX on-chain et pour les operations liees au contrat.

## Structure du dossier frontend

```text
frontend/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- hooks/
|   |-- pages/
|   |-- pme/
|   |-- services/
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- .env
|-- .env.example
|-- eslint.config.js
|-- index.html
|-- package.json
|-- package-lock.json
|-- README.md
`-- vite.config.js
```

## Architecture applicative

Le point d'entree est `src/main.jsx`, qui monte `App.jsx`.

`App.jsx` definit trois grandes zones :

1. Pages publiques
2. Espace Investisseur
3. Espace PME

### Pages publiques

- `/`
- `/login`
- `/inscription`
- `/pme/connexion`
- `/pme/inscription`

### Espace Investisseur

- `/dashboard`
- `/depot/nouveau`
- `/depot/mes-depots`
- `/profil`
- `/ayants-droit`
- `/tableau-bord`
- `/admin`

### Espace PME

- `/pme/dashboard`
- `/pme/nouvelle-transaction`
- `/pme/score`
- `/pme/rapport`
- `/pme/profil`

## Modules presentes

### Investisseur

- `src/pages/Login.jsx`
- `src/pages/InscriptionInvestisseur.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/NewDepot.jsx`
- `src/pages/MesDepots.jsx`
- `src/pages/Profil.jsx`
- `src/pages/AyantDroit.jsx`
- `src/pages/TableBord.jsx`
- `src/pages/AdminPanel.jsx`

### PME

- `src/pages/PME/ConnexionPME.jsx`
- `src/pages/PME/InscriptionPME.jsx`
- `src/pages/PME/DashboardPME.jsx`
- `src/pages/PME/NouvelleTransaction.jsx`
- `src/pages/PME/ScoreBCX.jsx`
- `src/pages/PME/RapportMensuel.jsx`
- `src/pages/PME/ProfilPME.jsx`

## Composants principaux

- `src/components/Layout.jsx`
- `src/components/Sidebar.jsx`
- `src/components/Navbar.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/components/ProtectedRoutePME.jsx`
- `src/components/ToastContainer.jsx`
- `src/components/PME/NavbarPME.jsx`

## Particularite de l'arborescence PME

Le projet contient deux arbres PME :

- `src/pages/PME/` est celui qui est utilise par `App.jsx`
- `src/pme/` contient une seconde copie de composants et pages PME

Pour l'etat actuel du projet, la reference fonctionnelle principale est `src/pages/PME/`.

## Integration backend

Le frontend consomme le backend via `src/services/api.js`.

Base URL actuelle :

```text
http://localhost:3003/api
```

Routes consommees :

- `/auth/connexion`
- `/auth/inscription`
- `/depots`
- `/depots/compte`
- `/depots/admin/tous`
- `/depots/:id/valider`
- `/depots/:id/refuser`
- `/depots/wallet`
- `/ayants-droit`
- `/admin/stats`
- `/pme/connexion`
- `/pme/inscription`
- `/pme/dashboard`
- `/pme/transactions`
- `/pme/score`
- `/pme/rapport-pdf`

## Integration blockchain

### Cote frontend

- `src/services/web3.js` utilise `ethers.js`
- detection de MetaMask
- connexion au wallet utilisateur
- lecture du solde BCX on-chain
- envoi d'un depot crypto via MetaMask
- verification du reseau Sepolia (`chainId 11155111`)

### Comportements relies au wallet

- `src/pages/NewDepot.jsx`
- `src/pages/Profil.jsx`
- `src/services/web3.js`

## Donnees locales et cache

Certaines pages PME utilisent un cache local pour le mode hors ligne, notamment :

- `src/pages/PME/DashboardPME.jsx`
- `src/pages/PME/RapportMensuel.jsx`
- `src/pages/PME/ScoreBCX.jsx`

## Cohérence du code

Le frontend utilise :

- imports React cohérents avec les pages montées dans `App.jsx`
- exports par defaut pour chaque page principale
- `ProtectedRoute` pour l'espace investisseur
- `ProtectedRoutePME` pour l'espace PME

## Lancement rapide

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Etat actuel

Le frontend est fonctionnel, compile avec `npm run build`, et expose les deux univers BCX Finance dans une SPA unique.

