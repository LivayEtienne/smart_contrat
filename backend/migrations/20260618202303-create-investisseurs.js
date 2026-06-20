'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('investisseurs', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      nom: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      mot_de_passe_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      telephone: {
        type: Sequelize.STRING(20)
      },
      wallet_address: {
        type: Sequelize.STRING(100)
      },
      niveau: {
        type: Sequelize.ENUM('Pionnier', 'Elite', 'Majeur'),
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('investisseur', 'admin'),
        defaultValue: 'investisseur',
        allowNull: false
      },
      statut: {
        type: Sequelize.ENUM('actif', 'archive'),
        defaultValue: 'actif',
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('investisseurs');
  }
};