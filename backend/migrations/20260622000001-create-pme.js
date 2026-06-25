'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pme', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      nom: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      secteur: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      telephone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      mot_de_passe_hash: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('pme');
  }
};
