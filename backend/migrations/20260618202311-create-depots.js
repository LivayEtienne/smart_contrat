'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('depots', {
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
      montant: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      devise_origine: { 
        type: Sequelize.ENUM('FCFA', 'USD', 'CRYPTO'), 
        allowNull: false 
      },
      montant_usd: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      taux_change_usd: { 
        type: Sequelize.FLOAT, 
        allowNull: false 
      },
      moyen_paiement: { 
        type: Sequelize.STRING(50) 
      },
      voie: { 
        type: Sequelize.ENUM('A', 'B'), 
        allowNull: false 
      },
      statut: { 
        type: Sequelize.ENUM('en_attente', 'valide', 'refuse'), 
        defaultValue: 'en_attente' 
      },
      tx_hash: { 
        type: Sequelize.STRING(255) 
      },
      valide_par: { 
        type: Sequelize.CHAR(36) 
      },
      date_depot: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
      date_validation: { 
        type: Sequelize.DATE 
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('depots');
  }
};