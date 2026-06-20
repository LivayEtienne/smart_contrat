'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comptes', {
      id: { 
        type: Sequelize.CHAR(36), 
        primaryKey: true, 
        defaultValue: Sequelize.UUIDV4 
      },
      investisseur_id: {
        type: Sequelize.CHAR(36), 
        allowNull: false,
        references: { 
          model: 'investisseurs', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
      },
      numero_compte: { 
        type: Sequelize.STRING(50), 
        allowNull: false, 
        unique: true 
      },
      total_investi_usd: { 
        type: Sequelize.FLOAT, 
        defaultValue: 0 
      },
      total_bcx_tokens: { 
        type: Sequelize.FLOAT, 
        defaultValue: 0 
      },
      created_at: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('comptes');
  }
};