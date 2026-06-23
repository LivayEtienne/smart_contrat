// PAGE : Score BCX | Route : /pme/score | Auteur : Léonie Gondo
// 📌 API ICI : cherche le commentaire "👉 API ICI"

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

// ---- DONNÉES FICTIVES (supprimer quand l'API est branchée) ----
const SCORE_FICTIF = {
  score_global: 72,
  details: [
    { critere: 'Régularité des transactions', note: 80, poids: '30%', description: 'Vous avez enregistré des transactions régulièrement ce mois-ci.' },
    { critere: 'Équilibre revenus/dépenses', note: 65, poids: '25%', description: 'Vos dépenses représentent 58% de vos revenus. Bon équilibre.' },
    { critere: 'Historique de remboursement', note: 70, poids: '20%', description: 'Aucun crédit impayé enregistré.' },
    { critere: "Volume d'activité", note: 75, poids: '15%', description: 'Volume de transactions satisfaisant pour votre secteur.' },
    { critere: 'Complétude du profil', note: 60, poids: '10%', description: 'Ajoutez votre numéro RCCM pour améliorer ce score.' },
  ],
  historique: [
    { mois: 'Mars', score: 58 },
    { mois: 'Avril', score: 63 },
    { mois: 'Mai', score: 68 },
    { mois: 'Juin', score: 72 },
  ],
  eligibilite_credit: true,
  niveau: 'Intermédiaire',
};
// ---------------------------------------------------------------

const couleurNote = (note) => { if (note >= 75) return '#4CAF50'; if (note >= 50) return '#D4AF37'; return '#FF4444'; };
const labelScore = (s) => {
  if (s >= 80) return { texte: 'Excellent', couleur: '#4CAF50' };
  if (s >= 65) return { texte: 'Bon', couleur: '#D4AF37' };
  if (s >= 50) return { texte: 'Moyen', couleur: '#F5A623' };
  return { texte: 'À améliorer', couleur: '#FF4444' };
};

