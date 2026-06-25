import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConnexionPME() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const [showMdp, setShowMdp] = useState(false);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.mot_de_passe) {
      setErreur('Veuillez remplir tous les champs.'); return;
    }
    setChargement(true);
    setErreur('');
    try {
      const res = await fetch('http://localhost:3003/api/pme/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, mot_de_passe: form.mot_de_passe }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      localStorage.setItem('pme_token', data.token);
      localStorage.setItem('pme', JSON.stringify(data.pme));
      navigate('/pme/dashboard');
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={S.root}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        .pme-inp:focus { border-color:#F5B32F !important; box-shadow:0 0 0 3px rgba(245,179,47,0.1) !important; }
        .pme-lnk:hover { color:#F5B32F !important; }
        .pme-gauche { display:flex; }
        @media(max-width:860px){ .pme-gauche{display:none!important;} }
      `}</style>

      {/* ── GAUCHE — Brand panel PME ── */}
      <div className="pme-gauche" style={S.gauche}>
        <img
          src="https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=1100&fit=crop&crop=top&q=85"
          alt="Entrepreneur PME africaine BCX Finance"
          style={S.gPhoto}
        />
        <div style={S.gOverlay} />
        <div style={S.gContent}>
          <div style={S.gLogo} onClick={() => navigate('/')}><img src="/logo.jpeg" alt="BCX Finance" style={{ height: 48, objectFit: 'contain' }} /></div>

          <div style={S.gBody}>
            <p style={S.gEyebrow}>ESPACE PME</p>
            <h2 style={S.gH2}>Pilotez votre activité,<br /><span style={{ color: '#F5B32F' }}>prouvez votre valeur.</span></h2>
            <p style={S.gDesc}>Enregistrez vos recettes et dépenses, obtenez votre Score BCX et générez des rapports bancaires prêts à l'emploi.</p>

            <div style={S.gFeats}>
              {[
                { icon: '◎', t: 'Score BCX sur 100', d: 'Crédibilité calculée sur 4 critères' },
                { icon: '📄', t: 'Rapports PDF', d: 'Prêts à présenter à votre banque' },
                { icon: '📡', t: 'Mode hors connexion', d: 'Saisie sans réseau, sync automatique' },
              ].map(f => (
                <div key={f.t} style={S.gFeat}>
                  <span style={S.gFeatIcon}>{f.icon}</span>
                  <div>
                    <p style={S.gFeatT}>{f.t}</p>
                    <p style={S.gFeatD}>{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={S.gFooter}>© 2026 BCX Finance · Fintech Apprentice Africa</p>
        </div>
      </div>

      {/* ── DROITE — Formulaire ── */}
      <div style={S.droite}>
        <div style={S.formBox}>
          <div style={{ animation: 'fadeUp 0.4s ease' }}>

            <div style={S.pmeBadge}>
              <span style={S.pmeBadgeDot} />
              Espace PME
            </div>

            <h1 style={S.titre}>Bon retour,<br /><span style={S.titreOr}>entrepreneur.</span></h1>
            <p style={S.sous}>Connectez-vous pour accéder à votre dashboard PME.</p>

            <form onSubmit={submit} style={S.form}>

              <div style={S.field}>
                <label style={S.label}>Adresse email <span style={{ color: '#F5B32F' }}>*</span></label>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    className="pme-inp"
                    style={S.input}
                    type="email"
                    placeholder="votre@entreprise.com"
                    value={form.email}
                    onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErreur(''); }}
                    required
                  />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Mot de passe <span style={{ color: '#F5B32F' }}>*</span></label>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="pme-inp"
                    style={S.input}
                    type={showMdp ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.mot_de_passe}
                    onChange={e => { setForm(p => ({ ...p, mot_de_passe: e.target.value })); setErreur(''); }}
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

              {erreur && <div style={S.errBox}>{erreur}</div>}

              <button style={chargement ? S.btnOff : S.btn} type="submit" disabled={chargement}>
                {chargement ? 'Connexion en cours...' : 'Accéder à mon espace PME →'}
              </button>
            </form>

            <div style={S.sep} />

            <div style={S.links}>
              <span style={S.linkTxt}>Pas encore de compte PME ?</span>
              <span className="pme-lnk" style={S.linkA} onClick={() => navigate('/pme/inscription')}>S'inscrire gratuitement</span>
            </div>
            <div style={{ ...S.links, marginTop: 10 }}>
              <span style={S.linkTxt}>Vous êtes un investisseur ?</span>
              <span className="pme-lnk" style={S.linkA} onClick={() => navigate('/login')}>Connexion investisseur</span>
            </div>
            <div style={{ ...S.links, marginTop: 10 }}>
              <span className="pme-lnk" style={{ ...S.linkA, fontSize: 12 }} onClick={() => navigate('/')}>← Retour à l'accueil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const OR = '#F5B32F';

const S = {
  root: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', fontFamily: "'Inter',-apple-system,sans-serif", overflow: 'hidden' },

  gauche: { position: 'relative', width: '44%', flexShrink: 0, minHeight: '100vh' },
  gPhoto: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' },
  gOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,10,10,0.2) 0%,rgba(10,10,10,0.6) 55%,rgba(10,10,10,0.97) 100%)' },
  gContent: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 48px' },
  gLogo: { fontSize: 24, fontWeight: 900, color: '#fff', cursor: 'pointer', letterSpacing: 1, marginBottom: 'auto' },
  gBody: { paddingBottom: 32 },
  gEyebrow: { color: OR, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 16px' },
  gH2: { color: '#fff', fontSize: 'clamp(24px,2.5vw,36px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: -0.5 },
  gDesc: { color: '#888', fontSize: 13, lineHeight: 1.75, margin: '0 0 28px' },
  gFeats: { display: 'flex', flexDirection: 'column', gap: 12 },
  gFeat: { display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px' },
  gFeatIcon: { fontSize: 20, flexShrink: 0 },
  gFeatT: { color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 2px' },
  gFeatD: { color: '#666', fontSize: 12, margin: 0 },
  gFooter: { color: '#333', fontSize: 11, marginTop: 'auto' },

  droite: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' },
  formBox: { width: '100%', maxWidth: 420 },

  pmeBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(245,179,47,0.07)`, border: `1px solid rgba(245,179,47,0.2)`, borderRadius: 100, color: OR, fontSize: 12, fontWeight: 600, padding: '6px 14px', marginBottom: 24 },
  pmeBadgeDot: { width: 6, height: 6, borderRadius: '50%', background: OR, display: 'block', boxShadow: `0 0 6px ${OR}` },

  titre: { color: '#fff', fontSize: 'clamp(24px,2.5vw,34px)', fontWeight: 900, margin: '0 0 8px', letterSpacing: -0.5, lineHeight: 1.2 },
  titreOr: { color: OR },
  sous: { color: '#555', fontSize: 14, margin: '0 0 36px', lineHeight: 1.6 },

  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { color: '#888', fontSize: 12, fontWeight: 600, letterSpacing: 0.5 },
  inputWrap: { display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '0 14px', height: 50, transition: 'all 0.2s', gap: 10 },
  inputIcon: { flexShrink: 0, display: 'flex', alignItems: 'center' },
  input: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  eyeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },

  errBox: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 13, padding: '12px 16px' },

  btn: { background: `linear-gradient(135deg,${OR},#FACC15)`, border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 15, fontWeight: 800, padding: '15px', fontFamily: 'inherit', marginTop: 4 },
  btnOff: { background: '#1a1a1a', border: 'none', borderRadius: 10, color: '#444', cursor: 'not-allowed', fontSize: 15, fontWeight: 700, padding: '15px', fontFamily: 'inherit', marginTop: 4 },

  sep: { height: 1, background: '#111', margin: '28px 0' },

  links: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  linkTxt: { color: '#444', fontSize: 13 },
  linkA: { color: '#888', fontSize: 13, cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' },
};
