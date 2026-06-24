import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { depotService } from '../services/api';

export default function MesDepots() {
  const navigate = useNavigate();
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('');

  useEffect(() => {
    const fetchDepots = async () => {
      try {
        const res = await depotService.mesDepots();
        setDepots(res.data);
      } catch (err) {
        console.error('Erreur chargement dépôts :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepots();
  }, []);

  const statutColor = { en_attente: '#F5A623', valide: '#4CAF50', refuse: '#FF4444' };
  const statutLabel = { en_attente: 'En attente', valide: 'Validé', refuse: 'Refusé' };
  const statutBg = {
    en_attente: 'rgba(245,166,35,0.08)',
    valide: 'rgba(76,175,80,0.08)',
    refuse: 'rgba(255,68,68,0.08)',
  };

  const depotsFiltres = filtre
    ? depots.filter((d) => d.statut === filtre)
    : depots;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#060608' }}>
      <p style={{ color: '#D4AF37', fontWeight: '500' }}>Chargement des dépôts...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.content}>

        {/* HEADER */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Mes dépôts</h1>
            <p style={styles.sub}>Historique complet de vos dépôts et leur statut de validation</p>
          </div>
          <button style={styles.newDepotBtn} onClick={() => navigate('/depot/nouveau')}>
            + Nouveau dépôt
          </button>
        </div>

        {/* FILTRES */}
        <div style={styles.filtres}>
          {[
            { key: '', label: 'Tous' },
            { key: 'en_attente', label: 'En attente' },
            { key: 'valide', label: 'Validés' },
            { key: 'refuse', label: 'Refusés' },
          ].map((f) => (
            <button
              key={f.key}
              style={filtre === f.key ? styles.filtreActive : styles.filtre}
              onClick={() => setFiltre(f.key)}
            >
              {f.label}
              {f.key === '' && <span style={styles.badge}>{depots.length}</span>}
              {f.key === 'en_attente' && <span style={styles.badge}>{depots.filter(d => d.statut === 'en_attente').length}</span>}
              {f.key === 'valide' && <span style={styles.badge}>{depots.filter(d => d.statut === 'valide').length}</span>}
              {f.key === 'refuse' && <span style={styles.badge}>{depots.filter(d => d.statut === 'refuse').length}</span>}
            </button>
          ))}
        </div>

        {/* LISTE */}
        {depotsFiltres.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '15px', color: '#fff', marginBottom: '6px', fontWeight: '500' }}>
              Aucun dépôt trouvé
            </p>
            <p style={{ color: '#636366', margin: 0, fontSize: '13px' }}>
              {filtre ? 'Aucun dépôt avec ce statut.' : 'Soumettez votre premier dépôt pour rejoindre le Cercle.'}
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {depotsFiltres.map((d, index) => (
              <div
                key={d.id}
                style={{
                  ...styles.depotCard,
                  animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                }}
              >
                <div style={styles.depotHeader}>
                  <div style={styles.depotMainInfo}>
                    <p style={styles.depotMontant}>
                      {d.montant?.toLocaleString()} <span style={styles.depotDevise}>{d.devise_origine}</span>
                    </p>
                    <span style={{
                      fontSize: '11px', fontWeight: '700',
                      padding: '4px 12px', borderRadius: '20px',
                      color: statutColor[d.statut],
                      background: statutBg[d.statut],
                      border: `1px solid ${statutColor[d.statut]}22`,
                    }}>
                      {statutLabel[d.statut]}
                    </span>
                  </div>
                </div>

                <div style={styles.depotDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>ÉQUIVALENT USD</span>
                    <span style={{ ...styles.detailValue, color: '#D4AF37', fontWeight: '700' }}>
                      $ {d.montant_usd?.toLocaleString() || '—'}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>VOIE</span>
                    <span style={styles.detailValue}>
                      Voie {d.voie} — {d.voie === 'A' ? 'FCFA / Mobile Money' : 'Crypto'}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>MOYEN</span>
                    <span style={styles.detailValue}>{d.moyen_paiement || '—'}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>DATE</span>
                    <span style={styles.detailValue}>
                      {new Date(d.date_depot).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {d.tx_hash && (
                  <div style={styles.txHashRow}>
                    <span style={styles.detailLabel}>TX HASH</span>
                    <span style={styles.txHash}>{d.tx_hash}</span>
                  </div>
                )}

                {d.statut === 'refuse' && d.motif_refus && (
                  <div style={styles.motifRefus}>
                    <span style={{ fontSize: '11px', color: '#FF4444', fontWeight: '600' }}>MOTIF DU REFUS</span>
                    <p style={{ color: '#ccc', fontSize: '13px', margin: '6px 0 0' }}>{d.motif_refus}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: { width: '100%', margin: 0, padding: '0 32px 32px 32px', boxSizing: 'border-box' },
  content: { width: '100%', margin: 0, padding: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '28px', width: '100%',
  },
  title: { color: '#fff', fontSize: '26px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' },
  sub: { color: '#636366', fontSize: '14px', margin: 0 },
  newDepotBtn: {
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A)',
    color: '#0A0A0A', border: 'none', borderRadius: '8px',
    padding: '12px 24px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', letterSpacing: '0.5px', flexShrink: 0,
  },
  filtres: { display: 'flex', gap: '10px', marginBottom: '24px' },
  filtre: {
    background: '#101014', border: '1px solid #1F1F27', color: '#8E8E93',
    padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px',
    fontWeight: '500', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '8px',
  },
  filtreActive: {
    background: 'rgba(212,175,55,0.06)', border: '1px solid #D4AF37', color: '#D4AF37',
    padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px',
    fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
  },
  badge: {
    background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '12px',
    fontSize: '11px', fontWeight: '700',
  },
  empty: {
    background: '#0B0B0E', border: '1px solid #141419', borderRadius: '16px',
    padding: '60px 24px', textAlign: 'center',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  depotCard: {
    background: '#0B0B0E', border: '1px solid #1A1A22', borderRadius: '16px',
    padding: '24px', transition: 'all 0.3s ease',
  },
  depotHeader: { marginBottom: '16px' },
  depotMainInfo: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  depotMontant: {
    color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0,
  },
  depotDevise: {
    color: '#636366', fontSize: '14px', fontWeight: '500', marginLeft: '4px',
  },
  depotDetails: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
    background: '#101014', padding: '16px', borderRadius: '12px',
    border: '1px solid #181820',
  },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: {
    color: '#636366', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  detailValue: { color: '#E5E5EA', fontSize: '14px', fontWeight: '500' },
  txHashRow: {
    marginTop: '12px', padding: '12px 16px', background: '#101014',
    borderRadius: '8px', border: '1px solid #181820',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  txHash: {
    color: '#8E8E93', fontSize: '12px', fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  motifRefus: {
    marginTop: '12px', padding: '12px 16px',
    background: 'rgba(255,68,68,0.04)', borderRadius: '8px',
    border: '1px solid rgba(255,68,68,0.15)',
  },
};
