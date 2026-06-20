CREATE TABLE investisseurs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  wallet_address VARCHAR(100),
  niveau ENUM('Pionnier','Elite','Majeur') DEFAULT 'Pionnier',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE comptes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  investisseur_id CHAR(36) NOT NULL,
  numero_compte VARCHAR(50) NOT NULL UNIQUE,
  total_investi_usd FLOAT DEFAULT 0,
  total_bcx_tokens FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (investisseur_id) REFERENCES investisseurs(id)
);

CREATE TABLE taux_conversion (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  niveau ENUM('Pionnier','Elite','Majeur') NOT NULL,
  taux_bcx_par_usd FLOAT NOT NULL,
  seuil_min_usd FLOAT NOT NULL,
  seuil_max_usd FLOAT NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE depots (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  investisseur_id CHAR(36) NOT NULL,
  montant FLOAT NOT NULL,
  devise_origine ENUM('FCFA','USD','CRYPTO') NOT NULL,
  montant_usd FLOAT NOT NULL,
  taux_change_usd FLOAT NOT NULL,
  moyen_paiement VARCHAR(50),
  voie ENUM('A','B') NOT NULL,
  statut ENUM('en_attente','valide','refuse') DEFAULT 'en_attente',
  tx_hash VARCHAR(255),
  valide_par CHAR(36),
  date_depot TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_validation TIMESTAMP,
  FOREIGN KEY (investisseur_id) REFERENCES investisseurs(id)
);

CREATE TABLE conversions_token (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  depot_id CHAR(36) NOT NULL,
  taux_id CHAR(36) NOT NULL,
  montant_usd FLOAT NOT NULL,
  taux_bcx_par_usd FLOAT NOT NULL,
  tokens_attribues FLOAT NOT NULL,
  niveau_applique ENUM('Pionnier','Elite','Majeur') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (depot_id) REFERENCES depots(id),
  FOREIGN KEY (taux_id) REFERENCES taux_conversion(id)
);

CREATE TABLE ayants_droit (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  investisseur_id CHAR(36) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  lien_parente VARCHAR(50),
  statut ENUM('en_attente','valide','refuse') DEFAULT 'en_attente',
  valide_par CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_validation TIMESTAMP,
  FOREIGN KEY (investisseur_id) REFERENCES investisseurs(id)
);

-- Données initiales taux_conversion
INSERT INTO taux_conversion (id, niveau, taux_bcx_par_usd, seuil_min_usd, seuil_max_usd, actif)
VALUES
  (UUID(), 'Pionnier', 20, 500, 4999, TRUE),
  (UUID(), 'Elite', 22, 5000, 9999, TRUE),
  (UUID(), 'Majeur', 25, 10000, 20000, TRUE);