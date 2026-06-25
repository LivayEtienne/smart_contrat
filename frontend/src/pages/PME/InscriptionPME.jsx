// INSCRIPTION PME — BCX Finance | Auteur : Parfait Eric Yao
import { useState, useRef, useEffect } from 'react';
import FlagImg from '../../components/PME/FlagImg';
import { useNavigate, Link } from 'react-router-dom';

// ── DONNÉES PAYS ─────────────────────────────────────────────
const PAYS = [
  { code: 'SN', nom: 'Sénégal',        ind: '+221', flag: '🇸🇳' },
  { code: 'CI', nom: "Côte d'Ivoire",  ind: '+225', flag: '🇨🇮' },
  { code: 'BF', nom: 'Burkina Faso',   ind: '+226', flag: '🇧🇫' },
  { code: 'ML', nom: 'Mali',           ind: '+223', flag: '🇲🇱' },
  { code: 'GN', nom: 'Guinée',         ind: '+224', flag: '🇬🇳' },
  { code: 'TG', nom: 'Togo',           ind: '+228', flag: '🇹🇬' },
  { code: 'BJ', nom: 'Bénin',          ind: '+229', flag: '🇧🇯' },
  { code: 'NE', nom: 'Niger',          ind: '+227', flag: '🇳🇪' },
  { code: 'CM', nom: 'Cameroun',       ind: '+237', flag: '🇨🇲' },
  { code: 'NG', nom: 'Nigéria',        ind: '+234', flag: '🇳🇬' },
  { code: 'GH', nom: 'Ghana',          ind: '+233', flag: '🇬🇭' },
  { code: 'MR', nom: 'Mauritanie',     ind: '+222', flag: '🇲🇷' },
  { code: 'SL', nom: 'Sierra Leone',   ind: '+232', flag: '🇸🇱' },
  { code: 'GM', nom: 'Gambie',         ind: '+220', flag: '🇬🇲' },
  { code: 'GW', nom: 'Guinée-Bissau',  ind: '+245', flag: '🇬🇼' },
  { code: 'CV', nom: 'Cap-Vert',       ind: '+238', flag: '🇨🇻' },
  { code: 'LR', nom: 'Libéria',        ind: '+231', flag: '🇱🇷' },
  { code: 'CD', nom: 'RD Congo',       ind: '+243', flag: '🇨🇩' },
  { code: 'CG', nom: 'Congo',          ind: '+242', flag: '🇨🇬' },
  { code: 'GA', nom: 'Gabon',          ind: '+241', flag: '🇬🇦' },
  { code: 'MA', nom: 'Maroc',          ind: '+212', flag: '🇲🇦' },
  { code: 'TN', nom: 'Tunisie',        ind: '+216', flag: '🇹🇳' },
  { code: 'DZ', nom: 'Algérie',        ind: '+213', flag: '🇩🇿' },
  { code: 'KE', nom: 'Kenya',          ind: '+254', flag: '🇰🇪' },
  { code: 'TZ', nom: 'Tanzanie',       ind: '+255', flag: '🇹🇿' },
  { code: 'ET', nom: 'Éthiopie',       ind: '+251', flag: '🇪🇹' },
  { code: 'ZA', nom: 'Afrique du Sud', ind: '+27',  flag: '🇿🇦' },
  { code: 'FR', nom: 'France',         ind: '+33',  flag: '🇫🇷' },
  { code: 'BE', nom: 'Belgique',       ind: '+32',  flag: '🇧🇪' },
  { code: 'CH', nom: 'Suisse',         ind: '+41',  flag: '🇨🇭' },
  { code: 'CA', nom: 'Canada',         ind: '+1',   flag: '🇨🇦' },
  { code: 'US', nom: 'États-Unis',     ind: '+1',   flag: '🇺🇸' },
  { code: 'GB', nom: 'Royaume-Uni',    ind: '+44',  flag: '🇬🇧' },
  { code: 'DE', nom: 'Allemagne',      ind: '+49',  flag: '🇩🇪' },
  { code: 'IT', nom: 'Italie',         ind: '+39',  flag: '🇮🇹' },
  { code: 'ES', nom: 'Espagne',        ind: '+34',  flag: '🇪🇸' },
  { code: 'PT', nom: 'Portugal',       ind: '+351', flag: '🇵🇹' },
];

