# BCX Token

Smart Contract du **BCX Token**, le token utilitaire de l'écosystème **BCX Finance**, développé en Solidity et conforme au standard **BEP-20 / ERC-20** sur une blockchain compatible EVM.

Le BCX Token constitue la clé d'accès aux services proposés par BCX Finance aux investisseurs. Sa valeur est liée à son utilité au sein de l'écosystème — et non à une logique purement spéculative.

---

## Informations du Token

| Paramètre             | Valeur                                         |
|-----------------------|------------------------------------------------|
| **Nom**               | BCX Token                                      |
| **Symbole**           | BCX                                            |
| **Standard**          | BEP-20 / ERC-20 (compatible EVM)              |
| **Réseau de test**    | Ethereum Sepolia Testnet                       |
| **Réseau cible**      | Binance Smart Chain (BSC) — migration prévue  |
| **Adresse déployée**  | `0x309A26Fc44cF5DA36E5A5d3f43ACbC8ffDB73489`  |
| **Explorateur**       | https://sepolia.etherscan.io                   |
| **Version Solidity**  | 0.8.20                                         |
| **Décimales**         | 18                                             |
| **Supply totale**     | 100 000 000 BCX                                |
| **Mint supplémentaire** | Désactivé                                   |
| **Burn**              | Activé                                         |
| **Lock-up Pioneer**   | 365 jours                                      |
| **Contrôle d'accès**  | Oui (Ownable)                                  |
| **Protection réentrance** | Oui (ReentrancyGuard)                    |

> **Note réseau** : Le déploiement initial a été réalisé sur Ethereum Sepolia Testnet car les faucets BSC Testnet exigeaient un solde minimum en BNB mainnet. Sepolia étant également compatible EVM, le comportement du smart contract est strictement identique. Une migration vers BSC ou l'intégration de QuickNode / Chainlink est prévue pour la suite du projet.

---

## Fonctionnalités

### Standard BEP-20 / ERC-20 complet

Le contrat implémente toutes les fonctions essentielles du standard :

- `totalSupply()`
- `balanceOf()`
- `transfer()`
- `approve()`
- `allowance()`
- `transferFrom()`

### Supply fixe

```
100 000 000 BCX
```

La totalité des tokens est créée lors du déploiement. Aucune fonction `mint` supplémentaire n'est présente.

### Mécanisme de Burn

Le contrat permet la destruction définitive des tokens :

- `burn()` — réduit le solde et la supply totale
- `burnFrom()` — burn depuis une allowance approuvée

### Système de Lock-up des Pionniers

Mécanisme de verrouillage des tokens pour les investisseurs de niveau Pionnier :

- Durée minimale de 365 jours
- Les tokens verrouillés ne peuvent ni être transférés ni être brûlés
- Déverrouillage uniquement après expiration

Fonctions associées :
- `lockTokens(address, amount, duration)`
- `unlockTokens(address)`
- `getLockInfo(address)`
- `availableBalance(address)`

### Gestion des autorisations

- `approve()`
- `increaseAllowance()`
- `decreaseAllowance()`
- `transferFrom()`

### Blacklist

Le propriétaire peut bloquer des adresses spécifiques :

- `setBlacklist(address, bool)`
- `isBlacklisted(address)`

Une adresse blacklistée ne peut plus envoyer ni recevoir de tokens.

---

## Sécurité

| Mécanisme                        | Détail                                                                 |
|----------------------------------|------------------------------------------------------------------------|
| Protection contre la réentrance  | `ReentrancyGuard` sur toutes les fonctions sensibles                  |
| Contrôle d'accès                 | `Ownable` — lock, blacklist, transfert de propriété réservés au owner |
| Protection adresse zéro          | Transferts et approbations vers 0x0 rejetés                           |
| Protection soldes verrouillés    | Tokens en lock-up non utilisables avant expiration                    |
| Vérification des montants        | Montants positifs, soldes disponibles, allowances suffisantes          |
| Protection appels invalides      | Fonctions inexistantes et envois accidentels de BNB rejetés           |

---

## Architecture du projet

