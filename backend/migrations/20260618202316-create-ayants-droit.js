'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ayants_droit', {
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
      nom: { 
        type: Sequelize.STRING(100), 
        allowNull: false 
      },
      prenom: { 
        type: Sequelize.STRING(100), 
        allowNull: false 
      },
      email: { 
        type: Sequelize.STRING(150) 
      },
      lien_parente: { 
        type: Sequelize.STRING(50) 
      },
      statut: { 
        type: Sequelize.ENUM('en_attente', 'valide', 'refuse'), 
        defaultValue: 'en_attente' 
      },
      valide_par: { 
        type: Sequelize.CHAR(36) 
      },
      created_at: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
      date_validation: { 
        type: Sequelize.DATE 
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ayants_droit');
  }
};