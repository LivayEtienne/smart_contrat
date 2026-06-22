# BCX Finance

Plateforme d'investissement fintech permettant aux investisseurs d'entrer dans le Cercle BCX en déposant des fonds en FCFA, USD ou cryptomonnaie, en échange de BCX Tokens attribués selon leur niveau d'engagement.

Projet réalisé dans le cadre de Fintech Apprentice Africa, Promotion 1, Juin 2026.

Auteur : Abdou Etienne Ba, Product Manager et Développeur Full Stack


## Informations du Token BCX

Nom : BCX Token
Symbole : BCX
Standard : BEP-20 / ERC-20 compatible EVM
Réseau actuel : Ethereum Sepolia Testnet
Réseau cible : Binance Smart Chain (migration prévue)
Adresse déployée : 0x309A26Fc44cF5DA36E5A5d3f43ACbC8ffDB73489
Explorateur : https://sepolia.etherscan.io
Version Solidity : 0.8.20
Décimales : 18
Supply totale : 100 000 000 BCX
Mint supplémentaire : Désactivé
Burn : Activé
Lock-up Pioneer : 365 jours
Contrôle d'accès : Ownable
Protection réentrance : ReentrancyGuard

Note réseau : Le déploiement initial a été réalisé sur Ethereum Sepolia Testnet car les faucets BSC Testnet exigeaient un solde minimum en BNB mainnet. Sepolia étant EVM-compatible, le comportement du smart contract est strictement identique. Une migration vers BSC via QuickNode ou Chainlink est prévue pour la production.


## Structure du projet
smart_contrat/

├── contracts/

│   └── BCXToken.sol

├── scripts/

│   └── deploy.js

├── test/

│   └── BCXToken.test.js

├── backend/

│   ├── models/

│   ├── services/

│   ├── controllers/

│   ├── routes/

│   ├── middlewares/

│   └── server.js

├── frontend/

│   └── src/

│       ├── pages/

│       ├── services/

│       └── components/

├── hardhat.config.js

└── .env


## Stack technique

Smart Contract : Solidity 0.8.20, Hardhat, Ethers.js v6, Chai
Backend : Node.js, Express, Sequelize, MySQL
Frontend : React, Vite, ethers.js, Recharts
Blockchain : Ethereum Sepolia Testnet (BSC en cible)
Infra prévue : QuickNode, Chainlink


## Fonctionnalités du Smart Contract

Standard BEP-20 / ERC-20 complet avec totalSupply, balanceOf, transfer, approve, allowance, transferFrom.

Supply fixe de 100 000 000 BCX créée intégralement au déploiement, sans possibilité de mint supplémentaire.

Mécanisme de burn permettant la destruction définitive via burn() et burnFrom().

Système de lock-up pour les investisseurs Pionnier avec une durée minimale de 365 jours. Les tokens verrouillés ne peuvent ni être transférés ni être brûlés avant expiration. Fonctions associées : lockTokens, unlockTokens, getLockInfo, availableBalance.

Blacklist permettant au propriétaire de bloquer des adresses spécifiques via setBlacklist et isBlacklisted.


## Sécurité

ReentrancyGuard sur toutes les fonctions sensibles.
Ownable pour les fonctions lock, blacklist et transfert de propriété.
Rejet des transferts et approbations vers l'adresse zéro.
Tokens en lock-up non utilisables avant expiration.
Vérification des montants positifs, soldes disponibles et allowances suffisantes.
Rejet des appels vers des fonctions inexistantes et des envois accidentels de BNB.


## Installation

```bash
git clone <url-du-repo>
cd smart_contrat
```


## Configuration

Créer un fichier .env à la racine du dossier backend avec les variables suivantes. Ne jamais committer ce fichier sur GitHub.

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=<fournie par le Product Manager>
DB_HOST=localhost
DB_USER=<ton utilisateur MySQL>
DB_PASSWORD=<ton mot de passe MySQL>
DB_NAME=bcx_finance
DB_DIALECT=mysql
JWT_SECRET=<fournie par le Product Manager>
PORT=3003
```

La PRIVATE_KEY et le JWT_SECRET sont fournis directement par le Product Manager à chaque membre. Ils ne doivent jamais apparaître dans le code source ni dans un commit GitHub. Vérifier que .env est bien dans le .gitignore avant tout push.


## Démarrage du backend

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
node server.js
```

