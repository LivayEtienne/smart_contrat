'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('taux_conversion', [
      {
        id: uuidv4(),
        niveau: 'Pionnier',
        taux_bcx_par_usd: 20,
        seuil_min_usd: 500,
        seuil_max_usd: 4999,
        actif: true,
        created_at: new Date()
      },
      {
        id: uuidv4(),
        niveau: 'Elite',
        taux_bcx_par_usd: 22,
        seuil_min_usd: 5000,
        seuil_max_usd: 9999,
        actif: true,
        created_at: new Date()
      },
      {
        id: uuidv4(),
        niveau: 'Majeur',
        taux_bcx_par_usd: 25,
        seuil_min_usd: 10000,
        seuil_max_usd: 20000,
        actif: true,
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('taux_conversion', null, {});
  }
};