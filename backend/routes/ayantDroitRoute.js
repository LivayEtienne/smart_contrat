'use strict';
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { validateAjoutAyantDroit } = require('../middlewares/validationMiddleware');
const {
  ajouter,
  mesList,
  tousAdmin,
  valider,
  refuser
} = require('../controllers/ayantDroitController');

// ── ROUTES INVESTISSEUR ────────────────────────────────────────
router.post('/', auth('investisseur'), validateAjoutAyantDroit, ajouter);
router.get('/', auth('investisseur'), mesList);

// ── ROUTES ADMIN ───────────────────────────────────────────────
router.get('/admin/tous', auth('admin'), tousAdmin);
router.put('/:id/valider', auth('admin'), valider);
router.put('/:id/refuser', auth('admin'), refuser);

module.exports = router;