export default function ScoreBCX() {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        // 👉 API ICI — Décommente quand Parfait envoie la route
        // const token = localStorage.getItem('token');
        // const response = await fetch('http://localhost:3003/api/pme/score', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const data = await response.json();
        // setScore(data);

        // ---- DONNÉES FICTIVES (supprimer quand l'API est branchée) ----
        await new Promise((r) => setTimeout(r, 700));
        setScore(SCORE_FICTIF);
        // ---------------------------------------------------------------
      } catch (err) {
        console.error('Erreur chargement score :', err);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  if (chargement) return <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#D4AF37' }}>Calcul du score en cours...</p></div>;

  const label = labelScore(score.score_global);
  const donneesRadial = [
    { name: 'score', value: score.score_global, fill: label.couleur },
    { name: 'reste', value: 100 - score.score_global, fill: '#1a1a1a' },
  ];

  return (
    <div style={styles.page}>
      <button style={styles.btnRetour} onClick={() => navigate('/pme/dashboard')}>← Retour au tableau de bord</button>
      <h1 style={styles.titre}>Mon Score BCX</h1>
      <p style={styles.sousTitre}>Votre score de crédibilité financière BCX Finance</p>

      {/* SCORE PRINCIPAL */}
      <div style={styles.carteScore}>
        <div style={styles.scoreLayout}>
          <div style={{ width: 180, height: 180, flexShrink: 0, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} data={donneesRadial}>
                <RadialBar dataKey="value" cornerRadius={8} background={false} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={styles.scoreCenter}>
              <span style={{ ...styles.scoreNombre, color: label.couleur }}>{score.score_global}</span>
              <span style={styles.scoreSur}>/100</span>
            </div>
          </div>
          <div style={styles.scoreInfos}>
            <p style={{ ...styles.scoreLabel, color: label.couleur }}>{label.texte}</p>
            <p style={styles.scoreNiveau}>Niveau : <strong style={{ color: '#D4AF37' }}>{score.niveau}</strong></p>
            <div style={score.eligibilite_credit ? styles.badgeEligible : styles.badgeNonEligible}>
              {score.eligibilite_credit ? '✅ Éligible au crédit BCX' : "❌ Non éligible au crédit pour l'instant"}
            </div>
          </div>
        </div>
      </div>

      {/* DÉTAIL PAR CRITÈRE */}
      <h2 style={styles.titreSec}>Détail du score</h2>
      <div style={styles.listeDetails}>
        {score.details.map((d) => (
          <div key={d.critere} style={styles.carteDetail}>
            <div style={styles.detailEntete}>
              <span style={styles.detailNom}>{d.critere}</span>
              <span style={styles.detailPoids}>Poids : {d.poids}</span>
            </div>
            <div style={styles.barreConteneur}>
              <div style={{ ...styles.barrePleine, width: `${d.note}%`, background: couleurNote(d.note) }} />
            </div>
            <div style={styles.detailBas}>
              <span style={{ color: '#555', fontSize: '12px' }}>{d.description}</span>
              <span style={{ color: couleurNote(d.note), fontWeight: '700', fontSize: '14px' }}>{d.note}/100</span>
            </div>
          </div>
        ))}
      </div>

      {/* HISTORIQUE */}
      <h2 style={styles.titreSec}>Évolution du score</h2>
      <div style={styles.historique}>
        {score.historique.map((h, i) => (
          <div key={h.mois} style={styles.histItem}>
            <div style={styles.histBarreConteneur}>
              <div style={{ ...styles.histBarre, height: `${(h.score / 100) * 80}px`, background: i === score.historique.length - 1 ? 'linear-gradient(180deg, #D4AF37, #F5E17A)' : '#2a2a2a' }} />
            </div>
            <span style={styles.histScore}>{h.score}</span>
            <span style={styles.histMois}>{h.mois}</span>
          </div>
        ))}
      </div>

      {/* CONSEILS */}
      <div style={styles.carteConseils}>
        <p style={styles.conseilsTitre}>💡 Comment améliorer votre score ?</p>
        <ul style={styles.conseilsListe}>
          <li>Enregistrez vos transactions tous les jours</li>
          <li>Maintenez un équilibre entre revenus et dépenses</li>
          <li>Complétez votre profil PME (RCCM, etc.)</li>
          <li>Remboursez vos crédits dans les délais</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter', sans-serif", padding: '32px 24px', maxWidth: '720px', margin: '0 auto', boxSizing: 'border-box' },
  btnRetour: { background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '20px', display: 'block' },
  titre: { color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' },
  sousTitre: { color: '#555', fontSize: '14px', margin: '0 0 32px' },
  titreSec: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: '0 0 16px' },
  carteScore: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '32px', marginBottom: '32px' },
  scoreLayout: { display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', position: 'relative' },
  scoreCenter: { position: 'absolute', top: '50%', left: '90px', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  scoreNombre: { fontSize: '36px', fontWeight: '900', display: 'block' },
  scoreSur: { color: '#444', fontSize: '14px' },
  scoreInfos: { flex: 1 },
  scoreLabel: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px' },
  scoreNiveau: { color: '#888', fontSize: '14px', margin: '0 0 16px' },
  badgeEligible: { background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4CAF50', borderRadius: '8px', color: '#4CAF50', display: 'inline-block', fontSize: '13px', padding: '8px 16px' },
  badgeNonEligible: { background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #FF4444', borderRadius: '8px', color: '#FF4444', display: 'inline-block', fontSize: '13px', padding: '8px 16px' },
  listeDetails: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' },
  carteDetail: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '16px' },
  detailEntete: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  detailNom: { color: '#ccc', fontSize: '14px', fontWeight: '500' },
  detailPoids: { color: '#444', fontSize: '12px' },
  barreConteneur: { height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' },
  barrePleine: { height: '100%', borderRadius: '3px', transition: 'width 0.6s ease' },
  detailBas: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  historique: { display: 'flex', gap: '16px', alignItems: 'flex-end', background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '32px' },
  histItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 },
  histBarreConteneur: { height: '80px', display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center' },
  histBarre: { width: '36px', borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease' },
  histScore: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  histMois: { color: '#555', fontSize: '11px' },
  carteConseils: { background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '12px', padding: '24px' },
  conseilsTitre: { color: '#D4AF37', fontSize: '15px', fontWeight: '600', margin: '0 0 12px' },
  conseilsListe: { color: '#888', fontSize: '14px', lineHeight: '2', margin: 0, paddingLeft: '20px' },
};