const SECTEURS = [
  { value: 'commerce',     label: 'Commerce / Distribution' },
  { value: 'restauration', label: 'Restauration / Alimentation' },
  { value: 'services',     label: 'Services aux entreprises' },
  { value: 'artisanat',    label: 'Artisanat / Fabrication' },
  { value: 'transport',    label: 'Transport / Logistique' },
  { value: 'agriculture',  label: 'Agriculture / Élevage' },
  { value: 'technologie',  label: 'Technologie / Numérique' },
  { value: 'sante',        label: 'Santé / Pharmacie' },
  { value: 'education',    label: 'Éducation / Formation' },
  { value: 'immobilier',   label: 'Immobilier / Construction' },
  { value: 'autre',        label: 'Autre' },
];

// ── ICÔNES SVG ───────────────────────────────────────────────
const IcoBuilding = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1"/>
  </svg>
);
const IcoTag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const IcoMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcoPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IcoLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IcoEye = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    }
  </svg>
);
const IcoGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoChevron = ({ up }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {up ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
  </svg>
);

// ── COMPOSANT CHAMP ──────────────────────────────────────────
function Champ({ label, name, type, placeholder, value, onChange, required, icon, right }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={F.group}>
      <label style={F.label}>{label}{required && <span style={{ color: '#D4AF37' }}> *</span>}</label>
      <div style={{ ...F.wrap, borderColor: focused ? '#D4AF37' : '#222', boxShadow: focused ? '0 0 0 3px rgba(212,175,55,0.08)' : 'none' }}>
        {icon && <span style={F.ico}>{icon}</span>}
        <input type={type || 'text'} name={name} placeholder={placeholder} value={value}
          onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...F.input, paddingLeft: icon ? 4 : 16 }} autoComplete="off" />
        {right}
      </div>
    </div>
  );
}

