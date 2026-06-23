'use strict';
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
const rootEnvPath = path.resolve(__dirname, '..', '.env');

let envLoaded = null;
const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  const rootResult = dotenv.config({ path: rootEnvPath });
  if (!rootResult.error) {
    envLoaded = rootEnvPath;
  }
} else {
  envLoaded = envPath;
}

console.log('Loaded env file:', envLoaded || 'none');
console.log('JWT_SECRET present:', Boolean(process.env.JWT_SECRET));

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// ── LOGGER MIDDLEWARE ──────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n📨 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  }
  res.on('finish', () => {
    const duration = Date.now() - start;
    const emoji = res.statusCode < 400 ? '✅' : '❌';
    console.log(`${emoji} [${res.statusCode}] ${req.method} ${req.url} — ${duration}ms`);
  });
  next();
});

// ── ROUTES ─────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/depots', require('./routes/depot'));
app.use('/api/ayants-droit', require('./routes/ayantDroitRoute'));

// ── TEST ROUTE ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'BCX Finance API is running' });
});

// ── 404 HANDLER ───────────────────────────────────────────────
app.use((req, res) => {
  console.log(`⚠️  Route introuvable : ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.url} introuvable` });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Erreur serveur :', err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
});

// ── DÉMARRAGE ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3003;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Base de données connectée');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📡 URL : http://localhost:${PORT}`);
      console.log('─────────────────────────────────────');
      console.log('Routes disponibles :');
      console.log('  POST   /api/auth/inscription');
      console.log('  POST   /api/auth/connexion');
      console.log('  ─────────────────────────────');
      console.log('  POST   /api/depots');
      console.log('  GET    /api/depots');
      console.log('  GET    /api/depots/compte');
      console.log('  ─────────────────────────────');
      console.log('  GET    /api/depots/admin/tous');
      console.log('  PUT    /api/depots/:id/valider');
      console.log('  PUT    /api/depots/:id/refuser');
      console.log('  ─────────────────────────────');
      console.log('  POST   /api/ayants-droit');
      console.log('  GET    /api/ayants-droit');
      console.log('  GET    /api/ayants-droit/admin/tous');
      console.log('  PUT    /api/ayants-droit/:id/valider');
      console.log('  PUT    /api/ayants-droit/:id/refuser');
      console.log('─────────────────────────────────────');
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données :', err.message);
    process.exit(1);
  });

app.get('/favicon.ico', (req, res) => res.sendStatus(204));