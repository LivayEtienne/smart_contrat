---

## ⚙️ Fonctionnalités Implémentées

### Standard BEP-20 complet
- `transfer` — transfert sécurisé entre adresses
- `transferFrom` — transfert au nom d'un tiers
- `approve` — autorisation de dépense
- `allowance` — consultation des autorisations
- `balanceOf` — consultation du solde
- `totalSupply` — supply total

### Mécanisme de Lock-up Pioneer
- Verrouillage des tokens pendant **12 mois minimum**
- Seul le owner peut verrouiller
- Déverrouillage automatique après la période

### Burn (Destruction de tokens)
- `burn` — brûle ses propres tokens
- `burnFrom` — brûle les tokens d'un tiers (avec approbation)
- Réduit le supply total définitivement

### Sécurité
- Protection contre la **réentrance** (ReentrancyGuard)
- **Blacklist** anti-abus
- Protection **race condition** sur approve
- Rejet des envois accidentels de BNB
- Contrôle d'accès **Ownable**

---

## 🛡️ Sécurités Implémentées

| Mécanisme | Attaque Mitigée |
|---|---|
| ReentrancyGuard | Attaque de réentrance (ex: DAO hack) |
| Ownable | Accès non autorisé aux fonctions admin |
| Approve race condition fix | Double-dépense via allowance |
| Lock-up 12 mois | Dump des tokens Pioneer |
| Blacklist | Wash trading / adresses malveillantes |
| receive() revert | Perte accidentelle de BNB |
| Solidity 0.8.x | Overflow/underflow natif |

---

## 🚀 Installation et Utilisation

### Prérequis
- Node.js >= 18
- npm

### Installation
```bash
git clone https://github.com/TON_USERNAME/bcx-token.git
cd bcx-token
npm install
```

### Configuration
```bash
cp .env.example .env
# Remplir PRIVATE_KEY avec ta clé privée MetaMask
```

### Compiler
```bash
npx hardhat compile
```

### Lancer les tests
```bash
npx hardhat test
```

### Résultat des tests