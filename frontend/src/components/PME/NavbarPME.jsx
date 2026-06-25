// NAVBAR PME — BCX Finance | Auteur : Parfait Eric Yao
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LIENS = [
  { path: '/pme/dashboard',             label: 'Tableau de bord', icon: '▦' },
  { path: '/pme/nouvelle-transaction',  label: 'Transaction',     icon: '＋' },
  { path: '/pme/rapport',               label: 'Rapport',         icon: '◫' },
  { path: '/pme/score',                 label: 'Score BCX',       icon: '◉' },
  { path: '/pme/profil',                label: 'Mon profil',      icon: '◎' },
];

export default function NavbarPME() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const pme = JSON.parse(localStorage.getItem('pme') || '{}');
  const initiale = pme.nom ? pme.nom[0].toUpperCase() : 'P';

  const seDeconnecter = () => {
    localStorage.removeItem('pme_token');
    localStorage.removeItem('pme');
    navigate('/');
  };

  return (
    <>
      {/* ── BARRE DESKTOP ───────────────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          {/* Logo */}
          <div style={s.logo} onClick={() => navigate('/pme/dashboard')}>
            <img src="/logo.jpeg" alt="BCX Finance" style={{ height: 38, objectFit: 'contain' }} />
          </div>

          {/* Liens */}
          <div style={s.liens}>
            {LIENS.slice(0, 4).map(l => (
              <button
                key={l.path}
                style={{ ...s.lien, ...(pathname === l.path ? s.lienActif : {}) }}
                onClick={() => navigate(l.path)}
              >
                <span style={s.lienIcon}>{l.icon}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          {/* Avatar + profil */}
          <div style={s.droite}>
            <button style={s.avatarBtn} onClick={() => navigate('/pme/profil')}>
              <div style={s.avatar}>{initiale}</div>
              <div style={s.avatarInfo}>
                <span style={s.avatarNom}>{pme.nom || 'Ma PME'}</span>
                <span style={s.avatarRole}>Compte PME</span>
              </div>
            </button>
            <button style={s.btnDeconnexion} onClick={seDeconnecter} title="Se déconnecter">
              ⏻
            </button>
          </div>

          {/* Hamburger mobile */}
          <button style={s.hamburger} onClick={() => setMenuOuvert(!menuOuvert)}>
            <span style={s.bar} /><span style={s.bar} /><span style={s.bar} />
          </button>
        </div>
      </nav>

      {/* ── MENU MOBILE ─────────────────────────────────────── */}
      {menuOuvert && (
        <div style={s.mobileMenu}>
          {LIENS.map(l => (
            <button key={l.path} style={{ ...s.mobileLien, ...(pathname === l.path ? s.mobileLienActif : {}) }}
              onClick={() => { navigate(l.path); setMenuOuvert(false); }}>
              <span style={{ fontSize: 18 }}>{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
          <button style={s.mobileBtnDeco} onClick={seDeconnecter}>⏻ Se déconnecter</button>
        </div>
      )}

      {/* ── BARRE MOBILE BAS ────────────────────────────────── */}
      <div style={s.tabBar}>
        {LIENS.map(l => (
          <button key={l.path} style={{ ...s.tabBtn, ...(pathname === l.path ? s.tabBtnActif : {}) }}
            onClick={() => navigate(l.path)}>
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <span style={{ fontSize: 9, marginTop: 2 }}>{l.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </>
  );
}

const s = {
  nav: { background: 'rgba(10,10,10,0.97)', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' },
  navInner: { maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 24 },
  logo: { fontSize: 18, fontWeight: 900, letterSpacing: 2, color: '#fff', cursor: 'pointer', userSelect: 'none', flexShrink: 0 },
  liens: { display: 'flex', gap: 4, flex: 1 },
  lien: { alignItems: 'center', background: 'transparent', border: 'none', borderRadius: 8, color: '#444', cursor: 'pointer', display: 'flex', fontSize: 13, gap: 6, padding: '7px 12px' },
  lienActif: { background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' },
  lienIcon: { fontSize: 15 },
  droite: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  avatarBtn: { alignItems: 'center', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 10, cursor: 'pointer', display: 'flex', gap: 10, padding: '6px 12px' },
  avatar: { alignItems: 'center', background: '#D4AF37', borderRadius: 8, color: '#000', display: 'flex', fontSize: 14, fontWeight: 800, height: 32, justifyContent: 'center', minWidth: 32 },
  avatarInfo: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  avatarNom: { color: '#ccc', fontSize: 12, fontWeight: 600 },
  avatarRole: { color: '#444', fontSize: 10 },
  btnDeconnexion: { background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 8, color: '#333', cursor: 'pointer', fontSize: 16, height: 36, padding: '0 10px' },
  hamburger: { display: 'none', flexDirection: 'column', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 },
  bar: { width: 20, height: 2, background: '#555', borderRadius: 2, display: 'block' },
  mobileMenu: { background: '#0d0d0d', borderBottom: '1px solid #111', display: 'flex', flexDirection: 'column', padding: '8px 16px 16px' },
  mobileLien: { alignItems: 'center', background: 'transparent', border: 'none', borderBottom: '1px solid #111', color: '#555', cursor: 'pointer', display: 'flex', fontSize: 14, gap: 12, padding: '14px 8px' },
  mobileLienActif: { color: '#D4AF37' },
  mobileBtnDeco: { background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 8, color: '#FF4444', cursor: 'pointer', fontSize: 13, marginTop: 12, padding: '10px' },
  tabBar: { background: 'rgba(10,10,10,0.98)', borderTop: '1px solid #111', bottom: 0, display: 'none', left: 0, padding: '8px 0 12px', position: 'fixed', right: 0, zIndex: 100 },
  tabBtn: { alignItems: 'center', background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', display: 'flex', flexDirection: 'column', flex: 1, fontSize: 11, padding: '6px 4px', fontFamily: "'Inter',sans-serif" },
  tabBtnActif: { color: '#D4AF37' },
};
