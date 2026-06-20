'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('conversions_token', {
      id: { 
        type: Sequelize.CHAR(36), 
        primaryKey: true, 
        defaultValue: Sequelize.UUIDV4 
      },
      depot_id: {
        type: Sequelize.CHAR(36), 
        allowNull: false,
        references: { 
          model: 'depots', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
      },
      taux_id: {
        type: Sequelize.CHAR(36), 
        allowNull: false,
        references: { 
          model: 'taux_conversion', 
          key: 'id' 
        }
      },
      montant_usd: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      taux_bcx_par_usd: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      tokens_attribues: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      niveau_applique: { 
        type: Sequelize.ENUM('Pionnier', 'Elite', 'Majeur'), 
        allowNull: false 
      },
      created_at: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('conversions_token');
  }
};