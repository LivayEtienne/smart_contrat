'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConversionToken extends Model {
    static associate(models) {
      ConversionToken.belongsTo(models.Depot, { foreignKey: 'depot_id' });
      ConversionToken.belongsTo(models.TauxConversion, { foreignKey: 'taux_id' });
    }
  }

  ConversionToken.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    depot_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    taux_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    montant_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    taux_bcx_par_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tokens_attribues: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    niveau_applique: {
      type: DataTypes.ENUM('Pionnier', 'Elite', 'Majeur'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ConversionToken',
    tableName: 'conversions_token',
    underscored: true,
    timestamps: false,
  });

  return ConversionToken;
};