'use strict';
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const {
  nouveauDepot,
  mesDepots,
  monCompte,
  valider,
  refuser,
  tousLesDepots,
  mettreAJourWallet
} = require('../controllers/depotController');

// ── ROUTES INVESTISSEUR ────────────────────────────────────────
router.post('/', auth('investisseur'), nouveauDepot);
router.get('/', auth('investisseur'), mesDepots);
router.get('/compte', auth('investisseur'), monCompte);
router.put('/wallet', auth('investisseur'), mettreAJourWallet);

// ── ROUTES ADMIN ───────────────────────────────────────────────
router.get('/admin/tous', auth('admin'), tousLesDepots);
router.put('/:depot_id/valider', auth('admin'), valider);
router.put('/:depot_id/refuser', auth('admin'), refuser);

module.exports = router;