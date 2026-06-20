'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TauxConversion extends Model {
    static associate(models) {
      TauxConversion.hasMany(models.ConversionToken, { foreignKey: 'taux_id' });
    }
  }

  TauxConversion.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    niveau: {
      type: DataTypes.ENUM('Pionnier', 'Elite', 'Majeur'),
      allowNull: false
    },
    taux_bcx_par_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    seuil_min_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    seuil_max_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'TauxConversion',
    tableName: 'taux_conversion',
    underscored: true,
    timestamps: false,
  });

  return TauxConversion;
};