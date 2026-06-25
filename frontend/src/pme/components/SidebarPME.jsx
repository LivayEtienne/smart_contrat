import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/pme/dashboard',             label: 'Tableau de bord', icon: '▦' },
  { path: '/pme/nouvelle-transaction',  label: 'Transactions',    icon: '＋' },
  { path: '/pme/rapport',              label: 'Rapport mensuel', icon: '◫' },
  { path: '/pme/score',                label: 'Score BCX',       icon: '◉' },
];

const COMPTE = [
  { path: '/pme/profil', label: 'Mon profil', icon: '◎' },
];

function NavLink({ lien, actif, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
      padding: '9px 12px', marginBottom: 2, fontFamily: "'Inter',sans-serif",
      background: actif ? 'rgba(212,175,55,0.08)' : 'transparent',
      border: actif ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent',
      borderRadius: 10, cursor: 'pointer', color: actif ? '#D4AF37' : '#555',
      fontSize: 13, transition: 'all 0.15s', textAlign: 'left',
    }}>
      <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{lien.icon}</span>
      <span style={{ fontWeight: actif ? 600 : 400 }}>{lien.label}</span>
    </button>
  );
}

function PmeCard({ pme, onClick }) {
  const initiale = pme.nom ? pme.nom[0].toUpperCase() : 'P';
  return (
    <div onClick={onClick} style={{
      background: '#111', border: '1px solid #1a1a1a', borderRadius: 12,
      padding: '12px 14px', marginBottom: 20, cursor: 'pointer',
    }}>
      <p style={{ color: '#333', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 8px', fontFamily: "'Inter',sans-serif" }}>Ma PME</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: '#D4AF37', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#000', flexShrink: 0 }}>{initiale}</div>
        <div style={{ overflow: 'hidden', minWidth: 0 }}>
          <p style={{ color: '#ccc', fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Inter',sans-serif" }}>{pme.nom || 'Ma PME'}</p>
          <p style={{ color: '#444', fontSize: 11, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Inter',sans-serif" }}>{pme.secteur || 'Secteur'}</p>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ pme, pathname, navigate, close }) {
  const seDeconnecter = () => {
    localStorage.removeItem('pme_token');
    localStorage.removeItem('pme');
    navigate('/');
  };
  return (
    <>
      {/* Logo */}
      <div onClick={() => { navigate('/pme/dashboard'); close?.(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px 20px', cursor: 'pointer' }}>
        <img src="/logo.jpeg" alt="BCX Finance" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      <PmeCard pme={pme} onClick={() => { navigate('/pme/profil'); close?.(); }} />

      <p style={s.catLabel}>Général</p>
      {NAV.map(l => (
        <NavLink key={l.path} lien={l} actif={pathname === l.path} onClick={() => { navigate(l.path); close?.(); }} />
      ))}

      <p style={{ ...s.catLabel, marginTop: 16 }}>Mon compte</p>
      {COMPTE.map(l => (
        <NavLink key={l.path} lien={l} actif={pathname === l.path} onClick={() => { navigate(l.path); close?.(); }} />
      ))}

      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #111' }}>
        <button onClick={seDeconnecter} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', background: 'transparent', border: '1px solid transparent', borderRadius: 10, cursor: 'pointer', color: '#333', fontSize: 13, fontFamily: "'Inter',sans-serif", transition: 'color 0.15s' }}>
          <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>⏻</span>
          <span>Se déconnecter</span>
        </button>
      </div>
    </>
  );
}

export default function SidebarPME() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ouvert, setOuvert] = useState(false);
  const [estMobile, setEstMobile] = useState(window.innerWidth < 900);
  const pme = JSON.parse(localStorage.getItem('pme') || '{}');

  useEffect(() => {
    const onResize = () => setEstMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => { setOuvert(false); }, [pathname]);

  if (!estMobile) {
    return (
      <div style={s.sidebar}>
        <SidebarContent pme={pme} pathname={pathname} navigate={navigate} />
      </div>
    );
  }

  return (
    <>
      <div style={s.topBar}>
        <div onClick={() => navigate('/pme/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#D4AF37,#F5E17A)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#000' }}>B</div>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: "'Inter',sans-serif" }}>BCX <span style={{ color: '#D4AF37' }}>PME</span></span>
        </div>
        <button onClick={() => setOuvert(!ouvert)} style={{ background: 'transparent', border: '1px solid #222', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 18, padding: '4px 10px', lineHeight: 1 }}>
          {ouvert ? '✕' : '☰'}
        </button>
      </div>

      {ouvert && <div onClick={() => setOuvert(false)} style={s.overlay} />}

      <div style={{ ...s.drawer, transform: ouvert ? 'translateX(0)' : 'translateX(-100%)' }}>
        <SidebarContent pme={pme} pathname={pathname} navigate={navigate} close={() => setOuvert(false)} />
      </div>
    </>
  );
}

const s = {
  sidebar: {
    width: 240, height: '100vh', background: '#0d0d0d',
    borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column',
    position: 'sticky', top: 0,
    padding: '20px 12px', flexShrink: 0, boxSizing: 'border-box',
    overflowY: 'auto',
  },
  catLabel: {
    color: '#2a2a2a', fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
    textTransform: 'uppercase', margin: '0 6px 6px',
    fontFamily: "'Inter',sans-serif",
  },
  topBar: {
    position: 'fixed', top: 0, left: 0, right: 0, height: 56,
    background: 'rgba(13,13,13,0.98)', borderBottom: '1px solid #1a1a1a',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px', zIndex: 200, backdropFilter: 'blur(12px)',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300,
  },
  drawer: {
    position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
    background: '#0d0d0d', borderRight: '1px solid #1a1a1a', zIndex: 400,
    padding: '20px 12px', display: 'flex', flexDirection: 'column',
    transition: 'transform 0.25s ease', overflowY: 'auto',
    boxSizing: 'border-box',
  },
};
