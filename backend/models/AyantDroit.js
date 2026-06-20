'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AyantDroit extends Model {
    static associate(models) {
      AyantDroit.belongsTo(models.Investisseur, { foreignKey: 'investisseur_id' });
    }
  }

  AyantDroit.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    investisseur_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
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
      type: DataTypes.STRING(150)
    },
    lien_parente: {
      type: DataTypes.STRING(50)
    },
    statut: {
      type: DataTypes.ENUM('en_attente', 'valide', 'refuse'),
      defaultValue: 'en_attente'
    },
    valide_par: {
      type: DataTypes.CHAR(36)
    },
    date_validation: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'AyantDroit',
    tableName: 'ayants_droit',
    underscored: true,
  });

  return AyantDroit;
};