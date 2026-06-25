# BCX Finance

BCX Finance est une plateforme web complete qui regroupe deux univers metiers :

- Univers Investisseur
- Univers PME

Le projet combine un backend Node.js/Express, un frontend React/Vite, une base de donnees MySQL geree avec Sequelize, et une integration blockchain sur Ethereum Sepolia via `ethers.js` et MetaMask.

## Objectifs du projet

- Permettre a un investisseur de creer un compte, se connecter, suivre ses depots et gerer ses ayants droit.
- Permettre a une PME de gerer ses recettes, depenses, Score BCX et rapports mensuels.
- Centraliser les traitements metier dans un backend unique sans conflit entre les deux univers.
- Exposer une couche de securite solide pour l'authentification, la validation et les acces admin.
- Conserver une integration blockchain pour les operations liees aux tokens BCX et au wallet.

## Architecture globale

La solution est organisee autour de trois blocs :

1. Backend API
   - Express 5
   - Authentification JWT
   - Sequelize + MySQL
   - middlewares de securite

2. Frontend web
   - React 19 + Vite
   - React Router DOM
   - pages Investisseur et PME
   - integration MetaMask / ethers.js

3. Blockchain
   - contrat `BCXToken.sol`
   - outils Hardhat
   - reseaux Sepolia et BSC Testnet configures dans le repo

## Technologies utilisees

### Backend

- Node.js
- Express 5
- Sequelize 6
- MySQL2
- jsonwebtoken
- bcryptjs
- helmet
- cors
- express-rate-limit
- express-validator
- dotenv
- ethers

### Frontend

- React 19
- Vite
- React Router DOM 7
- Axios
- ethers.js
- Recharts
- lucide-react

### Blockchain / Dev tooling

- Solidity 0.8.20
- Hardhat
- Hardhat Toolbox
- Sepolia
- BSC Testnet

## Structure des dossiers

```text
smart_contrat/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- migrations/
|   |-- models/
|   |-- routes/
|   |-- seeders/
|   |-- services/
|   |-- server.js
|   |-- package.json
|   `-- package-lock.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- pme/
|   |   |-- services/
|   |   `-- App.jsx
|   |-- package.json
|   `-- package-lock.json
|-- contracts/
|   `-- BCXToken.sol
|-- scripts/
|   |-- deploy.js
|   `-- interact.js
|-- test/
|-- hardhat.config.js
`-- README.md
```

## Module Investisseur (Groupe 2)

L'univers Investisseur couvre :

- inscription et connexion investisseur
- connexion admin
- creation et consultation des depots
- mise a jour du wallet
- gestion des ayants droit
- panneau admin pour la validation des depots et ayants droit
- statistiques admin globales

### Fonctionnalites principales

- authentification JWT avec role `investisseur` ou `admin`
- depot voie A et voie B
- consultation du compte et du solde BCX
- gestion du wallet investisseur
- gestion des ayants droit
- validation / refus cote admin
- tableau de bord admin avec statistiques globales

## Module PME (Groupe 1)

L'univers PME couvre :

- inscription PME
- connexion PME
- tableau de bord PME
- saisie de transactions
- calcul du Score BCX
- rapport mensuel
- profil PME

### Fonctionnalites principales

- authentification JWT dediee au role `pme`
- dashboard PME avec resume financier
- suivi des revenus et depenses
- Score BCX calcule sur 4 criteres
- export / consultation du rapport mensuel
- mode hors ligne et cache local cote frontend

## Architecture Backend

Le backend monte un serveur Express unique dans `backend/server.js`.

Routes montees :

- `/api/auth`
- `/api/depots`
- `/api/ayants-droit`
- `/api/admin`
- `/api/pme`

Mecanismes transverses :

- `helmet()` pour la protection HTTP
- `cors()` avec origine configurable
- `express.json()` pour le parsing JSON
- logger applicatif et logs de securite
- gestion centralisee des erreurs

## Architecture Frontend

Le frontend est une SPA React structuree autour de React Router.

Les zones principales sont :

- espace public
- espace investisseur
- espace admin
- espace PME

Le routing principal est defini dans `frontend/src/App.jsx`.

Pages Investisseur / Admin principales :

- `/login`
- `/inscription`
- `/dashboard`
- `/depot/nouveau`
- `/depot/mes-depots`
- `/profil`
- `/ayants-droit`
- `/tableau-bord`
- `/admin`

Pages PME principales :

- `/pme/inscription`
- `/pme/connexion`
- `/pme/dashboard`
- `/pme/nouvelle-transaction`
- `/pme/score`
- `/pme/rapport`
- `/pme/profil`

## Securite implemente

- Helmet : durcissement des en-tetes HTTP
- CORS : restrictions via `CORS_ALLOWED_ORIGINS`
- Rate Limiting : protection de `POST /api/auth/connexion`
- Validation des entrees : `express-validator`
- Gestion centralisee des erreurs : middleware global
- JWT : protection des routes privees
- bcryptjs : hashage des mots de passe
- logs de securite : 401, 403, 429

## Integration Blockchain

### Cote frontend

