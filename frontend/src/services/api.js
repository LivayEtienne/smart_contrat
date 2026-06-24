import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3003/api',
});

// Injecte le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirige vers /login si token expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/connexion', data),
  register: (data) => api.post('/auth/inscription', data),
};

export const depotService = {
  creer: (data) => api.post('/depots', data),
  mesDepots: () => api.get('/depots'),
  monCompte: () => api.get('/depots/compte'),
  tousLesDepots: (statut) => api.get(`/depots/admin/tous${statut ? `?statut=${statut}` : ''}`),
  valider: (id) => api.put(`/depots/${id}/valider`),
  refuser: (id, motif) => api.put(`/depots/${id}/refuser`, { motif }),
  mettreAJourWallet: (data) => api.put('/depots/wallet', data),
};

export const ayantsDroitService = {
  liste: () => api.get('/ayants-droit'),
  ajouter: (data) => api.post('/ayants-droit', data),
};

export default api;