import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { depotService } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [compte, setCompte] = useState(null);
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compteRes, depotsRes] = await Promise.all([
          depotService.monCompte(),
          depotService.mesDepots(),
        ]);
        setCompte(compteRes.data);
        setDepots(depotsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const niveauColor = {
    Pionnier: '#C0C0C0',
    Elite: '#D4AF37',
    Majeur: '#F5E17A',
  };

  const statutColor = {
    en_attente: '#F5A623',
    valide: '#4CAF50',
    refuse: '#FF4444',
  };

  if (loading) return (
    <div style={{ ...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: '#D4AF37' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <img src="/logo.jpeg" alt="BCX Finance" style={{ height: 36, objectFit: 'contain' }} />
        <div style={styles.navRight}>
          <span style={styles.navUser}>{user.prenom} {user.nom}</span>
          <button style={styles.profilBtn} onClick={() => navigate('/profil')}>
            Mon profil
          </button>
          <button style={styles.logoutBtn} onClick={logout}>Déconnexion</button>
        </div>
      </nav>

      <div style={styles.content}>

        {/* NIVEAU BADGE */}
        {compte?.investisseur?.niveau && (
          <div style={styles.nivBadge}>
            <span style={{ color: niveauColor[compte.investisseur.niveau] }}>
              ◆ Niveau {compte.investisseur.niveau}
            </span>
          </div>
        )}

        {/* STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total investi</p>
            <p style={styles.statValue}>
              ${compte?.compte?.total_investi_usd?.toLocaleString() || 0}
              <span style={styles.statUnit}>USD</span>
            </p>
          </div>
          <div style={{ ...styles.statCard, borderColor: '#D4AF37' }}>
            <p style={styles.statLabel}>BCX Tokens</p>
            <p style={{ ...styles.statValue, color: '#D4AF37' }}>
              {compte?.compte?.total_bcx_tokens?.toLocaleString() || 0}
              <span style={styles.statUnit}>BCX</span>
            </p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Dépôts</p>
            <p style={styles.statValue}>{depots.length}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div style={styles.actionsRow}>
          <button style={styles.newDepotBtn} onClick={() => navigate('/depot/nouveau')}>
            + Nouveau dépôt
          </button>
          <button style={styles.ayantsDroitBtn} onClick={() => navigate('/ayants-droit')}>
            👥 Mes ayants droit
          </button>
        </div>

        {/* LISTE DÉPÔTS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Mes dépôts</h2>
          {depots.length === 0 ? (
            <div style={styles.empty}>
              <p>Aucun dépôt pour l'instant.</p>
              <p style={{ color: '#555', fontSize: '13px' }}>
                Soumettez votre premier dépôt pour rejoindre le Cercle.
              </p>
            </div>
          ) : (
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <span>Montant</span>
                <span>Devise</span>
                <span>Voie</span>
                <span>Statut</span>
                <span>Date</span>
              </div>
              {depots.map((d) => (
                <div key={d.id} style={styles.tableRow}>
                  <span style={{ fontWeight: 600 }}>{d.montant.toLocaleString()}</span>
                  <span style={{ color: '#888' }}>{d.devise_origine}</span>
                  <span>Voie {d.voie}</span>
                  <span style={{ color: statutColor[d.statut], fontWeight: 600 }}>
                    {d.statut.replace('_', ' ')}
                  </span>
                  <span style={{ color: '#555', fontSize: '12px' }}>
                    {new Date(d.date_depot).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter', sans-serif" },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 32px', borderBottom: '1px solid #1a1a1a', background: '#0D0D0D',
  },
  navLogo: { fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '2px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  navUser: { color: '#888', fontSize: '14px' },
  profilBtn: {
    background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid #2a2a2a', color: '#888',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
  },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  nivBadge: {
    display: 'inline-block', background: '#111', border: '1px solid #2a2a2a',
    borderRadius: '20px', padding: '6px 16px', marginBottom: '24px', fontSize: '13px',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
    padding: '24px', transition: 'border-color 0.2s',
  },
  statLabel: { color: '#555', fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' },
  statValue: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: 0 },
  statUnit: { fontSize: '13px', color: '#555', marginLeft: '6px', fontWeight: '400' },
  actionsRow: { display: 'flex', gap: '12px', marginBottom: '32px' },
  newDepotBtn: {
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A)',
    color: '#0A0A0A', border: 'none', borderRadius: '8px',
    padding: '12px 24px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', letterSpacing: '0.5px',
  },
  ayantsDroitBtn: {
    background: 'transparent', border: '1px solid #2a2a2a', color: '#888',
    borderRadius: '8px', padding: '12px 24px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  section: {},
  sectionTitle: { color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '16px' },
  empty: {
    background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px',
    padding: '40px', textAlign: 'center', color: '#555',
  },
  table: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    padding: '12px 20px', borderBottom: '1px solid #1a1a1a',
    color: '#555', fontSize: '12px', letterSpacing: '1px',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    padding: '16px 20px', borderBottom: '1px solid #0f0f0f',
    color: '#ccc', fontSize: '14px', alignItems: 'center',
  },
};