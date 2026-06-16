# BCX Token

Smart Contract du **BCX Token**, le token utilitaire de l'écosystème **BCX Finance**, développé en Solidity et conforme au standard **BEP-20** sur la Binance Smart Chain (BSC).

Le BCX Token constitue une clé d'accès aux différents services proposés par BCX Finance. Sa valeur est liée à son utilité au sein de l'écosystème et non à une logique purement spéculative.


# Informations du Token

- **Nom :** BCX Token
- **Symbole :** BCX
- **Standard :** BEP-20
- **Blockchain cible :** Binance Smart Chain (BSC)
- **Version Solidity :** 0.8.20
- **Décimales :** 18
- **Supply totale :** 100 000 000 BCX
- **Mint supplémentaire :** Désactivé
- **Burn :** Activé
- **Lock-up Pioneer :** 365 jours
- **Contrôle d'accès administrateur :** Oui
- **Protection contre la réentrance :** Oui

---

# Fonctionnalités

## Implémentation complète du standard BEP-20

Le contrat implémente toutes les fonctions essentielles du standard BEP-20 :

- `totalSupply()`
- `balanceOf()`
- `transfer()`
- `approve()`
- `allowance()`
- `transferFrom()`

Cette implémentation garantit la compatibilité du token avec les wallets, les exchanges et les applications de l'écosystème Binance Smart Chain.


## Supply fixe

Le BCX Token possède une offre totale fixe de :

```text
100 000 000 BCX
```

La totalité des tokens est créée lors du déploiement du contrat.

Aucune fonction de création supplémentaire (`mint`) n'est présente afin de garantir une émission contrôlée et transparente.


## Mécanisme de Burn

Le contrat permet la destruction définitive des tokens.

Fonctions disponibles :

- `burn()`
- `burnFrom()`

Chaque opération de burn :

- réduit le solde du détenteur ;
- diminue la supply totale ;
- est enregistrée sur la blockchain.


## Système de Lock-up des Pionniers

Le contrat intègre un mécanisme de verrouillage des tokens destiné aux Pionniers.

Caractéristiques :

- durée minimale de 365 jours ;
- les tokens verrouillés ne peuvent ni être transférés ni être brûlés ;
- déverrouillage uniquement après expiration de la période définie.

Fonctions associées :

- `lockTokens()`
- `unlockTokens()`
- `getLockInfo()`
- `availableBalance()`


## Gestion des autorisations

Le contrat prend en charge :

- `approve()`
- `increaseAllowance()`
- `decreaseAllowance()`
- `transferFrom()`

Des mécanismes supplémentaires sont mis en place afin de limiter les risques liés aux autorisations.


## Blacklist

Le propriétaire du contrat peut ajouter ou retirer certaines adresses de la liste noire.

Une adresse blacklistée :

- ne peut plus envoyer de tokens ;
- ne peut plus recevoir de tokens.

Fonctions disponibles :

- `setBlacklist()`
- `isBlacklisted()`


# Sécurité

Le contrat intègre plusieurs mécanismes de sécurité :

### Protection contre la réentrance

Les fonctions sensibles sont protégées grâce au module `ReentrancyGuard`.

### Contrôle d'accès

Le module `Ownable` permet de restreindre certaines opérations critiques au propriétaire du contrat.

Ces opérations concernent notamment :

- le verrouillage des tokens ;
- la gestion de la blacklist ;
- le transfert de propriété.

### Protection contre l'adresse zéro

Le contrat empêche :

- les transferts vers l'adresse zéro ;
- les approbations vers l'adresse zéro ;
- certaines opérations invalides.

### Protection des soldes verrouillés

Les tokens faisant l'objet d'un lock-up ne peuvent pas être utilisés avant leur date de déverrouillage.

### Vérification des montants

Le contrat contrôle :

- les montants positifs ;
- les soldes disponibles ;
- les autorisations suffisantes.

### Protection contre les appels invalides

Le contrat rejette :

- les appels vers des fonctions inexistantes ;
- les envois accidentels de BNB.

---

# Architecture du projet

```text
BCXToken
│
├── contracts
│   └── BCXToken.sol
│
├── test
│   └── BCXToken.test.js
│
├── scripts
│   └── deploy.js
│
├── hardhat.config.js
│
├── package.json
│
└── README.md


# Installation

Cloner le dépôt :

git clone <repository-url>

Accéder au projet :

```bash
cd BCXToken

Installer les dépendances :

```bash
npm install

---

# Compilation

```bash
npx hardhat compile

---

# Exécution des tests

```bash
npx hardhat test

---

# Déploiement sur Binance Smart Chain Testnet

```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

Après le déploiement, l'adresse du contrat pourra être vérifiée sur BscScan.

---

# Tests réalisés

Les tests couvrent notamment :

- le déploiement du contrat ;
- la vérification du nom, du symbole et des décimales ;
- la validation de la supply totale ;
- les transferts de tokens ;
- les soldes insuffisants ;
- le lock-up des Pionniers ;
- le déverrouillage après expiration ;
- la fonctionnalité de burn ;
- la réduction de la supply totale ;
- la gestion de la blacklist ;
- le contrôle d'accès administrateur.

---

# Technologies utilisées

- Solidity 0.8.20
- Hardhat
- Ethers.js
- Chai
- JavaScript
- Binance Smart Chain

---

# Auteur

**Etienne Ba**

Projet réalisé dans le cadre de l'épreuve Blockchain de **FinTech Apprentice Africa**.

---

# Licence

Licence MIT.