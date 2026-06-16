// SPDX-License-Identifier: MIT
// Licence open-source du contrat (obligatoire en Solidity)

pragma solidity ^0.8.20;
//  On dit au compilateur : "utilise Solidity version 0.8.20 ou plus récente"
// Le signifie "compatible avec cette version et les suivantes mineures"

// ============================================================
// INTERFACE BEP-20
// Une interface = un contrat "vide" qui liste les fonctions
// que TOUT token BEP-20 doit obligatoirement avoir.
// C'est comme un contrat de travail : tu dois faire ces tâches.
// ============================================================

interface IBEP20 {
    // Retourne le nombre total de tokens qui existent
    function totalSupply() external view returns (uint256);

    // Retourne le nombre de décimales (18 pour BCX, comme l'ETH)
    function decimals() external view returns (uint8);

    // Retourne le symbole du token ex: "BCX"
    function symbol() external view returns (string memory);

    // Retourne le nom complet ex: "BCX Token"
    function name() external view returns (string memory);

    // Retourne l'adresse du propriétaire du contrat
    function getOwner() external view returns (address);

    // Retourne le solde de tokens d'une adresse
    function balanceOf(address account) external view returns (uint256);

    // Transfère des tokens vers une autre adresse
    function transfer(address recipient, uint256 amount) external returns (bool);

    // Retourne combien de tokens A a autorisé B à dépenser à sa place
    function allowance(address _owner, address spender) external view returns (uint256);

    // Autorise une autre adresse à dépenser tes tokens (ex: un exchange DeFi)
    function approve(address spender, uint256 amount) external returns (bool);

    // Transfère des tokens AU NOM de quelqu'un (nécessite une approbation préalable)
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    // Événement déclenché à chaque transfert (enregistré sur la blockchain)
    // "indexed" = permet de rechercher/filtrer cet événement facilement
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Événement déclenché à chaque approbation
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// ============================================================
// PROTECTION CONTRE LA RÉENTRANCE
// Imagine un voleur qui rappelle ta fonction avant qu'elle finisse.
// Ce garde-fou l'en empêche avec un "verrou" simple.
// ============================================================

abstract contract ReentrancyGuard {
    // On définit deux états possibles pour notre verrou
    uint256 private constant _NOT_ENTERED = 1; // Verrou ouvert
    uint256 private constant _ENTERED = 2;     // Verrou fermé

    // Variable qui stocke l'état actuel du verrou
    uint256 private _status;

    // Au déploiement, le verrou est ouvert
    constructor() {
        _status = _NOT_ENTERED;
    }

    // "modifier" = un morceau de code réutilisable qu'on colle sur des fonctions
    // nonReentrant = "ne peut pas être appelé deux fois en même temps"
    modifier nonReentrant() {
        // Vérifie que le verrou est ouvert, sinon erreur
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Ferme le verrou avant d'exécuter la fonction
        _status = _ENTERED;

        // Le "_;" signifie : "exécute maintenant le corps de la fonction"
        _;

        // Rouvre le verrou après que la fonction soit terminée
        _status = _NOT_ENTERED;
    }
}

// ============================================================
// CONTRÔLE D'ACCÈS (OWNABLE)
// Permet de définir un "propriétaire" du contrat.
// Certaines fonctions sensibles ne sont accessibles qu'à lui.
// ============================================================

abstract contract Ownable {
    // Variable privée qui stocke l'adresse du propriétaire
    address private _owner;

    // Événement émis quand le propriétaire change
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Au déploiement, celui qui déploie devient automatiquement le propriétaire
    constructor() {
        _owner = msg.sender; // msg.sender = l'adresse qui envoie la transaction
        emit OwnershipTransferred(address(0), msg.sender); // On notifie la blockchain
    }

    // Fonction publique pour lire qui est le propriétaire
    function owner() public view returns (address) {
        return _owner;
    }

    // Modifier qui bloque l'accès si l'appelant n'est pas le propriétaire
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _; // Si OK, on exécute la fonction
    }

