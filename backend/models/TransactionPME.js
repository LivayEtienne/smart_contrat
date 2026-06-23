'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionPME extends Model {
    static associate(models) {
      TransactionPME.belongsTo(models.PME, { foreignKey: 'pme_id', as: 'pme' });
    }
  }

  TransactionPME.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    pme_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('revenu', 'depense'),
      allowNull: false
    },
    montant: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'TransactionPME',
    tableName: 'transactions_pme',
    underscored: true,
    timestamps: false,
  });

  return TransactionPME;
};