// ── SÉLECTEUR PAYS ──────────────────────────────────────────
function SelectPays({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const pays = PAYS.find(p => p.code === value) || PAYS[0];
  const filtered = PAYS.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) || p.ind.includes(search)
  );

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{ ...F.group, flex: 1 }} ref={ref}>
      <label style={F.label}>Pays <span style={{ color: '#D4AF37' }}>*</span></label>
      <div style={{ position: 'relative' }}>
        <div style={{ ...F.wrap, cursor: 'pointer', borderColor: open ? '#D4AF37' : '#222', boxShadow: open ? '0 0 0 3px rgba(212,175,55,0.08)' : 'none' }}
          onClick={() => setOpen(!open)}>
          <span style={F.ico}><FlagImg code={pays.code} flag={pays.flag} nom={pays.nom} /></span>
          <span style={{ flex: 1, color: '#ccc', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pays.nom}</span>
          <span style={{ padding: '0 12px', flexShrink: 0 }}><IcoChevron up={open} /></span>
        </div>

        {open && (
          <div style={F.dd}>
            <div style={F.ddSearch}>
              <IcoSearch />
              <input style={F.ddSI} placeholder="Rechercher..." value={search}
                onChange={e => setSearch(e.target.value)} autoFocus onClick={e => e.stopPropagation()} />
            </div>
            <div style={F.ddList}>
              {filtered.length === 0 && <p style={F.ddVide}>Aucun pays trouvé</p>}
              {filtered.map(p => (
                <div key={p.code}
                  style={{ ...F.ddItem, background: p.code === value ? 'rgba(212,175,55,0.06)' : 'transparent' }}
                  onClick={() => { onChange(p.code); setOpen(false); setSearch(''); }}>
                  <FlagImg code={p.code} flag={p.flag} nom={p.nom} />
                  <span style={{ flex: 1, color: '#ccc', fontSize: 13 }}>{p.nom}</span>
                  <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 600 }}>{p.ind}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CHAMP TÉLÉPHONE ──────────────────────────────────────────
function ChampTel({ pays, tel, onChange }) {
  const [focused, setFocused] = useState(false);
  const p = PAYS.find(x => x.code === pays) || PAYS[0];
  return (
    <div style={{ ...F.group, flex: 1 }}>
      <label style={F.label}>Téléphone</label>
      <div style={{ ...F.wrap, padding: 0, borderColor: focused ? '#D4AF37' : '#222', boxShadow: focused ? '0 0 0 3px rgba(212,175,55,0.08)' : 'none' }}>
        <div style={F.telPre}>
          <FlagImg code={p.code} flag={p.flag} nom={p.nom} size={20} />
          <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{p.ind}</span>
        </div>
        <input type="tel" placeholder="70 000 000" value={tel} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...F.input, paddingLeft: 14 }} />
      </div>
    </div>
  );
}

// ── COMPOSANT PRINCIPAL ──────────────────────────────────────
export default function InscriptionPME() {
  const navigate = useNavigate();
  const [paysCode, setPaysCode] = useState('SN');
  const [form, setForm] = useState({ nom: '', secteur: '', email: '', tel: '', mdp: '', mdp2: '' });
  const [showMdp, setShowMdp] = useState(false);
  const [showMdp2, setShowMdp2] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [focusedSecteur, setFocusedSecteur] = useState(false);
  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErreur(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.secteur || !form.email || !form.mdp) {
      setErreur('Merci de remplir tous les champs obligatoires.'); return;
    }
    if (form.mdp !== form.mdp2) { setErreur('Les mots de passe ne correspondent pas.'); return; }
    if (form.mdp.length < 6) { setErreur('Le mot de passe doit faire au moins 6 caractères.'); return; }
    setChargement(true);
    try {
      const paysData = PAYS.find(p => p.code === paysCode) || PAYS[0];
      const telephone = form.tel ? paysData.ind + ' ' + form.tel : '';
      const res = await fetch('http://localhost:3003/api/pme/inscription', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: form.nom, secteur: form.secteur, email: form.email, mot_de_passe: form.mdp, telephone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      localStorage.setItem('pme_token', data.token);
      localStorage.setItem('pme', JSON.stringify(data.pme));
      setSucces(true);
      setTimeout(() => navigate('/pme/dashboard'), 1500);
    } catch (err) { setErreur(err.message || 'Une erreur est survenue.'); }
    finally { setChargement(false); }
  };

  return (
    <div style={S.root}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .insc-gauche {
          width: 42%; min-height: 100vh;
          position: relative; overflow: hidden; flex-shrink: 0;
        }
        .insc-droite {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 48px 40px; overflow-y: auto; min-height: 100vh;
        }
        .insc-fwrap { width: 100%; max-width: 480px; }
        .insc-pays-tel { display: flex; gap: 12px; }

        @media (max-width: 900px) {
          .insc-gauche { display: none; }
          .insc-droite { padding: 32px 24px; }
        }
        @media (max-width: 480px) {
          .insc-droite { padding: 20px 14px; }
          .insc-pays-tel { flex-direction: column; }
          .insc-fwrap { max-width: 100%; }
        }
      `}</style>

      {/* ── GAUCHE — PHOTO AFRICAINE ──────────────────────── */}
      <div className="insc-gauche">
        <img
          src="https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=1100&fit=crop&crop=top&q=88"
          alt="Entrepreneur africaine BCX Finance"
          style={S.photo}
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=1100&fit=crop&crop=top&q=88';
          }}
        />
        <div style={S.overlay} />
        <div style={S.gContent}>
          <div style={S.logo} onClick={() => navigate('/')}><img src="/logo.jpeg" alt="BCX Finance" style={{ height: 48, objectFit: 'contain' }} /></div>

          {/* Témoignage */}
          <div style={S.testi}>
            <div style={S.stars}>★★★★★</div>
            <p style={S.testiText}>
              "Grâce au Score BCX, j'ai obtenu mon premier crédit bancaire. Ma boutique a triplé de taille en 6 mois."
            </p>
            <div style={S.testiAut}>
              <div style={S.testiAv}>A</div>
              <div>
                <p style={S.testiNom}>Aminata Diallo</p>
                <p style={S.testiRole}>Boutique Couleur d'Afrique · Dakar, SN</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={S.statsRow}>
            {[['500+','PMEs inscrites'],['83/100','Score moyen'],['< 2min','Inscription']].map(([v,l]) => (
              <div key={l} style={S.statItem}>
                <span style={S.statVal}>{v}</span>
                <span style={S.statLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DROITE — FORMULAIRE ──────────────────────────── */}
      <div className="insc-droite">
        <div className="insc-fwrap">
          <button style={S.retour} onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Retour à l'accueil
          </button>

          <h1 style={S.titre}>Créer votre compte PME</h1>
          <p style={S.sousTitre}>Gratuit, sans engagement. Accès immédiat à votre dashboard.</p>

          {succes && (
            <div style={S.ok}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Compte créé ! Redirection en cours...
            </div>
          )}
          {erreur && (
            <div style={S.ko}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {erreur}
            </div>
          )}

          <form onSubmit={submit} style={S.form}>

            {/* Nom PME */}
            <Champ label="Nom de la PME" name="nom" placeholder="Ex : Boutique Couleur d'Afrique"
              value={form.nom} onChange={e => set('nom', e.target.value)} required
              icon={<IcoBuilding />} />

            {/* Secteur */}
            <div style={F.group}>
              <label style={F.label}>Secteur d'activité <span style={{ color: '#D4AF37' }}>*</span></label>
              <div style={{ ...F.wrap, borderColor: focusedSecteur ? '#D4AF37' : '#222', boxShadow: focusedSecteur ? '0 0 0 3px rgba(212,175,55,0.08)' : 'none', overflow: 'hidden' }}>
                <span style={F.ico}><IcoTag /></span>
                <select value={form.secteur} onChange={e => set('secteur', e.target.value)} required
                  onFocus={() => setFocusedSecteur(true)} onBlur={() => setFocusedSecteur(false)}
                  style={{ ...F.input, paddingLeft: 4, cursor: 'pointer', color: form.secteur ? '#fff' : '#555', appearance: 'none', WebkitAppearance: 'none' }}>
                  <option value="" style={{ background: '#111', color: '#555' }}>Choisir votre secteur...</option>
                  {SECTEURS.map(sx => (
                    <option key={sx.value} value={sx.value} style={{ background: '#111', color: '#fff' }}>{sx.label}</option>
                  ))}
                </select>
                <span style={{ padding: '0 12px' }}><IcoChevron /></span>
              </div>
            </div>

            {/* Email */}
            <Champ label="Email professionnel" name="email" type="email"
              placeholder="contact@mapme.com" value={form.email}
              onChange={e => set('email', e.target.value)} required icon={<IcoMail />} />

            {/* Pays + Téléphone */}
            <div className="insc-pays-tel">
              <SelectPays value={paysCode} onChange={setPaysCode} />
              <ChampTel pays={paysCode} tel={form.tel} onChange={e => set('tel', e.target.value)} />
            </div>

            {/* Mot de passe */}
            <Champ label="Mot de passe" name="mdp" type={showMdp ? 'text' : 'password'}
              placeholder="Au moins 6 caractères" value={form.mdp}
              onChange={e => set('mdp', e.target.value)} required icon={<IcoLock />}
              right={
                <button type="button" style={F.eye} onClick={() => setShowMdp(!showMdp)}>
                  <IcoEye open={showMdp} />
                </button>
              } />

            {/* Confirmer mot de passe */}
            <Champ label="Confirmer le mot de passe" name="mdp2" type={showMdp2 ? 'text' : 'password'}
              placeholder="Répétez votre mot de passe" value={form.mdp2}
              onChange={e => set('mdp2', e.target.value)} required icon={<IcoLock />}
              right={
                <button type="button" style={F.eye} onClick={() => setShowMdp2(!showMdp2)}>
                  <IcoEye open={showMdp2} />
                </button>
              } />

            {/* Barre de sécurité mot de passe */}
            {form.mdp.length > 0 && (
              <div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => {
                    const force = form.mdp.length < 6 ? 1 : form.mdp.length < 10 ? 2 : form.mdp.match(/[A-Z]/) && form.mdp.match(/[0-9]/) ? 4 : 3;
                    return <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= force ? ['','#FF4444','#F5A623','#D4AF37','#4CAF50'][force] : '#1a1a1a', transition: 'background 0.3s' }} />;
                  })}
                </div>
                <p style={{ color: '#444', fontSize: 11, margin: 0 }}>
                  {form.mdp.length < 6 ? 'Trop court' : form.mdp.length < 10 ? 'Acceptable' : form.mdp.match(/[A-Z]/) && form.mdp.match(/[0-9]/) ? 'Excellent' : 'Bon'}
                </p>
              </div>
            )}

            {/* Bouton submit */}
            <button type="submit" style={{ ...S.btn, opacity: chargement ? 0.75 : 1 }} disabled={chargement}>
              {chargement ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #00000033', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Création du compte...
                </span>
              ) : 'Créer mon compte gratuit →'}
            </button>

          </form>

          <p style={S.link}>Déjà inscrit ?{' '}
            <Link to="/pme/connexion" style={{...S.linkOr, textDecoration: 'none'}}>Se connecter</Link>
          </p>

          <div style={S.conf}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Vos données sont chiffrées et sécurisées par BCX Finance
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STYLES CHAMPS ────────────────────────────────────────────
const F = {
  group: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { color: '#777', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' },
  wrap: { display: 'flex', alignItems: 'center', background: '#0f0f0f', border: '1.5px solid #222', borderRadius: 12, height: 54, transition: 'border-color 0.2s, box-shadow 0.2s', position: 'relative' },
  ico: { padding: '0 10px 0 16px', flexShrink: 0, display: 'flex', alignItems: 'center' },
  input: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: "'Inter',-apple-system,sans-serif", height: '100%', paddingRight: 12 },
  eye: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 14px', display: 'flex', alignItems: 'center', flexShrink: 0 },
  telPre: { display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderRight: '1px solid #1a1a1a', height: '100%', flexShrink: 0, minWidth: 88 },
  dd: { position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '100%', minWidth: 240, maxWidth: 340, background: '#111', border: '1.5px solid #222', borderRadius: 14, zIndex: 1000, boxShadow: '0 24px 64px rgba(0,0,0,0.8)', overflow: 'hidden' },
  ddSearch: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid #1a1a1a' },
  ddSI: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit' },
  ddList: { maxHeight: 220, overflowY: 'auto' },
  ddItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', transition: 'background 0.15s' },
  ddVide: { color: '#444', fontSize: 13, padding: '16px', margin: 0, textAlign: 'center' },
};

// ── STYLES PAGE ──────────────────────────────────────────────
const S = {
  root: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', fontFamily: "'Inter',-apple-system,sans-serif" },

  // GAUCHE
  gauche: { width: '42%', minHeight: '100vh', position: 'relative', overflow: 'hidden', flexShrink: 0 },
  photo: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', position: 'absolute', inset: 0 },
  overlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.1) 30%, rgba(10,10,10,0.92) 100%)' },
  gContent: { position: 'relative', zIndex: 1, height: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px' },
  logo: { fontSize: 26, fontWeight: 900, letterSpacing: 1, color: '#fff', cursor: 'pointer', userSelect: 'none' },
  testi: { background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(212,175,55,0.15)', borderLeft: '3px solid #D4AF37', borderRadius: 16, padding: '22px 20px', backdropFilter: 'blur(24px)' },
  stars: { color: '#D4AF37', fontSize: 13, marginBottom: 10, letterSpacing: 2 },
  testiText: { color: '#bbb', fontSize: 14, lineHeight: 1.75, margin: '0 0 14px', fontStyle: 'italic' },
  testiAut: { display: 'flex', alignItems: 'center', gap: 12 },
  testiAv: { width: 38, height: 38, borderRadius: '50%', background: '#D4AF37', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, flexShrink: 0 },
  testiNom: { color: '#fff', fontSize: 13, fontWeight: 700, margin: 0 },
  testiRole: { color: '#666', fontSize: 11, margin: 0 },
  statsRow: { display: 'flex', gap: 28 },
  statItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  statVal: { color: '#D4AF37', fontSize: 20, fontWeight: 900 },
  statLbl: { color: '#555', fontSize: 10 },

  // DROITE
  droite: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto', minHeight: '100vh' },
  fWrap: { width: '100%', maxWidth: 480 },
  retour: { background: 'transparent', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', padding: 0 },
  titre: { color: '#fff', fontSize: 24, fontWeight: 900, margin: '0 0 8px', letterSpacing: -0.5 },
  sousTitre: { color: '#555', fontSize: 13, margin: '0 0 24px', lineHeight: 1.6 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  btn: { background: '#D4AF37', border: 'none', borderRadius: 12, color: '#000', cursor: 'pointer', fontSize: 15, fontWeight: 800, padding: '15px', width: '100%', fontFamily: 'inherit', marginTop: 4, transition: 'opacity 0.2s' },
  ok: { background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.2)', borderRadius: 10, color: '#4CAF50', fontSize: 13, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  ko: { background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.18)', borderRadius: 10, color: '#FF4444', fontSize: 13, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  link: { color: '#555', fontSize: 13, marginTop: 18, textAlign: 'center' },
  linkOr: { color: '#D4AF37', cursor: 'pointer', fontWeight: 600 },
  conf: { color: '#2a2a2a', fontSize: 11, textAlign: 'center', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
};
