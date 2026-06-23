// PAGE : Dashboard PME | Route : /pme/dashboard | Auteur : Léonie Gondo
// 📌 API ICI : cherche les commentaires "👉 API ICI" (il y en a 2)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ---- DONNÉES FICTIVES (supprimer quand l'API est branchée) ----
const DONNEES_FICTIVES = {
  pme: { nom: 'Boutique Soleil', secteur: 'Commerce', statut: 'actif' },
  compte: { solde: 1_850_000, total_revenus: 3_200_000, total_depenses: 1_350_000, score_bcx: 72 },
  graphique: [
    { mois: 'Jan', revenus: 400000, depenses: 180000 },
    { mois: 'Fév', revenus: 520000, depenses: 210000 },
    { mois: 'Mar', revenus: 390000, depenses: 160000 },
    { mois: 'Avr', revenus: 680000, depenses: 250000 },
    { mois: 'Mai', revenus: 710000, depenses: 300000 },
    { mois: 'Juin', revenus: 500000, depenses: 250000 },
  ],
  dernieres_transactions: [
    { id: 1, type: 'entree', description: 'Vente marchandises', montant: 150000, date: '2026-06-20' },
    { id: 2, type: 'sortie', description: 'Achat stock', montant: 80000, date: '2026-06-19' },
    { id: 3, type: 'entree', description: 'Prestation client', montant: 200000, date: '2026-06-18' },
    { id: 4, type: 'sortie', description: 'Loyer boutique', montant: 120000, date: '2026-06-15' },
  ],
};
// ---------------------------------------------------------------

const formaterMontant = (n) => n?.toLocaleString('fr-FR') || '0';

const TooltipPersonnalise = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 16px', fontSize: '13px' }}>
      <p style={{ color: '#888', margin: '0 0 6px' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
          {p.name === 'revenus' ? '📈 Revenus' : '📉 Dépenses'} : {formaterMontant(p.value)} FCFA
        </p>
      ))}
    </div>
  );
};

