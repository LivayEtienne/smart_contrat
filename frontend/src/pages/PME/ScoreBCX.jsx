// PAGE : Score BCX | Route : /pme/score | Auteur : Léonie Gondo
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const couleurNote = (pts, max) => {
  const pct = (pts / max) * 100;
  return pct >= 75 ? '#4CAF50' : pct >= 50 ? '#D4AF37' : '#FF4444';
};

const labelScore = (s) => {
  if (s >= 80) return { texte: 'Excellent', couleur: '#4CAF50' };
  if (s >= 65) return { texte: 'Bon', couleur: '#D4AF37' };
  if (s >= 50) return { texte: 'Moyen', couleur: '#F5A623' };
  return { texte: 'À améliorer', couleur: '#FF4444' };
};

// Convertit l'objet details du backend en tableau affichable
const detailsVersTableau = (details) => [
  { critere: 'Ratio revenus / dépenses', pts: details.ratio,      max: 40, description: 'Santé financière — revenus supérieurs aux dépenses' },
  { critere: 'Régularité',               pts: details.regularite, max: 30, description: 'Activité mensuelle constante sur la durée' },
  { critere: 'Volume traité',            pts: details.volume,     max: 20, description: 'Taille de l\'activité en FCFA' },
  { critere: 'Ancienneté',               pts: details.anciennete, max: 10, description: 'Stabilité dans le temps depuis la création' },
];

const CACHE_KEY = 'pme_score_cache';