    // Permet au propriétaire de passer les droits à quelqu'un d'autre
    function transferOwnership(address newOwner) public onlyOwner {
        // On refuse l'adresse zéro (ce serait bloquer le contrat pour toujours)
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner); // On notifie le changement
        _owner = newOwner; // On met à jour le propriétaire
    }

    // Permet au propriétaire de renoncer à ses droits (action irréversible !)
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0); // Plus personne n'est propriétaire
    }
}

// ============================================================
// CONTRAT PRINCIPAL BCX TOKEN
// Il hérite de IBEP20 (standard), Ownable (accès), ReentrancyGuard (sécurité)
// "is" = héritage en Solidity (comme "extends" en JavaScript)
// ============================================================

contract BCXToken is IBEP20, Ownable, ReentrancyGuard {

    // --- MÉTADONNÉES DU TOKEN ---
    // "constant" = valeur fixée à la compilation, jamais modifiable
    // "private" = uniquement lisible à l'intérieur de ce contrat
    string private constant _name     = "BCX Token";
    string private constant _symbol   = "BCX";
    uint8  private constant _decimals = 18; // 18 décimales comme l'Ether

    // Supply total : 100 millions × 10^18 (car 18 décimales)
    // Le underscore _ dans les nombres = séparateur visuel (comme l'espace en français)
    // 100_000_000 = 100 000 000, plus lisible que 100000000
    uint256 private constant _TOTAL_SUPPLY = 100_000_000 * (10 ** 18);

    // Variable qui stocke le supply actuel (peut diminuer si on brûle des tokens)
    uint256 private _totalSupply;

    // --- STOCKAGE DES DONNÉES ---

    // mapping = tableau associatif (comme un objet JS)
    // Ici : adresse → solde en tokens
    // Ex: _balances[0xABC...] = 1000
    mapping(address => uint256) private _balances;

    // Double mapping : adresse propriétaire → (adresse autorisée → montant autorisé)
    // Ex: _allowances[Alice][Bob] = 500 signifie que Bob peut dépenser 500 tokens d'Alice
    mapping(address => mapping(address => uint256)) private _allowances;

    // Liste noire : adresse → true si blacklistée, false sinon
    mapping(address => bool) private _blacklisted;

    // --- MÉCANISME DE LOCK-UP ---

    // Durée de verrouillage : 365 jours en secondes
    // "public" = lisible par tout le monde depuis l'extérieur
    uint256 public constant LOCK_DURATION = 365 days;

    // Structure de données pour stocker les infos d'un verrouillage
    // Comme un objet JavaScript : { lockedAmount: ..., unlockTime: ... }
    struct LockInfo {
        uint256 lockedAmount; // Combien de tokens sont verrouillés
        uint256 unlockTime;   // Timestamp UNIX quand ils se débloquent
    }

    // Mapping : adresse Pioneer → ses infos de verrouillage
    mapping(address => LockInfo) private _locks;

    // --- ÉVÉNEMENTS PERSONNALISÉS ---
    // Les événements sont enregistrés sur la blockchain et consultables depuis l'extérieur

    // Émis quand des tokens sont brûlés
    event TokensBurned(address indexed burner, uint256 amount);

    // Émis quand des tokens sont verrouillés pour un Pioneer
    event TokensLocked(address indexed pioneer, uint256 amount, uint256 unlockTime);

    // Émis quand des tokens sont déverrouillés
    event TokensUnlocked(address indexed pioneer, uint256 amount);

    // Émis quand une adresse est ajoutée/retirée de la blacklist
    event AddressBlacklisted(address indexed target, bool status);

    // ============================================================
    // CONSTRUCTEUR
    // Exécuté UNE SEULE FOIS lors du déploiement du contrat
    // ============================================================

    constructor() {
        // On initialise le supply total
        _totalSupply = _TOTAL_SUPPLY;

        // On attribue TOUS les tokens au déployeur (msg.sender)
        _balances[msg.sender] = _TOTAL_SUPPLY;

        // On notifie la blockchain de ce premier "transfert" depuis l'adresse zéro
        // Par convention BEP-20, la création de tokens = transfert depuis address(0)
        emit Transfer(address(0), msg.sender, _TOTAL_SUPPLY);
    }

    // ============================================================
    // FONCTIONS DE LECTURE (VIEW)
    // "view" = ne modifie pas la blockchain, gratuit à appeler
    // "override" = on remplace la définition vide de l'interface IBEP20
    // ============================================================

    // Retourne le propriétaire du contrat
    function getOwner() external view override returns (address) {
        return owner(); // Appelle la fonction owner() héritée de Ownable
    }

    // Retourne le nom du token
    function name() external pure override returns (string memory) {
        // "pure" = ne lit même pas la blockchain, juste retourne une constante
        return _name;
    }

    // Retourne le symbole du token
    function symbol() external pure override returns (string memory) {
        return _symbol;
    }

    // Retourne le nombre de décimales
    function decimals() external pure override returns (uint8) {
        return _decimals;
    }

    // Retourne le supply total actuel (peut avoir diminué après des burns)
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    // Retourne le solde d'une adresse
    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    // Retourne combien de tokens spender peut dépenser au nom de _owner
    function allowance(address _owner, address spender) external view override returns (uint256) {
        return _allowances[_owner][spender];
    }

    // ============================================================
    // FONCTIONS DE TRANSFERT
    // ============================================================

    // Transfère des tokens à recipient
    // nonReentrant = protégé contre les attaques de réentrance
    function transfer(address recipient, uint256 amount)
        external
        override
        nonReentrant
        returns (bool)
    {
        // Appelle la fonction interne _transfer qui fait les vraies vérifications
        _transfer(msg.sender, recipient, amount);
        return true; // Retourne true si tout s'est bien passé (standard BEP-20)
    }

    // Transfère des tokens AU NOM de sender (nécessite qu'il ait approuvé avant)
    function transferFrom(address sender, address recipient, uint256 amount)
        external
        override
        nonReentrant
        returns (bool)
    {
        // On lit combien msg.sender est autorisé à dépenser pour sender
        uint256 currentAllowance = _allowances[sender][msg.sender];

        // Si l'autorisation est insuffisante, on rejette
        require(currentAllowance >= amount, "BCX: transfer amount exceeds allowance");

        // On effectue le transfert
        _transfer(sender, recipient, amount);

        // On réduit l'autorisation du montant utilisé
        // "unchecked" = on désactive la vérification d'overflow car on a déjà vérifié
        unchecked {
            _allowances[sender][msg.sender] = currentAllowance - amount;
        }

        // On notifie le nouveau montant d'autorisation restant
        emit Approval(sender, msg.sender, _allowances[sender][msg.sender]);
        return true;
    }

    // Autorise spender à dépenser 'amount' tokens à ta place
    function approve(address spender, uint256 amount) external override returns (bool) {
        // On refuse d'approuver l'adresse zéro
        require(spender != address(0), "BCX: approve to the zero address");

        // SÉCURITÉ : Pour changer une autorisation non-nulle,
        // il faut d'abord la remettre à 0. Ça évite une attaque connue
        // où un spender malveillant dépense l'ancienne ET la nouvelle valeur.
        require(
            amount == 0 || _allowances[msg.sender][spender] == 0,
            "BCX: reset to 0 first"
        );

        // On enregistre l'autorisation
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // Augmente une autorisation existante (évite le problème de la race condition)
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        require(spender != address(0), "BCX: approve to the zero address");
        // += ajoute au montant existant au lieu de le remplacer
        _allowances[msg.sender][spender] += addedValue;
        emit Approval(msg.sender, spender, _allowances[msg.sender][spender]);
        return true;
    }

    // Diminue une autorisation existante
    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        require(spender != address(0), "BCX: approve to the zero address");
        uint256 currentAllowance = _allowances[msg.sender][spender];
        // On vérifie qu'on ne va pas en dessous de zéro
        require(currentAllowance >= subtractedValue, "BCX: decreased allowance below zero");
        unchecked {
            _allowances[msg.sender][spender] = currentAllowance - subtractedValue;
        }
        emit Approval(msg.sender, spender, _allowances[msg.sender][spender]);
        return true;
    }

    // ============================================================
    // MÉCANISME DE LOCK-UP PIONEER
    // ============================================================

    // Verrouille les tokens d'un Pioneer pendant 12 mois
    // Seulement le owner (administrateur) peut appeler cette fonction
    function lockTokens(address pioneer, uint256 amount) external onlyOwner {
        require(pioneer != address(0), "BCX: lock for zero address");
        require(amount > 0, "BCX: lock amount must be > 0");

        // Le Pioneer doit avoir assez de tokens à verrouiller
        require(_balances[pioneer] >= amount, "BCX: insufficient balance to lock");

        // On ne peut pas verrouiller deux fois la même adresse
        require(_locks[pioneer].lockedAmount == 0, "BCX: tokens already locked");

        // block.timestamp = l'heure actuelle en secondes (temps UNIX)
        // On calcule quand les tokens seront débloqués : maintenant + 365 jours
        uint256 unlockTime = block.timestamp + LOCK_DURATION;

        // On enregistre les infos du verrouillage
        _locks[pioneer] = LockInfo({
            lockedAmount: amount,
            unlockTime: unlockTime
        });

        emit TokensLocked(pioneer, amount, unlockTime);
    }

    // Déverrouille les tokens d'un Pioneer après 12 mois
    // N'importe qui peut appeler cette fonction (pas besoin d'être owner)
    function unlockTokens(address pioneer) external {
        // On récupère les infos de verrouillage (storage = référence directe, pas une copie)
        LockInfo storage lockInfo = _locks[pioneer];

        // Il faut qu'il y ait des tokens verrouillés
        require(lockInfo.lockedAmount > 0, "BCX: no locked tokens");

        // Il faut que la période de 12 mois soit terminée
        require(block.timestamp >= lockInfo.unlockTime, "BCX: lock period not yet expired");

        // On sauvegarde le montant avant de le remettre à 0
        uint256 amount = lockInfo.lockedAmount;

        // On efface le verrou
        lockInfo.lockedAmount = 0;
        lockInfo.unlockTime = 0;

        emit TokensUnlocked(pioneer, amount);
    }

    // Permet de consulter les infos de verrouillage d'un Pioneer
    function getLockInfo(address pioneer) external view returns (uint256 lockedAmount, uint256 unlockTime) {
        // On retourne directement les deux valeurs de la struct
        return (_locks[pioneer].lockedAmount, _locks[pioneer].unlockTime);
    }

    // Calcule le solde DISPONIBLE (total - verrouillé)
    // C'est ce montant qu'on peut réellement transférer ou brûler
    function availableBalance(address account) public view returns (uint256) {
        uint256 locked = 0;

        // Si des tokens sont verrouillés ET que la période n'est pas finie
        if (_locks[account].lockedAmount > 0 && block.timestamp < _locks[account].unlockTime) {
            locked = _locks[account].lockedAmount; // Ces tokens sont bloqués
        }

        uint256 balance = _balances[account];

        // On retourne balance - locked, mais jamais en dessous de 0
        return balance > locked ? balance - locked : 0;
    }

    // ============================================================
    // MÉCANISME DE BURN (DESTRUCTION DE TOKENS)
    // Brûler = envoyer à l'adresse zéro + réduire le supply total
    // ============================================================

    // Brûle tes propres tokens (les détruit définitivement)
    function burn(uint256 amount) external nonReentrant {
        require(amount > 0, "BCX: burn amount must be > 0");

        // On ne peut brûler que des tokens disponibles (pas les verrouillés)
        require(availableBalance(msg.sender) >= amount, "BCX: burn exceeds available balance");

        // On réduit le solde de l'appelant
        _balances[msg.sender] -= amount;

        // On réduit le supply total (les tokens n'existent plus)
        _totalSupply -= amount;

        // Par convention BEP-20, brûler = transférer vers l'adresse zéro
        emit Transfer(msg.sender, address(0), amount);
        emit TokensBurned(msg.sender, amount);
    }

    // Brûle les tokens de quelqu'un d'autre (nécessite son approbation préalable)
    function burnFrom(address account, uint256 amount) external nonReentrant {
        require(amount > 0, "BCX: burn amount must be > 0");

        // On vérifie que msg.sender a l'autorisation de brûler pour account
        uint256 currentAllowance = _allowances[account][msg.sender];
        require(currentAllowance >= amount, "BCX: burn amount exceeds allowance");

        // On vérifie que account a assez de tokens disponibles
        require(availableBalance(account) >= amount, "BCX: burn exceeds available balance");

        // On réduit l'autorisation utilisée
        unchecked {
            _allowances[account][msg.sender] = currentAllowance - amount;
        }

        // On brûle les tokens
        _balances[account] -= amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
        emit TokensBurned(account, amount);
        emit Approval(account, msg.sender, _allowances[account][msg.sender]);
    }

    // ============================================================
    // BLACKLIST (LISTE NOIRE ANTI-ABUS)
    // ============================================================

    // Ajoute ou retire une adresse de la liste noire
    // true = blacklistée (bloquée), false = retirée de la liste
    function setBlacklist(address target, bool status) external onlyOwner {
        require(target != address(0), "BCX: cannot blacklist zero address");

        // Le propriétaire ne peut pas se blacklister lui-même (sécurité)
        require(target != owner(), "BCX: cannot blacklist owner");

        _blacklisted[target] = status;
        emit AddressBlacklisted(target, status);
    }

    // Vérifie si une adresse est blacklistée
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklisted[account];
    }

    // ============================================================
    // FONCTION INTERNE DE TRANSFERT
    // "internal" = utilisable seulement à l'intérieur de ce contrat
    // Toutes les vérifications de sécurité sont centralisées ici
    // ============================================================

    function _transfer(address sender, address recipient, uint256 amount) internal {
        // On refuse les adresses zéro (bonne pratique de sécurité)
        require(sender != address(0), "BCX: transfer from zero address");
        require(recipient != address(0), "BCX: transfer to zero address");

        // Le montant doit être positif
        require(amount > 0, "BCX: amount must be > 0");

        // Ni l'envoyeur ni le destinataire ne doivent être blacklistés
        require(!_blacklisted[sender], "BCX: sender is blacklisted");
        require(!_blacklisted[recipient], "BCX: recipient is blacklisted");

        // L'envoyeur doit avoir assez de tokens DISPONIBLES (pas verrouillés)
        require(availableBalance(sender) >= amount, "BCX: amount exceeds available balance");

        // On effectue le vrai transfert : on débite et on crédite
        _balances[sender] -= amount;
        _balances[recipient] += amount;

        // On notifie la blockchain du transfert
        emit Transfer(sender, recipient, amount);
    }

    // ============================================================
    // PROTECTION CONTRE LES ENVOIS ACCIDENTELS DE BNB
    // ============================================================

    // receive() est appelée si quelqu'un envoie du BNB au contrat
    // On le rejette avec un message clair
    receive() external payable {
        revert("BCX: contract does not accept BNB");
    }

    // fallback() est appelée si quelqu'un appelle une fonction qui n'existe pas
    fallback() external payable {
        revert("BCX: invalid call");
    }
}