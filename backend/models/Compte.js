'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Compte extends Model {
    static associate(models) {
      Compte.belongsTo(models.Investisseur, { foreignKey: 'investisseur_id' });
    }
  }

  Compte.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    investisseur_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    numero_compte: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    total_investi_usd: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    total_bcx_tokens: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Compte',
    tableName: 'comptes',
    underscored: true,
    timestamps: false,
  });

  return Compte;
};