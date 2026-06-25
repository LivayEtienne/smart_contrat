'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PME extends Model {
    static associate(models) {
      PME.hasMany(models.TransactionPME, { foreignKey: 'pme_id', as: 'transactions' });
    }
  }

  PME.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nom: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    secteur: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mot_de_passe_hash: {
      type: DataTypes.STRING(255),
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
    modelName: 'PME',
    tableName: 'pme',
    underscored: true,
    timestamps: false,
  });

  return PME;
};