```
BCXToken/
├── contracts/
│   └── BCXToken.sol          ← Smart contract principal
├── test/
│   └── BCXToken.test.js      ← Tests Hardhat + Chai
├── scripts/
│   └── deploy.js             ← Script de déploiement
├── hardhat.config.js
├── package.json
└── README.md
```

---

## Installation

```bash
git clone <repository-url>
cd BCXToken
npm install
```

---

## Configuration

Créer un fichier `.env` à la racine :

```env
# Clé privée du wallet owner (ne jamais committer)
PRIVATE_KEY=<votre_clé_privée>

# RPC URL Sepolia (réseau de test actuel)
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# RPC URL BSC Testnet (réseau cible futur)
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
```

> ⚠️ Le fichier `.env` doit impérativement être dans le `.gitignore`. Ne jamais exposer la `PRIVATE_KEY` dans le code source ou sur GitHub.

---

## Compilation

```bash
npx hardhat compile
```

---

## Tests

```bash
npx hardhat test
```

Les tests couvrent :

- Déploiement du contrat
- Vérification du nom, symbole et décimales
- Validation de la supply totale (100 000 000 BCX)
- Transferts de tokens
- Gestion des soldes insuffisants
- Lock-up des Pionniers (365 jours)
- Déverrouillage après expiration
- Fonctionnalité de burn et réduction de supply
- Gestion de la blacklist
- Contrôle d'accès administrateur

---

## Déploiement

### Sur Sepolia Testnet (réseau actuel)

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

L'adresse du contrat déployé est vérifiable sur :
https://sepolia.etherscan.io/address/0x309A26Fc44cF5DA36E5A5d3f43ACbC8ffDB73489

### Sur BSC Testnet (réseau cible — migration prévue)

```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

L'adresse du contrat sera vérifiable sur BscScan après déploiement.

---

## Intégration Backend (Node.js + ethers.js)

Le Smart Contract est intégré au backend BCX Finance via `tokenService.js`.

### Connexion au contrat

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
```

### Transfert de tokens vers un investisseur

```javascript
const transfererTokens = async (wallet_address, tokens) => {
  const contrat = getContrat();
  const montant = ethers.parseUnits(tokens.toFixed(6), 18);
  const tx = await contrat.transfer(wallet_address, montant);
  await tx.wait(); // Attendre la confirmation blockchain
  return tx.hash;  // Hash enregistré en base pour traçabilité
};
```

### Lecture du solde BCX d'un wallet

```javascript
const lireSolde = async (wallet_address) => {
  const contrat = getContrat();
  const solde = await contrat.balanceOf(wallet_address);
  return ethers.formatUnits(solde, 18);
};
```

### Intégration Frontend (React + ethers.js + MetaMask)

```javascript
import { ethers } from 'ethers';

// Connexion MetaMask
const connecterMetaMask = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
};

// Lire le solde BCX depuis le frontend
const lireSoldeFrontend = async (walletAddress) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contrat = new ethers.Contract(CONTRACT_ADDRESS, BCX_ABI, provider);
  const solde = await contrat.balanceOf(walletAddress);
  return ethers.formatUnits(solde, 18);
};
```

---

## Feuille de route technique

| Étape | Statut | Détail |
|-------|--------|--------|
| Smart Contract BEP-20 |  Complété | Déployé sur Sepolia |
| Intégration backend Node.js |  Complété | tokenService.js opérationnel |
| Connexion MetaMask frontend |  Complété | ethers.js + BrowserProvider |
| Tests unitaires Hardhat |  Complétés | Couverture complète |
| Migration vers QuickNode |  En cours d'étude | Remplacer le RPC public |
| Intégration Chainlink |  En cours d'étude | Oracle taux FCFA/USD |
| Déploiement BSC Mainnet |  Prévu | Après validation complète |

---

## Technologies utilisées

- Solidity 0.8.20
- Hardhat
- Ethers.js v6
- Chai
- JavaScript / Node.js
- Ethereum Sepolia Testnet
- Binance Smart Chain (cible)

---

## Auteur

**Abdou Etienne Ba**
Product Manager & Développeur Full Stack — BCX Finance
Projet réalisé dans le cadre de **Fintech Apprentice Africa — Promotion 1 — Juin 2026**

---

## Licence

MIT