export default function ScoreBCX() {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [modeOffline, setModeOffline] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const token = localStorage.getItem('token'); // ← unifié, plus pme_token
        const response = await fetch('http://localhost:3003/api/pme/score', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setScore(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (err) {
        const cache = localStorage.getItem(CACHE_KEY);
        if (cache) { setScore(JSON.parse(cache)); setModeOffline(true); }
        else console.error('Erreur score :', err);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  if (chargement) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#D4AF37', fontFamily: "'Inter',sans-serif" }}>Calcul du score...</p>
    </div>
  );
  if (!score) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#FF4444', fontFamily: "'Inter',sans-serif" }}>Impossible de charger le score.</p>
    </div>
  );

  const label = labelScore(score.score);
  const donneesRadial = [
    { value: score.score, fill: label.couleur },
    { value: 100 - score.score, fill: '#1a1a1a' },
  ];

  // Convertit details (objet) en tableau pour le .map()
  const detailsTableau = score.details ? detailsVersTableau(score.details) : [];

  return (
    <div style={s.page}>
      {modeOffline && (
        <div style={s.banniereOffline}>📡 Mode hors ligne — données depuis le cache local.</div>
      )}

      <button style={s.btnRetour} onClick={() => navigate('/pme/dashboard')}>← Retour</button>
      <p style={s.label}>CRÉDIBILITÉ</p>
      <h1 style={s.titre}>Mon Score BCX</h1>

      {/* SCORE PRINCIPAL */}
      <div style={s.carteScore}>
        <div style={s.scoreLayout}>
          <div style={{ width: 180, height: 180, flexShrink: 0, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} data={donneesRadial}>
                <RadialBar dataKey="value" cornerRadius={8} background={false} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={s.scoreCenter}>
              <span style={{ ...s.scoreNombre, color: label.couleur }}>{score.score}</span>
              <span style={s.scoreSur}>/100</span>
            </div>
          </div>

          <div style={s.scoreInfos}>
            <p style={s.label}>NIVEAU</p>
            <p style={{ ...s.scoreLabel, color: label.couleur }}>{label.texte}</p>
            <p style={{ color: '#555', fontSize: '13px', margin: '4px 0 16px' }}>{score.niveau}</p>
            {/* eligibilite_credit n'existe pas dans le backend — on la calcule côté front */}
            <div style={score.score >= 50 ? s.badgeOk : s.badgeKo}>
              {score.score >= 50 ? '✅ Éligible au crédit BCX' : "❌ Non éligible pour l'instant"}
            </div>
          </div>
        </div>
      </div>

      {/* STATS RAPIDES */}
      {score.stats && (
        <div style={s.statsGrid}>
          {[
            { label: 'Revenus', valeur: score.stats.total_revenus.toLocaleString('fr-FR') + ' FCFA' },
            { label: 'Dépenses', valeur: score.stats.total_depenses.toLocaleString('fr-FR') + ' FCFA' },
            { label: 'Solde', valeur: score.stats.solde.toLocaleString('fr-FR') + ' FCFA' },
            { label: 'Transactions', valeur: score.stats.nb_transactions },
            { label: 'Mois actifs', valeur: score.stats.mois_actifs },
            { label: 'Ancienneté', valeur: score.stats.anciennete_mois + ' mois' },
          ].map(({ label, valeur }) => (
            <div key={label} style={s.statBox}>
              <span style={s.statLabel}>{label}</span>
              <span style={s.statValeur}>{valeur}</span>
            </div>
          ))}
        </div>
      )}

      {/* DÉTAILS PAR CRITÈRE */}
      <p style={s.label}>DÉTAIL</p>
      <h2 style={s.titreSec}>Analyse par critère</h2>
      <div style={s.listeDetails}>
        {detailsTableau.map((d) => (
          <div key={d.critere} style={s.carteDetail}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#ccc', fontSize: '14px', fontWeight: '500' }}>{d.critere}</span>
              <span style={{ color: couleurNote(d.pts, d.max), fontWeight: '700', fontSize: '14px' }}>
                {d.pts} / {d.max} pts
              </span>
            </div>
            <div style={{ height: '4px', background: '#1a1a1a', borderRadius: '2px', marginBottom: '8px' }}>
              <div style={{
                width: `${(d.pts / d.max) * 100}%`,
                height: '100%',
                background: couleurNote(d.pts, d.max),
                borderRadius: '2px',
                transition: 'width 0.6s ease'
              }} />
            </div>
            <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>{d.description}</p>
          </div>
        ))}
      </div>

      {/* CONSEILS */}
      <div style={s.carteConseils}>
        <p style={s.label}>AMÉLIORATION</p>
        <h2 style={s.titreSec}>Comment progresser ?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          {[
            'Enregistrez vos transactions chaque jour',
            'Gardez un solde positif chaque mois',
            'Complétez votre profil PME (RCCM)',
            'Remboursez vos crédits dans les délais',
          ].map((c) => (
            <div key={c} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#D4AF37', fontSize: '14px', marginTop: '1px' }}>→</span>
              <span style={{ color: '#666', fontSize: '14px' }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter', sans-serif", padding: '32px 28px', maxWidth: '720px', margin: '0 auto', boxSizing: 'border-box' },
  banniereOffline: { background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', color: '#F5A623', fontSize: '13px', padding: '12px 16px', marginBottom: '24px', textAlign: 'center' },
  btnRetour: { background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '20px', display: 'block' },
  label: { color: '#D4AF37', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' },
  titre: { color: '#fff', fontSize: '26px', fontWeight: '700', margin: '0 0 24px' },
  titreSec: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: '0 0 16px' },
  carteScore: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 4px 32px rgba(212,175,55,0.06)' },
  scoreLayout: { display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' },
  scoreCenter: { position: 'absolute', top: '50%', left: '90px', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  scoreNombre: { fontSize: '38px', fontWeight: '900', display: 'block' },
  scoreSur: { color: '#333', fontSize: '14px' },
  scoreInfos: { flex: 1 },
  scoreLabel: { fontSize: '30px', fontWeight: '800', margin: '4px 0 0' },
  badgeOk: { background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: '8px', color: '#4CAF50', display: 'inline-block', fontSize: '13px', padding: '8px 16px' },
  badgeKo: { background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: '8px', color: '#FF4444', display: 'inline-block', fontSize: '13px', padding: '8px 16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' },
  statBox: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  statLabel: { color: '#444', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' },
  statValeur: { color: '#fff', fontSize: '15px', fontWeight: '700' },
  listeDetails: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' },
  carteDetail: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' },
  carteConseils: { background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)', borderLeft: '3px solid #D4AF37', borderRadius: '12px', padding: '24px', marginBottom: '32px' },
};