- `MetaMask` est detecte et utilise pour la connexion au wallet
- `ethers.js` est utilise dans `frontend/src/services/web3.js`
- le reseau attendu est `Sepolia` (`chainId 11155111`)
- lecture du solde BCX on-chain
- envoi de depots crypto via MetaMask

### Cote backend

- `backend/services/tokenService.js` utilise `ethers`
- lecture du RPC Sepolia via `SEPOLIA_RPC_URL`
- signature des transactions via `PRIVATE_KEY`
- transfert de BCX vers le wallet de l'investisseur
- calcul des tokens attribues

### BCX Token

Le contrat `contracts/BCXToken.sol` est un token EVM de type BCX, deploye via Hardhat et exploite dans l'ecosysteme BCX Finance.

## Base de donnees et modeles Sequelize

### Modeles backend

- `Investisseur`
- `Compte`
- `Depot`
- `AyantDroit`
- `ConversionToken`
- `TauxConversion`
- `PME`
- `TransactionPME`

### Relations

- `Investisseur` hasOne `Compte`
- `Investisseur` hasMany `Depot`
- `Investisseur` hasMany `AyantDroit`
- `Depot` belongsTo `Investisseur`
- `Depot` hasOne `ConversionToken`
- `Compte` belongsTo `Investisseur`
- `AyantDroit` belongsTo `Investisseur`
- `PME` hasMany `TransactionPME`
- `TransactionPME` belongsTo `PME`
- `ConversionToken` belongsTo `Depot`
- `ConversionToken` belongsTo `TauxConversion`
- `TauxConversion` hasMany `ConversionToken`

Les modeles sont auto-charges par `backend/models/index.js`.

## Variables d'environnement requises

### Backend / Root

```env
DB_HOST=localhost
DB_USER=<mysql_user>
DB_PASSWORD=<mysql_password>
DB_NAME=bcx_finance
DB_DIALECT=mysql
JWT_SECRET=<secret>
PORT=3003
CORS_ALLOWED_ORIGINS=http://localhost:5173
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=<private_key_sans_0x>
NODE_ENV=development
```

### Frontend

```env
VITE_BCX_CONTRACT_ADDRESS=<adresse_du_contrat_sur_sepolia>
```

## Procedure d'installation

### 1. Installer les dependances racine

```bash
npm install
```

### 2. Installer le backend

```bash
cd backend
npm install
```

### 3. Installer le frontend

```bash
cd frontend
npm install
```

## Procedure de migration Sequelize

Depuis le dossier `backend` :

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Les seeders fournissent notamment :

- un compte admin `finance@bcx.com`
- un compte investisseur `investisseur@bcx.com`

## Procedure de lancement Backend

Depuis le dossier `backend` :

```bash
npm run start
```

ou :

```bash
npm run dev
```

Le serveur ecoute par defaut sur le port `3003`.

## Procedure de lancement Frontend

Depuis le dossier `frontend` :

```bash
npm run dev
```

Pour un build de production :

```bash
npm run build
```

## Routes API principales

### Auth

- `POST /api/auth/inscription`
- `POST /api/auth/connexion`

### Depots

- `POST /api/depots`
- `GET /api/depots`
- `GET /api/depots/compte`
- `PUT /api/depots/wallet`
- `GET /api/depots/admin/tous`
- `PUT /api/depots/:depot_id/valider`
- `PUT /api/depots/:depot_id/refuser`

### Ayants droit

- `POST /api/ayants-droit`
- `GET /api/ayants-droit`
- `GET /api/ayants-droit/admin/tous`
- `PUT /api/ayants-droit/:id/valider`
- `PUT /api/ayants-droit/:id/refuser`

### Admin

- `GET /api/admin/stats`

### PME

- `POST /api/pme/inscription`
- `POST /api/pme/connexion`
- `GET /api/pme/dashboard`
- `POST /api/pme/transactions`
- `GET /api/pme/score`
- `GET /api/pme/rapport-pdf`

## Comptes ou roles disponibles

### Roles applicatifs

- `investisseur`
- `admin`
- `pme`

### Comptes de demo seeder

- Admin : `finance@bcx.com` / `Admin1234@`
- Investisseur : `investisseur@bcx.com` / `Test1234@`

### PME

- Les comptes PME sont crees via `POST /api/pme/inscription`

## Repartition des responsabilites de l'equipe

### Groupe 1 - Univers PME

- inscription / connexion PME
- dashboard PME
- transactions PME
- Score BCX
- rapport mensuel
- profil PME
- navigation et UI PME

### Groupe 2 - Univers Investisseur

- inscription / connexion investisseur
- depots
- ayants droit
- wallet et MetaMask
- administration des depots
- statistiques admin
- middleware de securite et validation

## Etat actuel du projet

Le projet fusionne maintenant deux univers complets dans une application unique :

- l'univers Investisseur est conserve
- l'univers PME est conserve
- les routes backend sont montees sans conflit
- le frontend compile correctement
- la documentation suit l'etat reel du code apres fusion

Le backend reste dependant d'une base MySQL accessible et d'un environnement correctement configure pour demarrer en execution complete.

## Licence

Licence du projet a definir selon le cadre de diffusion du depot.
