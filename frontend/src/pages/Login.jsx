import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.investisseur));
      const role = res.data.investisseur.role;
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <Link to="/">
            <img 
              src="/logo-optimized.png" 
              alt="BCX Finance" 
              style={{ height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.2))', transition: 'transform 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>
        </div>
        <p style={styles.tagline}>Cercle des Investisseurs</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.mot_de_passe}
              onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={loading ? styles.btnDisabled : styles.btn} type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0A0A0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: '#111111',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 0 60px rgba(212,175,55,0.08)',
  },
  logoBox: {
    textAlign: 'center',
    marginBottom: '4px',
  },
  logoText: {
    fontSize: '42px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A, #D4AF37)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '4px',
  },
  logoSub: {
    display: 'block',
    fontSize: '13px',
    letterSpacing: '6px',
    color: '#888',
    marginTop: '-4px',
  },
  tagline: {
    textAlign: 'center',
    color: '#555',
    fontSize: '13px',
    marginBottom: '36px',
    letterSpacing: '1px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#aaa', fontSize: '13px', letterSpacing: '0.5px' },
  input: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#ff4444',
    fontSize: '13px',
    textAlign: 'center',
    background: 'rgba(255,68,68,0.08)',
    padding: '10px',
    borderRadius: '8px',
  },
  btn: {
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A)',
    color: '#0A0A0A',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '1px',
    marginTop: '8px',
  },
  btnDisabled: {
    background: '#2a2a2a',
    color: '#555',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'not-allowed',
    letterSpacing: '1px',
    marginTop: '8px',
  },
};