Le serveur démarre sur http://localhost:3003


## Démarrage du frontend

```bash
cd frontend
npm install
npm run dev
```

L'interface est accessible sur http://localhost:5173


## Vérifier la connexion au Smart Contract

```bash
node -e "
  const { ethers } = require('ethers');
  require('dotenv').config();
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  provider.getBlockNumber().then(n => console.log('Bloc Sepolia :', n));
"
```

Si un numéro de bloc s'affiche, la connexion à Sepolia est opérationnelle.


## Compilation et tests du Smart Contract

```bash
npx hardhat compile
npx hardhat test
```

Les tests couvrent le déploiement, les transferts, les soldes insuffisants, le lock-up Pioneer, le burn, la blacklist et le contrôle d'accès administrateur.


## Déploiement du Smart Contract

Sur Sepolia Testnet :

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Sur BSC Testnet (migration prévue) :

```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```


## Endpoints API disponibles

Le backend expose les routes suivantes sur http://localhost:3003.

Auth :
POST /api/auth/inscription
POST /api/auth/connexion

Dépôts (investisseur) :
POST /api/depots
GET /api/depots
GET /api/depots/compte
PUT /api/depots/wallet

Dépôts (admin) :
GET /api/depots/admin/tous
GET /api/depots/admin/transactions
PUT /api/depots/:id/valider
PUT /api/depots/:id/refuser

Ayants droit (investisseur) :
POST /api/ayants-droit
GET /api/ayants-droit

Ayants droit (admin) :
GET /api/ayants-droit/admin/tous
PUT /api/ayants-droit/:id/valider
PUT /api/ayants-droit/:id/refuser


## Comptes de test

Admin : finance@bcx.com / Admin1234@
Investisseur : investisseur@bcx.com / Test1234@ 
 


## Intégration Backend (Node.js + ethers.js)

```javascript
const { ethers } = require('ethers');

const BCX_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function lockTokens(address account, uint256 amount, uint256 duration)",
  "function availableBalance(address account) view returns (uint256)",
];

const CONTRACT_ADDRESS = "0x309A26Fc44cF5DA36E5A5d3f43ACbC8ffDB73489";

const getContrat = () => {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, BCX_ABI, wallet);
};

const transfererTokens = async (wallet_address, tokens) => {
  const contrat = getContrat();
  const montant = ethers.parseUnits(tokens.toFixed(6), 18);
  const tx = await contrat.transfer(wallet_address, montant);
  await tx.wait();
  return tx.hash;
};

const lireSolde = async (wallet_address) => {
  const contrat = getContrat();
  const solde = await contrat.balanceOf(wallet_address);
  return ethers.formatUnits(solde, 18);
};
```


## Intégration Frontend (React + ethers.js + MetaMask)

```javascript
import { ethers } from 'ethers';

const connecterMetaMask = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
};

const lireSoldeFrontend = async (walletAddress) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contrat = new ethers.Contract(CONTRACT_ADDRESS, BCX_ABI, provider);
  const solde = await contrat.balanceOf(walletAddress);
  return ethers.formatUnits(solde, 18);
};
```


## Workflow Git pour l'équipe

Le repo est organisé en branches de travail. Chaque groupe travaille sur sa branche dédiée.

```bash
git clone <url-du-repo>

git checkout feature/pme
git checkout feature/backoffice

git add .
git commit -m "feat: description de ce que tu as fait"
git push origin feature/ta-branche
```

Règles à respecter :
Aucun push direct sur la branche main.
Chaque push est validé par le chef de groupe avant d'être soumis.
Le Product Manager effectue une revue finale sur chaque merge.
Les fichiers suivants sont en lecture seule pour l'équipe et ne doivent pas être modifiés : authService.js, depotService.js, ayantDroitService.js, tokenService.js, authMiddleware.js.


## Feuille de route technique

Smart Contract BEP-20 : complété, déployé sur Sepolia
Intégration backend Node.js : complétée, tokenService.js opérationnel
Connexion MetaMask frontend : complétée, ethers.js + BrowserProvider
Tests unitaires Hardhat : complétés, couverture complète
Migration vers QuickNode : en cours d'étude, remplacer le RPC public
Intégration Chainlink : en cours d'étude, oracle taux FCFA/USD
Déploiement BSC Mainnet : prévu après validation complète


## Licence

MIT