import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Wallet, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Tableau de bord', path: '/tableau-bord' },
    { icon: <TrendingUp size={18} />, label: 'Mes investissements', path: '/dashboard' },
    { icon: <Wallet size={18} />, label: 'Mes dépôts', path: '/depot/mes-depots' },
  ];

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.sidebarContainer}>
      {/* LE MOTEUR BEAM AMÉLIORÉ (EFFET FLUIDE & TRAÎNÉE DE COMÈTE LUMINEUSE) */}
      <style>{`
        @keyframes borderBeamRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .beam-card-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: #060608;
          overflow: hidden;
        }

        /* 1. LA LAMPE EN ARRIÈRE-PLAN : Crée le halo flouté (Glow) qui rayonne à l'extérieur */
        .beam-card-container::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent 70%,
            rgba(212, 175, 55, 0.1) 82%,
            rgba(212, 175, 55, 0.4) 92%,
            #F5E17A 97%,
            #D4AF37 100%
          );
          animation: borderBeamRotate 6s linear infinite;
          pointer-events: none;
          z-index: 1;
          filter: blur(8px);
        }

        /* 2. LA LAMPE EN AVANT-PLAN : Crée la ligne nette et scintillante sur la bordure */
        .beam-card-container::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent 75%,
            rgba(212, 175, 55, 0.2) 85%,
            #F5E17A 96%,
            #D4AF37 100%
          );
          animation: borderBeamRotate 6s linear infinite;
          pointer-events: none;
          z-index: 2;
        }

        /* LE CADRE NOIR INTERNE */
        .sidebar-content-layer {
          position: absolute;
          inset: 1.5px; 
          background: #060608;
          z-index: 3;
          display: flex;
          flex-direction: column;
          padding: 32px 16px 24px 16px;
          box-sizing: border-box;
        }

        /* Animations et interactions du menu */
        .menu-btn-effect {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .menu-btn-effect:hover {
          color: #FFF !important;
          background: rgba(212, 175, 55, 0.02) !important;
        }

        .logout-btn-effect {
          transition: all 0.3s ease !important;
        }
        .logout-btn-effect:hover {
          background: rgba(255, 68, 68, 0.04) !important;
          color: #FF4444 !important;
        }
      `}</style>

      <div className="beam-card-container">
        <div className="sidebar-content-layer">

          {/* LOGO */}
          <div style={styles.logoBox}>
            <Link to="/">
              <img
                src="/logo-optimized.png"
                alt="BCX Finance"
                style={{ height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.2))', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Link>
          </div>

          {/* USER INFO */}
          <div style={styles.userBox}>
            <div style={styles.avatar}>
              {user.prenom?.[0]}{user.nom?.[0]}
            </div>
            <div>
              <p style={styles.userName}>{user.prenom} {user.nom}</p>
              <p style={styles.userRole}>Investisseur</p>
            </div>
          </div>

          <div style={styles.divider} />

          {/* MENU */}
          <nav style={styles.nav}>
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.label}
                  className={!active ? "menu-btn-effect" : ""}
                  style={active ? styles.menuItemActive : styles.menuItem}
                  onClick={() => navigate(item.path)}
                >
                  {/* FUSION PROPRE DES STYLES ICI ──> [...styles.menuIcon + la couleur dynamique] */}
                  <span style={{ ...styles.menuIcon, color: active ? '#D4AF37' : '#555562' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div style={{ flex: 1 }} />
          <div style={styles.divider} />

          {/* BOUTON DE DÉCONNEXION EN BAS */}
          <button style={styles.logoutBtn} className="logout-btn-effect" onClick={logout}>
            <span style={styles.menuIcon}><LogOut size={18} /></span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebarContainer: {
    width: '240px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    boxSizing: 'border-box',
    background: '#060608',
  },
  logoBox: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoText: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '4px',
    filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.15))',
  },
  logoSub: {
    display: 'block',
    fontSize: '11px',
    letterSpacing: '6px',
    color: '#44444F',
    marginTop: '-4px',
    fontWeight: '700',
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#0B0B0E',
    border: '1px solid #121216',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#060608',
    fontWeight: '800',
    fontSize: '13px',
    flexShrink: 0,
    boxShadow: '0 0 10px rgba(212,175,55,0.2)',
  },
  userName: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
  },
  userRole: {
    color: '#A1A1AA', // Changed from #555562 for better readability
    fontSize: '11px',
    fontWeight: '500',
    margin: '2px 0 0',
    letterSpacing: '0.5px',
  },
  divider: {
    height: '1px',
    background: '#121216',
    margin: '16px 0',
    flexShrink: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#555562',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  menuItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    background: 'rgba(212, 175, 55, 0.03)',
    color: '#FFF',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    fontWeight: '600',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.05)',
  },
  menuIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    flexShrink: 0,
  },
};
