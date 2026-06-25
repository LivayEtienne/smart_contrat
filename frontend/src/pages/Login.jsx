import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const [showMdp, setShowMdp] = useState(false);
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
<<<<<<< groupe1
    <div style={S.root}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .login-inp:focus { border-color:#D4AF37 !important; box-shadow:0 0 0 3px rgba(212,175,55,0.1) !important; }
        .login-link:hover { color:#D4AF37 !important; }
        .login-gauche { display:flex; }
        @media(max-width:860px){ .login-gauche { display:none !important; } }
      `}</style>

      {/* ── GAUCHE — Brand panel ── */}
      <div className="login-gauche" style={S.gauche}>
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1100&fit=crop&q=85"
          alt="Investisseur BCX Finance"
          style={S.gPhoto}
        />
        <div style={S.gOverlay} />
        <div style={S.gContent}>
          <div style={S.gLogo} onClick={() => navigate('/')}><img src="/logo.jpeg" alt="BCX Finance" style={{ height: 48, objectFit: 'contain' }} /></div>
          <div style={S.gBody}>
            <p style={S.gEyebrow}>CERCLE DES INVESTISSEURS</p>
            <h2 style={S.gH2}>Votre capital,<br /><span style={{ color: '#D4AF37' }}>tracé on-chain.</span></h2>
            <p style={S.gDesc}>Investissez en FCFA ou en ETH, recevez des tokens BCX ERC-20 et suivez vos rendements en temps réel sur Ethereum Sepolia.</p>
            <div style={S.gStats}>
              {[['2 voies', "d'investissement"], ['100%', 'On-chain'], ['ERC-20', 'Tokens BCX']].map(([v, l]) => (
                <div key={l} style={S.gStat}>
                  <span style={S.gStatV}>{v}</span>
                  <span style={S.gStatL}>{l}</span>
                </div>
              ))}
            </div>
=======
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
>>>>>>> develop
          </div>
          <p style={S.gFooter}>© 2026 BCX Finance · Fintech Apprentice Africa</p>
        </div>
      </div>

      {/* ── DROITE — Formulaire ── */}
      <div style={S.droite}>
        <div style={S.formWrap}>

          {/* Header mobile */}
          <div style={S.mLogo} onClick={() => navigate('/')}><img src="/logo.jpeg" alt="BCX Finance" style={{ height: 40, objectFit: 'contain' }} /></div>

          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <p style={S.eyebrow}>INVESTISSEUR</p>
            <h1 style={S.titre}>Bon retour parmi nous</h1>
            <p style={S.sous}>Connectez-vous à votre espace investisseur.</p>

            <form onSubmit={handleSubmit} style={S.form}>

              <div style={S.field}>
                <label style={S.label}>Adresse email</label>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    className="login-inp"
                    style={S.input}
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Mot de passe</label>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="login-inp"
                    style={S.input}
                    type={showMdp ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.mot_de_passe}
                    onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                    required
                  />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowMdp(v => !v)}>
                    {showMdp
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && <div style={S.errBox}>{error}</div>}

              <button style={loading ? S.btnOff : S.btn} type="submit" disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter →'}
              </button>
            </form>

            <div style={S.sep}><span style={S.sepTxt}>ou</span></div>

            <div style={S.links}>
              <span style={S.linkTxt}>Pas encore de compte ?</span>
              <span className="login-link" style={S.linkA} onClick={() => navigate('/inscription')}>Créer un compte investisseur</span>
            </div>
            <div style={{ ...S.links, marginTop: 12 }}>
              <span style={S.linkTxt}>Vous êtes une PME ?</span>
              <span className="login-link" style={S.linkA} onClick={() => navigate('/pme/connexion')}>Connexion PME</span>
            </div>
            <div style={{ ...S.links, marginTop: 12 }}>
              <span className="login-link" style={{ ...S.linkA, fontSize: 12 }} onClick={() => navigate('/')}>← Retour à l'accueil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', fontFamily: "'Inter',-apple-system,sans-serif", overflow: 'hidden' },

  gauche: { position: 'relative', width: '44%', flexShrink: 0, minHeight: '100vh' },
  gPhoto: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' },
  gOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,10,10,0.3) 0%,rgba(10,10,10,0.7) 60%,rgba(10,10,10,0.97) 100%)' },
  gContent: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 48px' },
  gLogo: { fontSize: 24, fontWeight: 900, color: '#fff', cursor: 'pointer', letterSpacing: 1, marginBottom: 'auto' },
  gBody: { paddingBottom: 32 },
  gEyebrow: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 16px' },
  gH2: { color: '#fff', fontSize: 'clamp(26px,2.5vw,38px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: -0.5 },
  gDesc: { color: '#888', fontSize: 14, lineHeight: 1.75, margin: '0 0 32px' },
  gStats: { display: 'flex', gap: 32 },
  gStat: { display: 'flex', flexDirection: 'column', gap: 3 },
  gStatV: { color: '#D4AF37', fontSize: 18, fontWeight: 900 },
  gStatL: { color: '#555', fontSize: 11 },
  gFooter: { color: '#333', fontSize: 11, marginTop: 'auto' },

  droite: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' },
  formWrap: { width: '100%', maxWidth: 420 },
  mLogo: { fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 1, marginBottom: 36, cursor: 'pointer', display: 'none' },

  eyebrow: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 10px' },
  titre: { color: '#fff', fontSize: 'clamp(24px,2.5vw,32px)', fontWeight: 900, margin: '0 0 8px', letterSpacing: -0.5 },
  sous: { color: '#555', fontSize: 14, margin: '0 0 36px', lineHeight: 1.6 },

  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { color: '#888', fontSize: 12, fontWeight: 600, letterSpacing: 0.5 },
  inputWrap: { display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '0 14px', height: 50, transition: 'all 0.2s', gap: 10 },
  inputIcon: { flexShrink: 0, display: 'flex', alignItems: 'center' },
  input: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  eyeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },

  errBox: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 13, padding: '12px 16px' },

  btn: { background: 'linear-gradient(135deg,#D4AF37,#F5E17A)', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 15, fontWeight: 800, padding: '14px', fontFamily: 'inherit', letterSpacing: 0.3, marginTop: 4 },
  btnOff: { background: '#1a1a1a', border: 'none', borderRadius: 10, color: '#444', cursor: 'not-allowed', fontSize: 15, fontWeight: 700, padding: '14px', fontFamily: 'inherit', marginTop: 4 },

  sep: { position: 'relative', margin: '28px 0', textAlign: 'center' },
  sepTxt: { background: '#0A0A0A', color: '#333', fontSize: 12, padding: '0 12px', position: 'relative', zIndex: 1 },

  links: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  linkTxt: { color: '#444', fontSize: 13 },
  linkA: { color: '#888', fontSize: 13, cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' },
};
