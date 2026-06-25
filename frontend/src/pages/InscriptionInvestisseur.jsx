import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InscriptionInvestisseur() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    wallet_address: '', mot_de_passe: '', mdp2: '',
  });
  const [showMdp, setShowMdp] = useState(false);
  const [showMdp2, setShowMdp2] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErreur(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.email || !form.mot_de_passe) {
      setErreur('Merci de remplir tous les champs obligatoires.'); return;
    }
    if (form.mot_de_passe !== form.mdp2) {
      setErreur('Les mots de passe ne correspondent pas.'); return;
    }
    if (form.mot_de_passe.length < 6) {
      setErreur('Le mot de passe doit faire au moins 6 caractères.'); return;
    }
    setChargement(true);
    try {
      const res = await fetch('http://localhost:3003/api/auth/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          mot_de_passe: form.mot_de_passe,
          telephone: form.telephone || undefined,
          wallet_address: form.wallet_address || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      setSucces(true);
      setTimeout(() => navigate('/login'), 2000);
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
        @keyframes spin { to{transform:rotate(360deg);} }
        .inp-inv:focus { border-color:#D4AF37 !important; box-shadow:0 0 0 3px rgba(212,175,55,0.1) !important; }
        .lnk-inv:hover { color:#D4AF37 !important; }
        .inv-gauche { display:flex; }
        @media(max-width:900px){ .inv-gauche{display:none!important;} }
        @media(max-width:480px){ .inv-droite{padding:24px 16px!important;} }
      `}</style>

      {/* ── GAUCHE — Brand panel ── */}
      <div className="inv-gauche" style={S.gauche}>
        <img
          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=1200&fit=crop&crop=center&q=85"
          alt="Investisseur africain BCX Finance"
          style={S.gPhoto}
        />
        <div style={S.gOverlay} />
        <div style={S.gContent}>
          <div style={S.gLogo} onClick={() => navigate('/')}><img src="/logo.jpeg" alt="BCX Finance" style={{ height: 48, objectFit: 'contain' }} /></div>

          <div style={S.gBody}>
            <p style={S.gEyebrow}>CERCLE DES INVESTISSEURS</p>
            <h2 style={S.gH2}>Investissez dans<br /><span style={{ color: '#D4AF37' }}>l'Afrique de demain.</span></h2>
            <p style={S.gDesc}>Accédez à la croissance des PME africaines via mobile money (FCFA) ou crypto (ETH). Chaque dépôt génère des tokens BCX traçables sur Ethereum Sepolia.</p>

            <div style={S.gCards}>
              {[
                { icon: '💰', t: 'Voie A — FCFA', d: 'Dépôt via Orange Money, Wave, MTN' },
                { icon: '🔗', t: 'Voie B — Crypto', d: 'Dépôt en ETH avec MetaMask' },
                { icon: '🪙', t: 'Tokens BCX', d: 'ERC-20 vérifiables on-chain' },
              ].map(c => (
                <div key={c.t} style={S.gCard}>
                  <span style={S.gCardIcon}>{c.icon}</span>
                  <div>
                    <p style={S.gCardT}>{c.t}</p>
                    <p style={S.gCardD}>{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={S.gFooter}>© 2026 BCX Finance · Fintech Apprentice Africa</p>
        </div>
      </div>

      {/* ── DROITE — Formulaire ── */}
      <div className="inv-droite" style={S.droite}>
        <div style={S.formBox}>

          {succes ? (
            <div style={S.succesBox}>
              <div style={S.succesIcon}>✓</div>
              <h2 style={S.succesH2}>Compte créé avec succès !</h2>
              <p style={S.succesP}>Vous allez être redirigé vers la page de connexion…</p>
            </div>
          ) : (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <p style={S.eyebrow}>NOUVEAU COMPTE</p>
              <h1 style={S.titre}>Rejoindre le cercle</h1>
              <p style={S.sous}>Créez votre compte investisseur en moins de 2 minutes.</p>

              <form onSubmit={submit} style={S.form}>

                {/* Prénom + Nom */}
                <div style={S.row}>
                  <Champ label="Prénom" value={form.prenom} onChange={v => set('prenom', v)} placeholder="Kwame" required />
                  <Champ label="Nom" value={form.nom} onChange={v => set('nom', v)} placeholder="Asante" required />
                </div>

                {/* Email */}
                <ChampIcon
                  label="Adresse email"
                  value={form.email}
                  onChange={v => set('email', v)}
                  type="email"
                  placeholder="votre@email.com"
                  required
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                />

                {/* Téléphone */}
                <ChampIcon
                  label="Téléphone (optionnel)"
                  value={form.telephone}
                  onChange={v => set('telephone', v)}
                  type="tel"
                  placeholder="+221 70 000 000"
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>}
                />

                {/* Wallet */}
                <ChampIcon
                  label="Adresse wallet Ethereum (optionnel)"
                  value={form.wallet_address}
                  onChange={v => set('wallet_address', v)}
                  placeholder="0x..."
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>}
                />

                {/* Mot de passe */}
                <ChampMdp
                  label="Mot de passe"
                  value={form.mot_de_passe}
                  onChange={v => set('mot_de_passe', v)}
                  show={showMdp}
                  onToggle={() => setShowMdp(v => !v)}
                  placeholder="Minimum 6 caractères"
                  required
                />

                {/* Confirmation */}
                <ChampMdp
                  label="Confirmer le mot de passe"
                  value={form.mdp2}
                  onChange={v => set('mdp2', v)}
                  show={showMdp2}
                  onToggle={() => setShowMdp2(v => !v)}
                  placeholder="Répétez votre mot de passe"
                  required
                />

                {erreur && <div style={S.errBox}>{erreur}</div>}

                <button style={chargement ? S.btnOff : S.btn} type="submit" disabled={chargement}>
                  {chargement
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <span style={{ width: 16, height: 16, border: '2px solid #333', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                        Création du compte…
                      </span>
                    : 'Créer mon compte investisseur →'
                  }
                </button>
              </form>

              <div style={S.links}>
                <span style={S.linkTxt}>Déjà un compte ?</span>
                <span className="lnk-inv" style={S.linkA} onClick={() => navigate('/login')}>Se connecter</span>
              </div>
              <div style={{ ...S.links, marginTop: 10 }}>
                <span style={S.linkTxt}>Vous êtes une PME ?</span>
                <span className="lnk-inv" style={S.linkA} onClick={() => navigate('/pme/inscription')}>Inscription PME</span>
              </div>
              <div style={{ ...S.links, marginTop: 10 }}>
                <span className="lnk-inv" style={{ ...S.linkA, fontSize: 12 }} onClick={() => navigate('/')}>← Retour à l'accueil</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Champ({ label, value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      <label style={S.label}>{label}{required && <span style={{ color: '#D4AF37' }}> *</span>}</label>
      <div style={{ ...S.inputWrap, borderColor: focused ? '#D4AF37' : '#1e1e1e', boxShadow: focused ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none' }}>
        <input
          style={S.input}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

function ChampIcon({ label, value, onChange, placeholder, type, required, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={S.label}>{label}{required && <span style={{ color: '#D4AF37' }}> *</span>}</label>
      <div style={{ ...S.inputWrap, borderColor: focused ? '#D4AF37' : '#1e1e1e', boxShadow: focused ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none' }}>
        <span style={S.inputIcon}>{icon}</span>
        <input
          style={S.input}
          type={type || 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

function ChampMdp({ label, value, onChange, show, onToggle, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={S.label}>{label}{required && <span style={{ color: '#D4AF37' }}> *</span>}</label>
      <div style={{ ...S.inputWrap, borderColor: focused ? '#D4AF37' : '#1e1e1e', boxShadow: focused ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none' }}>
        <span style={S.inputIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </span>
        <input
          style={S.input}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button type="button" style={S.eyeBtn} onClick={onToggle}>
          {show
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

const S = {
  root: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', fontFamily: "'Inter',-apple-system,sans-serif", overflow: 'hidden' },

  gauche: { position: 'relative', width: '44%', flexShrink: 0, minHeight: '100vh' },
  gPhoto: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' },
  gOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,10,10,0.25) 0%,rgba(10,10,10,0.65) 50%,rgba(10,10,10,0.97) 100%)' },
  gContent: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 48px' },
  gLogo: { fontSize: 24, fontWeight: 900, color: '#fff', cursor: 'pointer', letterSpacing: 1, marginBottom: 'auto' },
  gBody: { paddingBottom: 32 },
  gEyebrow: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 16px' },
  gH2: { color: '#fff', fontSize: 'clamp(24px,2.5vw,36px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: -0.5 },
  gDesc: { color: '#888', fontSize: 13, lineHeight: 1.75, margin: '0 0 28px' },
  gCards: { display: 'flex', flexDirection: 'column', gap: 12 },
  gCard: { display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px' },
  gCardIcon: { fontSize: 20, flexShrink: 0 },
  gCardT: { color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 2px' },
  gCardD: { color: '#666', fontSize: 12, margin: 0 },
  gFooter: { color: '#333', fontSize: 11, marginTop: 'auto' },

  droite: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' },
  formBox: { width: '100%', maxWidth: 440 },

  succesBox: { textAlign: 'center', padding: '60px 0' },
  succesIcon: { width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#22c55e', margin: '0 auto 24px' },
  succesH2: { color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 10px' },
  succesP: { color: '#555', fontSize: 14, lineHeight: 1.6 },

  eyebrow: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 10px' },
  titre: { color: '#fff', fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 900, margin: '0 0 8px', letterSpacing: -0.5 },
  sous: { color: '#555', fontSize: 14, margin: '0 0 32px', lineHeight: 1.6 },

  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  row: { display: 'flex', gap: 12 },
  label: { color: '#888', fontSize: 12, fontWeight: 600, letterSpacing: 0.5 },
  inputWrap: { display: 'flex', alignItems: 'center', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '0 14px', height: 50, transition: 'all 0.2s', gap: 10 },
  inputIcon: { flexShrink: 0, display: 'flex', alignItems: 'center' },
  input: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  eyeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },

  errBox: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 13, padding: '12px 16px' },

  btn: { background: 'linear-gradient(135deg,#D4AF37,#F5E17A)', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 15, fontWeight: 800, padding: '15px', fontFamily: 'inherit', marginTop: 4 },
  btnOff: { background: '#1a1a1a', border: 'none', borderRadius: 10, color: '#444', cursor: 'not-allowed', fontSize: 15, fontWeight: 700, padding: '15px', fontFamily: 'inherit', marginTop: 4 },

  links: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 24, flexWrap: 'wrap' },
  linkTxt: { color: '#444', fontSize: 13 },
  linkA: { color: '#888', fontSize: 13, cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' },
};