export default function DashboardPME() {
  const navigate = useNavigate();
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        // 👉 API ICI (1/2) — Récupérer les infos du compte PME
        // const token = localStorage.getItem('token');
        // const response = await fetch('http://localhost:3003/api/pme/dashboard', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const data = await response.json();
        // setDonnees(data);

        // ---- DONNÉES FICTIVES (supprimer quand l'API est branchée) ----
        await new Promise((r) => setTimeout(r, 800));
        setDonnees(DONNEES_FICTIVES);
        // ---------------------------------------------------------------
      } catch (err) {
        console.error('Erreur chargement dashboard :', err);
      } finally {
        setChargement(false);
      }
    };
    chargerDonnees();
  }, []);

  if (chargement) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#D4AF37' }}>Chargement du tableau de bord...</p>
      </div>
    );
  }

  const { pme, compte, graphique, dernieres_transactions } = donnees;

  return (
    <div style={styles.page}>
      {/* EN-TÊTE */}
      <div style={styles.entete}>
        <div>
          <h1 style={styles.titreEntete}>Bonjour, <span style={{ color: '#D4AF37' }}>{pme.nom}</span> 👋</h1>
          <p style={styles.sousTitre}>Secteur : {pme.secteur} — Statut : <span style={{ color: '#4CAF50' }}>{pme.statut}</span></p>
        </div>
        <button style={styles.btnAction} onClick={() => navigate('/pme/nouvelle-transaction')}>
          + Nouvelle transaction
        </button>
      </div>

      {/* 3 CARTES DE STATS */}
      <div style={styles.grille3}>
        <div style={styles.carte}>
          <p style={styles.carteLabel}>💰 Solde actuel</p>
          <p style={styles.carteValeur}>{formaterMontant(compte.solde)}</p>
          <p style={styles.carteUnite}>FCFA</p>
        </div>
        <div style={{ ...styles.carte, borderColor: '#4CAF5033' }}>
          <p style={styles.carteLabel}>📈 Total revenus</p>
          <p style={{ ...styles.carteValeur, color: '#4CAF50' }}>{formaterMontant(compte.total_revenus)}</p>
          <p style={styles.carteUnite}>FCFA</p>
        </div>
        <div style={{ ...styles.carte, borderColor: '#FF444433' }}>
          <p style={styles.carteLabel}>📉 Total dépenses</p>
          <p style={{ ...styles.carteValeur, color: '#FF4444' }}>{formaterMontant(compte.total_depenses)}</p>
          <p style={styles.carteUnite}>FCFA</p>
        </div>
      </div>

      {/* GRAPHIQUE */}
      <div style={styles.section}>
        <h2 style={styles.titreSec}>Évolution sur 6 mois</h2>
        <div style={styles.carteGraphe}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={graphique} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDepense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1a1a1a" />
              <XAxis dataKey="mois" stroke="#444" tick={{ fill: '#666', fontSize: 12 }} />
              <YAxis stroke="#444" tick={{ fill: '#666', fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
              <Tooltip content={<TooltipPersonnalise />} />
              <Area type="monotone" dataKey="revenus" stroke="#D4AF37" strokeWidth={2} fill="url(#gradRevenu)" name="revenus" />
              <Area type="monotone" dataKey="depenses" stroke="#FF4444" strokeWidth={2} fill="url(#gradDepense)" name="depenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SCORE BCX + ACTIONS */}
      <div style={styles.grille2}>
        <div style={styles.carteScore}>
          <p style={styles.carteLabel}>🏆 Score BCX</p>
          <div style={styles.scoreAnneau}>
            <span style={styles.scoreNombre}>{compte.score_bcx}</span>
            <span style={styles.scoreSur}>/100</span>
          </div>
          <div style={styles.barreConteneur}>
            <div style={{ ...styles.barrePleine, width: `${compte.score_bcx}%` }} />
          </div>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
            {compte.score_bcx >= 70 ? '✅ Bon score — éligible au crédit' : '⚠️ Score à améliorer'}
          </p>
          <button style={styles.btnLien} onClick={() => navigate('/pme/score')}>Voir le détail →</button>
        </div>
        <div style={styles.carteActions}>
          <p style={styles.carteLabel}>Actions rapides</p>
          <div style={styles.listeActions}>
            <button style={styles.btnAction2} onClick={() => navigate('/pme/nouvelle-transaction')}>💳 Saisir une transaction</button>
            <button style={styles.btnAction2} onClick={() => navigate('/pme/rapport')}>📄 Voir le rapport mensuel</button>
            <button style={styles.btnAction2} onClick={() => navigate('/pme/score')}>🏆 Mon Score BCX</button>
          </div>
        </div>
      </div>

      {/* DERNIÈRES TRANSACTIONS */}
      <div style={styles.section}>
        <div style={styles.enteteSection}>
          <h2 style={styles.titreSec}>Dernières transactions</h2>
          <button style={styles.btnLien} onClick={() => navigate('/pme/rapport')}>Voir tout →</button>
        </div>
        <div style={styles.tableau}>
          {dernieres_transactions.map((t) => (
            <div key={t.id} style={styles.ligne}>
              <span style={t.type === 'entree' ? styles.badgeEntree : styles.badgeSortie}>{t.type === 'entree' ? '▲' : '▼'}</span>
              <span style={{ color: '#ccc', flex: 1, fontSize: '14px' }}>{t.description}</span>
              <span style={{ color: t.type === 'entree' ? '#4CAF50' : '#FF4444', fontWeight: '600', fontSize: '14px' }}>
                {t.type === 'entree' ? '+' : '-'}{formaterMontant(t.montant)} FCFA
              </span>
              <span style={{ color: '#444', fontSize: '12px', minWidth: '80px', textAlign: 'right' }}>
                {new Date(t.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter', sans-serif", padding: '32px 24px', maxWidth: '960px', margin: '0 auto', boxSizing: 'border-box' },
  entete: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' },
  titreEntete: { color: '#fff', fontSize: '24px', fontWeight: '700', margin: 0 },
  sousTitre: { color: '#555', fontSize: '14px', marginTop: '6px' },
  btnAction: { background: 'linear-gradient(135deg, #D4AF37, #F5E17A)', border: 'none', borderRadius: '8px', color: '#0A0A0A', cursor: 'pointer', fontSize: '14px', fontWeight: '700', padding: '12px 20px', whiteSpace: 'nowrap' },
  grille3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
  grille2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' },
  carte: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' },
  carteLabel: { color: '#555', fontSize: '12px', letterSpacing: '1px', margin: '0 0 12px' },
  carteValeur: { color: '#fff', fontSize: '26px', fontWeight: '700', margin: 0 },
  carteUnite: { color: '#444', fontSize: '12px', marginTop: '4px' },
  section: { marginBottom: '32px' },
  titreSec: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: '0 0 16px' },
  carteGraphe: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' },
  carteScore: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' },
  scoreAnneau: { display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' },
  scoreNombre: { color: '#D4AF37', fontSize: '48px', fontWeight: '800' },
  scoreSur: { color: '#444', fontSize: '18px' },
  barreConteneur: { height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' },
  barrePleine: { height: '100%', background: 'linear-gradient(90deg, #D4AF37, #F5E17A)', borderRadius: '3px', transition: 'width 0.6s ease' },
  btnLien: { background: 'transparent', border: 'none', color: '#D4AF37', cursor: 'pointer', fontSize: '13px', padding: '8px 0' },
  carteActions: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' },
  listeActions: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' },
  btnAction2: { background: '#0A0A0A', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#ccc', cursor: 'pointer', fontSize: '14px', padding: '12px 16px', textAlign: 'left' },
  enteteSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  tableau: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' },
  ligne: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #0f0f0f' },
  badgeEntree: { color: '#4CAF50', fontSize: '14px', fontWeight: '700', minWidth: '20px', textAlign: 'center' },
  badgeSortie: { color: '#FF4444', fontSize: '14px', fontWeight: '700', minWidth: '20px', textAlign: 'center' },
};
