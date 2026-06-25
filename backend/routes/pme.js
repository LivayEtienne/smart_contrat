'use strict';

/**
 * routes/pme.js — Module PME BCX Finance
 * Groupe 1 — Parfait Eric Yao — Lead Full Stack
 *
 * Routes publiques  : POST /api/pme/inscription, POST /api/pme/connexion
 * Routes protégées  : GET  /api/pme/dashboard
 *                     POST /api/pme/transactions
 *                     GET  /api/pme/score
 *                     GET  /api/pme/rapport-pdf?annee=2026&mois=6
 */

const express = require('express');
const router = express.Router();
const authPME = require('../middlewares/authPME');
const {
  inscription,
  connexion,
  dashboard,
  nouvelleTransaction,
  scoreBCX,
  rapportPDF
} = require('../controllers/pmeController');

// ── Publiques (sans authentification) ─────────────────────────
router.post('/inscription', inscription);
router.post('/connexion', connexion);

// ── Protégées (JWT PME requis) ────────────────────────────────
router.get('/dashboard', authPME, dashboard);
router.post('/transactions', authPME, nouvelleTransaction);
router.get('/score', authPME, scoreBCX);
router.get('/rapport-pdf', authPME, rapportPDF);

module.exports = router;
