'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const adminId = uuidv4();
    const mot_de_passe_hash = await bcrypt.hash('Admin1234@', 10);

    // Créer le compte admin dans investisseurs
    await queryInterface.bulkInsert('investisseurs', [{
      id: adminId,
      nom: 'Ba',
      prenom: 'Abdou',
      email: 'finance@bcx.com',
      mot_de_passe_hash,
      telephone: '770000000',
      wallet_address: null,
      niveau: null,
      role: 'admin',
      statut: 'actif',
      created_at: new Date()
    }]);

    // Créer le compte associé
    await queryInterface.bulkInsert('comptes', [{
      id: uuidv4(),
      investisseur_id: adminId,
      numero_compte: 'BCX-ADMIN-001',
      total_investi_usd: 0,
      total_bcx_tokens: 0,
      created_at: new Date()
    }]);

    const investisseurId = uuidv4();
    const investisseurPasswordHash = await bcrypt.hash('Test1234@', 10);

    await queryInterface.bulkInsert('investisseurs', [{
      id: investisseurId,
      nom: 'Investisseur',
      prenom: 'BCX',
      email: 'investisseur@bcx.com',
      mot_de_passe_hash: investisseurPasswordHash,
      telephone: '770000001',
      wallet_address: null,
      niveau: null,
      role: 'investisseur',
      statut: 'actif',
      created_at: new Date()
    }]);

    await queryInterface.bulkInsert('comptes', [{
      id: uuidv4(),
      investisseur_id: investisseurId,
      numero_compte: 'BCX-INVEST-001',
      total_investi_usd: 0,
      total_bcx_tokens: 0,
      created_at: new Date()
    }]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('comptes', {
      numero_compte: 'BCX-ADMIN-001'
    });
    await queryInterface.bulkDelete('comptes', {
      numero_compte: 'BCX-INVEST-001'
    });
    await queryInterface.bulkDelete('investisseurs', {
      email: 'admin@bcx.com'
    });
    await queryInterface.bulkDelete('investisseurs', {
      email: 'investisseur@bcx.com'
    });
  }
};