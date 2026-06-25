import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BoutonPrimaire from '../components/BoutonPrimaire';
import BoutonSecondaire from '../components/BoutonSecondaire';
import BadgeStatut from '../components/BadgeStatut';
import AlerteErreur from '../components/AlerteErreur';

const formaterMontant = (n) => n?.toLocaleString('fr-FR') || '0';
const CACHE_KEY = 'pme_rapport_cache';

const MOIS = [
  { value: '01', label: 'Janvier' }, { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' }, { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' }, { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' }, { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' }, { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' }, { value: '12', label: 'Décembre' },
];

export default function RapportMensuel() {
  const navigate = useNavigate();
  const now = new Date();
  const [mois, setMois] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [annee, setAnnee] = useState(String(now.getFullYear()));
  const [rapport, setRapport] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [modeOffline, setModeOffline] = useState(false);

  const chargerRapport = async () => {
    setChargement(true);
    setErreur('');
    try {
      const token = localStorage.getItem('pme_token');
      const response = await fetch(`http://localhost:3003/api/pme/dashboard?mois=${mois}&annee=${annee}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur serveur');
      setRapport(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, mois, annee }));
    } catch (err) {
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) {
        const parsed = JSON.parse(cache);
        setRapport(parsed.data);
        setModeOffline(true);
      } else {
        setErreur(err.message || 'Impossible de charger le rapport.');
      }
    } finally {
      setChargement(false);
    }
  };

  const exporterPDF = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('pme_token');
      const response = await fetch(`http://localhost:3003/api/pme/rapport-pdf?mois=${mois}&annee=${annee}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la génération du PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_bcx_${mois}_${annee}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErreur(err.message || 'Impossible de générer le PDF.');
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => { chargerRapport(); }, []);

  const transactions = rapport?.transactions || [];
  const resume = rapport?.resume || {};
  const nomMois = MOIS.find((m) => m.value === mois)?.label || '';

  return (
    <div style={s.page}>
      {modeOffline && <div style={s.banniereOffline}>📡 Mode hors ligne — données depuis le cache local.</div>}

      <div style={s.entete}>
        <div>
          <button style={s.btnRetour} onClick={() => navigate('/pme/dashboard')}>← Retour</button>
          <p style={s.label}>RAPPORT</p>
          <h1 style={s.titre}>Rapport mensuel</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={s.filtre}>
            <label style={s.filtreLabel}>Mois</label>
            <select style={s.filtreSelect} value={mois} onChange={(e) => setMois(e.target.value)}>
              {MOIS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div style={s.filtre}>
            <label style={s.filtreLabel}>Année</label>
            <select style={s.filtreSelect} value={annee} onChange={(e) => setAnnee(e.target.value)}>
              {['2024', '2025', '2026'].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <BoutonSecondaire label="🔄 Actualiser" onClick={chargerRapport} disabled={chargement} />
        </div>
      </div>

      <AlerteErreur message={erreur} />

      <div style={s.resumeCard}>
        <p style={s.label}>{nomMois} {annee}</p>
        <div style={s.resumeGrille}>
          <div style={s.resumeItem}>
            <p style={s.resumeItemLabel}>Total revenus</p>
            <p style={{ ...s.resumeItemVal, color: '#4CAF50' }}>+{formaterMontant(resume.total_revenus)} FCFA</p>
          </div>
          <div style={s.resumeSep} />
          <div style={s.resumeItem}>
            <p style={s.resumeItemLabel}>Total dépenses</p>
            <p style={{ ...s.resumeItemVal, color: '#FF4444' }}>-{formaterMontant(resume.total_depenses)} FCFA</p>
          </div>
          <div style={s.resumeSep} />
          <div style={s.resumeItem}>
            <p style={s.resumeItemLabel}>Solde net</p>
            <p style={{ ...s.resumeItemVal, color: '#D4AF37' }}>{formaterMontant(resume.solde)} FCFA</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={s.label}>TRANSACTIONS</p>
          <h2 style={s.titreSec}>Liste du mois ({transactions.length})</h2>
        </div>
        <BoutonPrimaire label={exportLoading ? '⏳ Génération...' : '📥 Exporter PDF'} onClick={exporterPDF} loading={exportLoading} disabled={modeOffline || transactions.length === 0} fullWidth={false} />
      </div>

      {chargement ? (
        <div style={s.chargement}><p style={{ color: '#D4AF37' }}>Chargement...</p></div>
      ) : transactions.length === 0 ? (
        <div style={s.vide}>
          <p style={{ color: '#333', fontSize: '32px', margin: '0 0 12px' }}>📋</p>
          <p style={{ color: '#555', fontSize: '14px' }}>Aucune transaction pour {nomMois} {annee}</p>
          <button onClick={() => navigate('/pme/nouvelle-transaction')} style={{ background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#D4AF37', cursor: 'pointer', fontSize: '13px', marginTop: '16px', padding: '10px 20px' }}>
            + Saisir une transaction
          </button>
        </div>
      ) : (
        <div style={s.tableau}>
          <div style={s.tableauHeader}>
            <span style={{ flex: 2 }}>Description</span>
            <span style={{ flex: 1, textAlign: 'center' }}>Type</span>
            <span style={{ flex: 1, textAlign: 'right' }}>Montant</span>
            <span style={{ flex: 1, textAlign: 'right' }}>Date</span>
          </div>
          {transactions.map((t, i) => (
            <div key={t.id || i} style={{ ...s.ligne, background: i % 2 === 0 ? '#111' : '#0f0f0f' }}>
              <span style={{ flex: 2, color: '#ccc', fontSize: '14px' }}>{t.description}</span>
              <span style={{ flex: 1, textAlign: 'center' }}><BadgeStatut statut={t.type} /></span>
              <span style={{ flex: 1, textAlign: 'right', color: t.type === 'revenu' ? '#4CAF50' : '#FF4444', fontWeight: '700', fontSize: '14px' }}>
                {t.type === 'revenu' ? '+' : '-'}{formaterMontant(t.montant)}
              </span>
              <span style={{ flex: 1, textAlign: 'right', color: '#444', fontSize: '12px' }}>
                {new Date(t.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter', sans-serif", padding: '32px 28px', maxWidth: '960px', margin: '0 auto', boxSizing: 'border-box' },
  banniereOffline: { background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', color: '#F5A623', fontSize: '13px', padding: '12px 16px', marginBottom: '24px', textAlign: 'center' },
  entete: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' },
  btnRetour: { background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '8px', display: 'block' },
  label: { color: '#D4AF37', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' },
  titre: { color: '#fff', fontSize: '26px', fontWeight: '700', margin: 0 },
  titreSec: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: 0 },
  filtre: { display: 'flex', flexDirection: 'column', gap: '6px' },
  filtreLabel: { color: '#555', fontSize: '11px', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' },
  filtreSelect: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', color: '#fff', fontSize: '13px', padding: '10px 14px', outline: 'none', cursor: 'pointer' },
  resumeCard: { background: '#111', border: '1px solid #1a1a1a', borderLeft: '3px solid #D4AF37', borderRadius: '14px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 24px rgba(212,175,55,0.06)' },
  resumeGrille: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0', marginTop: '16px' },
  resumeItem: { flex: 1, minWidth: '120px', textAlign: 'center', padding: '8px' },
  resumeItemLabel: { color: '#555', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' },
  resumeItemVal: { fontSize: '22px', fontWeight: '800', margin: 0 },
  resumeSep: { width: '1px', height: '40px', background: '#1a1a1a' },
  tableau: { border: '1px solid #1a1a1a', borderRadius: '14px', overflow: 'hidden' },
  tableauHeader: { display: 'flex', padding: '12px 20px', background: '#0d0d0d', color: '#444', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a' },
  ligne: { display: 'flex', alignItems: 'center', padding: '16px 20px', gap: '8px' },
  chargement: { display: 'flex', justifyContent: 'center', padding: '48px' },
  vide: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px', background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px' },
};
