'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('taux_conversion', {
      id: { 
        type: Sequelize.CHAR(36), 
        primaryKey: true, 
        defaultValue: Sequelize.UUIDV4 
      },
      niveau: { 
        type: Sequelize.ENUM('Pionnier', 'Elite', 'Majeur'), 
        allowNull: false 
      },
      taux_bcx_par_usd: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      seuil_min_usd: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      seuil_max_usd: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      actif: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: true 
      },
      created_at: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('taux_conversion');
  }
};