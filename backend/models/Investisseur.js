'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Investisseur extends Model {
    static associate(models) {
      Investisseur.hasOne(models.Compte, { foreignKey: 'investisseur_id' });
      Investisseur.hasMany(models.Depot, { foreignKey: 'investisseur_id' });
      Investisseur.hasMany(models.AyantDroit, { foreignKey: 'investisseur_id' });
    }
  }

  Investisseur.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    mot_de_passe_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    wallet_address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    niveau: {
      type: DataTypes.ENUM('Pionnier', 'Elite', 'Majeur'),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('investisseur', 'admin'),
      defaultValue: 'investisseur',
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM('actif', 'archive'),
      defaultValue: 'actif',
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Investisseur',
    tableName: 'investisseurs',
    underscored: true,
    timestamps: false,
  });

  return Investisseur;
};