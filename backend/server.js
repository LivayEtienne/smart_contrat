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
const helmet = require('helmet');
const { sequelize } = require('./models');

const app = express();

app.use(helmet());

const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : false,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode < 400 ? 'OK' : 'ERROR';
    console.log(`${status} [${res.statusCode}] ${req.method} ${req.url} - ${duration}ms`);

    if (res.statusCode === 429) {
      console.warn(`[SECURITY] Declenchement du Rate Limiter sur ${req.url} - IP: ${req.ip}`);
    }
    if (res.statusCode === 401) {
      console.warn(`[SECURITY] Tentative d'acces non autorise sur ${req.url} - IP: ${req.ip}`);
    }
    if (res.statusCode === 403 && req.url.includes('/admin')) {
      console.warn(`[SECURITY] Acces refuse a une route admin sur ${req.url} - IP: ${req.ip}`);
    } else if (res.statusCode === 403) {
      console.warn(`[SECURITY] Acces interdit sur ${req.url} - IP: ${req.ip}`);
    }
  });
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/depots', require('./routes/depot'));
app.use('/api/ayants-droit', require('./routes/ayantDroitRoute'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/pme', require('./routes/pme'));

app.get('/', (req, res) => {
  res.json({ message: 'BCX Finance API is running' });
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use((req, res) => {
  console.log(`Route introuvable : ${req.method} ${req.url}`);
  res.status(404).json({ success: false, message: `Route ${req.url} introuvable` });
});

const errorHandler = require('./middlewares/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 3003;

sequelize.authenticate()
  .then(() => {
    console.log('Base de donnees connectee');
    app.listen(PORT, () => {
      console.log(`Serveur demarre sur le port ${PORT}`);
      console.log(`URL : http://localhost:${PORT}`);
      console.log('Routes disponibles :');
      console.log('  POST   /api/auth/inscription');
      console.log('  POST   /api/auth/connexion');
      console.log('  POST   /api/depots');
      console.log('  GET    /api/depots');
      console.log('  GET    /api/depots/compte');
      console.log('  GET    /api/depots/admin/tous');
      console.log('  PUT    /api/depots/:id/valider');
      console.log('  PUT    /api/depots/:id/refuser');
      console.log('  POST   /api/ayants-droit');
      console.log('  GET    /api/ayants-droit');
      console.log('  GET    /api/ayants-droit/admin/tous');
      console.log('  PUT    /api/ayants-droit/:id/valider');
      console.log('  PUT    /api/ayants-droit/:id/refuser');
      console.log('  POST   /api/pme/inscription');
      console.log('  POST   /api/pme/connexion');
      console.log('  GET    /api/pme/dashboard');
      console.log('  POST   /api/pme/transactions');
      console.log('  GET    /api/pme/score');
      console.log('  GET    /api/pme/rapport-pdf');
    });
  })
  .catch(err => {
    console.error('Erreur de connexion a la base de donnees :', err.message);
    process.exit(1);
  });
