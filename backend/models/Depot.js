'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Depot extends Model {
    static associate(models) {
      Depot.belongsTo(models.Investisseur, { foreignKey: 'investisseur_id' });
      Depot.hasOne(models.ConversionToken, { foreignKey: 'depot_id' });
    }
  }

  Depot.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    investisseur_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    montant: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    devise_origine: {
      type: DataTypes.ENUM('FCFA', 'USD', 'CRYPTO'),
      allowNull: false
    },
    montant_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    taux_change_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    moyen_paiement: {
      type: DataTypes.STRING(50)
    },
    voie: {
      type: DataTypes.ENUM('A', 'B'),
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM('en_attente', 'valide', 'refuse'),
      defaultValue: 'en_attente'
    },
    tx_hash: {
      type: DataTypes.STRING(255)
    },
    valide_par: {
      type: DataTypes.CHAR(36)
    },
    date_depot: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    date_validation: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Depot',
    tableName: 'depots',
    underscored: true,
    timestamps: false, 
  });

  return Depot;
};