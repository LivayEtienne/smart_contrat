import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { depotService, adminService } from '../services/api';

export default function AdminPanel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [depots, setDepots] = useState([]);
  const [filtre, setFiltre] = useState('en_attente');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [motifRefus, setMotifRefus] = useState('');
  const [showMotif, setShowMotif] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  // États pour gérer l'animation de survol via JS pour les cartes (alternative propre aux pseudo-classes CSS)
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchDepots = async () => {
    setLoading(true);
    try {
      const res = await depotService.tousLesDepots(filtre);
      setDepots(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepots(); }, [filtre]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await adminService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setStatsError('Erreur de chargement des statistiques');
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleValider = async (id) => {
    setActionId(id);
    try {
      await depotService.valider(id);
      fetchDepots();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setActionId(null);
    }
  };

  const handleRefuser = async (id) => {
    if (!motifRefus) return;
    setActionId(id);
    try {
      await depotService.refuser(id, motifRefus);
      setShowMotif(null);
      setMotifRefus('');
      fetchDepots();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setActionId(null);
    }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const statutColor = { en_attente: '#F5A623', valide: '#4CAF50', refuse: '#FF4444' };
  const statutBg = { en_attente: 'rgba(245,166,35,0.08)', valide: 'rgba(76,175,80,0.08)', refuse: 'rgba(255,68,68,0.08)' };

  return (
    <div style={styles.page}>
      {/* BARRE DE NAVIGATION */}
      <nav style={styles.nav}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/logo-optimized.png"
            alt="BCX Finance Admin"
            style={{ height: '36px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.2))', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>
        <div style={styles.navRight}>
          <div style={{ textAlign: 'right' }}>
            <p style={styles.navUser}>{user.prenom} {user.nom}</p>
            <p style={{ ...styles.infoLabel, margin: 0, color: '#D4AF37', fontSize: '10px' }}>Premium Access</p>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>Déconnexion</button>
        </div>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <div style={styles.content}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Gestion des dépôts</h1>
          <span style={styles.badgeCount}>{depots.length} {depots.length > 1 ? 'flux' : 'flux'}</span>
        </div>

        {/* STATISTIQUES */}
        {statsLoading ? (
          <div style={styles.statsCard}>
            <p style={{ color: '#D4AF37', margin: 0 }}>Chargement des statistiques...</p>
          </div>
        ) : statsError ? (
          <div style={styles.statsCard}>
            <p style={{ color: '#FF4444', margin: 0 }}>{statsError}</p>
          </div>
        ) : stats && (
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <span style={styles.infoLabel}>Total Investisseurs</span>
              <span style={styles.statValue}>{stats.total_investisseurs}</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.infoLabel}>Total Dépôts</span>
              <span style={styles.statValue}>{stats.total_depots}</span>
            </div>
            <div style={{ ...styles.statBox, borderColor: '#D4AF37', background: 'rgba(212,175,55,0.02)' }}>
              <span style={styles.infoLabel}>Tokens BCX Distribués</span>
              <span style={{ ...styles.statValue, color: '#D4AF37' }}>
                {stats.total_bcx_distribues?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        )}

        {/* FILTRES ANIMÉS */}
        <div style={styles.filtres}>
          {[
            { key: 'en_attente', label: 'En attente' },
            { key: 'valide', label: 'Validés' },
            { key: 'refuse', label: 'Refusés' },
            { key: '', label: 'Tous les flux' }
          ].map((f) => (
            <button
              key={f.key}
              style={filtre === f.key ? styles.filtreActive : styles.filtre}
              onClick={() => setFiltre(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* LISTE AVEC EFFETS FINANCIERS */}
        {loading ? (
          <div style={styles.loadingWrapper}>
            <div style={styles.shimmerText}>Analyse du registre en cours...</div>
          </div>
        ) : depots.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '15px', color: '#fff', marginBottom: '6px', fontWeight: '500' }}>Aucun mouvement</p>
            <p style={{ color: '#666', margin: 0, fontSize: '13px' }}>Aucune transaction enregistrée dans cette catégorie.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {depots.map((d, index) => {
              const isHovered = hoveredCard === d.id;

              return (
                <div
                  key={d.id}
                  style={{
                    ...styles.depotCard,
                    ...(isHovered ? styles.depotCardHover : {}),
                    // Légère cascade d'apparition initiale basée sur l'index
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                  }}
                  onMouseEnter={() => setHoveredCard(d.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={styles.depotHeader}>
                    <div>
                      <p style={styles.investName}>
                        {d.Investisseur?.prenom} {d.Investisseur?.nom}
                      </p>
                      <p style={styles.investEmail}>{d.Investisseur?.email}</p>
                    </div>
                    <span style={{
                      ...styles.statut,
                      color: statutColor[d.statut],
                      background: statutBg[d.statut],
                      border: `1px solid rgba(${d.statut === 'valide' ? '76,175,80' : d.statut === 'refuse' ? '255,68,68' : '245,166,35'}, 0.15)`
                    }}>
                      {d.statut === 'en_attente' ? '● En attente' : d.statut === 'valide' ? '✓ Validé' : '✕ Refusé'}
                    </span>
                  </div>

                  {/* SECTION CHIFFRES STYLE TERMINAL TRADING */}
                  <div style={styles.depotInfo}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Montant d'origine</span>
                      <span style={{ ...styles.infoValue, color: '#fff', fontWeight: '600' }}>
                        {d.montant.toLocaleString()} {d.devise_origine}
                      </span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Valeur indexée</span>
                      <span style={{ ...styles.infoValue, color: '#D4AF37', fontWeight: '700' }}>
                        $ {d.montant_usd.toLocaleString()}
                      </span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Canal</span>
                      <span style={styles.infoValue}>Voie {d.voie}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Méthode</span>
                      <span style={styles.infoValue}>{d.moyen_paiement || '—'}</span>
                    </div>
                  </div>

                  {/* ACTIONS AVEC MICRO-INTERACTIONS */}
                  {d.statut === 'en_attente' && (
                    <div style={styles.actions}>
                      <button
                        style={styles.btnValider}
                        onClick={() => handleValider(d.id)}
                        disabled={actionId === d.id}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(76,175,80,0.3)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {actionId === d.id ? 'Traitement...' : 'Approuver le flux'}
                      </button>
                      <button
                        style={styles.btnRefuser}
                        onClick={() => setShowMotif(showMotif === d.id ? null : d.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,68,68,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Rejeter
                      </button>
                    </div>
                  )}

                  {/* BLOC REFUS AMÉLIORÉ */}
                  {showMotif === d.id && (
                    <div style={styles.motifBox}>
                      <input
                        style={styles.motifInput}
                        placeholder="Spécifiez le motif de rejet pour l'investisseur..."
                        value={motifRefus}
                        onChange={(e) => setMotifRefus(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={styles.btnAnnuler} onClick={() => setShowMotif(null)}>
                          Annuler
                        </button>
                        <button style={styles.btnConfirmRefus} onClick={() => handleRefuser(d.id)}>
                          Confirmer le rejet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INJECTION DES KEYFRAMES D'ANIMATION DANS LE DOM */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// STYLES AVEC TRANSITIONS ET LOGIQUE PREMIUM FINANCIÈRE
const styles = {
  page: {
    minHeight: '100vh',
    background: '#060608',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: '#fff',
    WebkitFontSmoothing: 'antialiased'
  },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 40px', borderBottom: '1px solid #141419', background: '#0B0B0E',
    position: 'sticky', top: 0, zIndex: 100,
  },
  navLogo: { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '2px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  navUser: { color: '#fff', fontSize: '14px', fontWeight: '500', margin: 0 },
  logoutBtn: {
    background: 'transparent', border: '1px solid #22222A', color: '#8E8E93',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
    fontWeight: '500', transition: 'all 0.2s ease',
  },
  content: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px' },
  headerRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' },
  title: { color: '#fff', fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' },
  badgeCount: {
    background: '#121217', color: '#8E8E93', fontSize: '11px', fontWeight: '600',
    padding: '4px 10px', borderRadius: '20px', border: '1px solid #22222A'
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' },
  statBox: { background: '#101014', border: '1px solid #1A1A22', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  statValue: { color: '#fff', fontSize: '24px', fontWeight: '800' },
  statsCard: { background: '#101014', border: '1px solid #1A1A22', borderRadius: '12px', padding: '20px', marginBottom: '28px', textAlign: 'center' },
  filtres: { display: 'flex', gap: '10px', marginBottom: '32px' },
  filtre: {
    background: '#101014', border: '1px solid #1F1F27', color: '#8E8E93',
    padding: '10px 22px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px',
    fontWeight: '500', transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  filtreActive: {
    background: 'rgba(212,175,55,0.06)', border: '1px solid #D4AF37', color: '#D4AF37',
    padding: '10px 22px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px',
    fontWeight: '600', boxShadow: '0 4px 12px rgba(212,175,55,0.05)',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  loadingWrapper: { padding: '80px 0', textAlign: 'center' },
  shimmerText: { color: '#D4AF37', fontWeight: '500', letterSpacing: '0.5px', animation: 'pulseGlow 2s infinite' },
  empty: {
    background: '#0B0B0E', border: '1px solid #141419', borderRadius: '16px',
    padding: '60px 24px', textAlign: 'center',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  depotCard: {
    background: '#0B0B0E', border: '1px solid #1A1A22', borderRadius: '16px', padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', transform: 'translateY(0)',
  },
  depotCardHover: {
    transform: 'translateY(-2px)',
    borderColor: '#2A2A35',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 0 1px rgba(212,175,55,0.1)'
  },
  depotHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  investName: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: 0 },
  investEmail: { color: '#636366', fontSize: '13px', margin: '3px 0 0' },
  statut: { fontSize: '11px', fontWeight: '700', padding: '5px 12px', borderRadius: '30px', letterSpacing: '0.3px' },
  depotInfo: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px',
    background: '#101014', padding: '16px', borderRadius: '12px', border: '1px solid #181820'
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { color: '#636366', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
  infoValue: { color: '#E5E5EA', fontSize: '14px', fontWeight: '500' },
  actions: { display: 'flex', gap: '12px' },
  btnValider: {
    background: '#4CAF50', border: 'none', color: '#fff',
    padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  btnRefuser: {
    background: 'transparent', border: '1px solid #FF4444', color: '#FF4444',
    padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  motifBox: {
    marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px',
    background: 'rgba(255,68,68,0.02)', borderRadius: '12px', border: '1px solid rgba(255,68,68,0.15)'
  },
  motifInput: {
    background: '#060608', border: '1px solid #22222A', borderRadius: '8px',
    padding: '12px 16px', color: '#fff', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btnConfirmRefus: {
    background: '#FF4444', border: 'none', color: '#fff',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
  },
  btnAnnuler: {
    background: 'transparent', border: 'none', color: '#8E8E93',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
  }
};
