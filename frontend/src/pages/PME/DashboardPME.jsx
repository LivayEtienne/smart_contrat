// PAGE : Dashboard PME | Route : /pme/dashboard | Auteur : Léonie Gondo
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CarteStats from '../../components/PME/CarteStats';
import BoutonPrimaire from '../../components/PME/BoutonPrimaire';
import BadgeStatut from '../../components/PME/BadgeStatut';

const formaterMontant = (n) => n?.toLocaleString('fr-FR') || '0';

const TooltipPersonnalise = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111', border: '1px solid #222', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ color: '#888', margin: '0 0 8px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: '4px 0', fontWeight: '600' }}>
          {p.name === 'revenus' ? '▲ Revenus' : '▼ Dépenses'} : {formaterMontant(p.value)} FCFA
        </p>
      ))}
    </div>
  );
};

// MODE OFFLINE — clé localStorage
const CACHE_KEY = 'pme_dashboard_cache';

export default function DashboardPME() {
  const navigate = useNavigate();
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [estEnLigne, setEstEnLigne] = useState(navigator.onLine);
  const [modeOffline, setModeOffline] = useState(false);

  useEffect(() => {
    const goOnline = () => { setEstEnLigne(true); setModeOffline(false); chargerDonnees(); };
    const goOffline = () => { setEstEnLigne(false); setModeOffline(true); };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  const chargerDonnees = async () => {
    try {
      const token = localStorage.getItem('pme_token');
      const response = await fetch('http://localhost:3003/api/pme/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setDonnees(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      // Mode offline : charger depuis le cache
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) { setDonnees(JSON.parse(cache)); setModeOffline(true); }
      else console.error('Erreur dashboard :', err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { chargerDonnees(); }, []);

  if (chargement) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#D4AF37', fontFamily: "'Inter', sans-serif" }}>Chargement...</p>
    </div>
  );

  if (!donnees) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#FF4444', fontFamily: "'Inter', sans-serif" }}>Impossible de charger les données.</p>
    </div>
  );

  const { pme, resume, transactions = [] } = donnees;
  const graphique = transactions.slice(0, 6).map((t, i) => ({
    mois: new Date(t.date).toLocaleDateString('fr-FR', { month: 'short' }),
    revenus: t.type === 'revenu' ? t.montant : 0,
    depenses: t.type === 'depense' ? t.montant : 0,
  }));

  return (
    <div style={s.page}>
      {/* BANNIÈRE OFFLINE */}
      {modeOffline && (
        <div style={s.banniereOffline}>
          📡 Mode hors ligne — données depuis le cache local. Les actions sont désactivées.
        </div>
      )}

      {/* EN-TÊTE */}
      <div style={s.entete}>
        <div>
          <p style={s.label}>TABLEAU DE BORD</p>
          <h1 style={s.titreEntete}>Bonjour, <span style={{ color: '#D4AF37' }}>{pme?.nom || 'PME'}</span> 👋</h1>
          <p style={s.sousTitre}>{pme?.secteur} · Statut <span style={{ color: '#4CAF50' }}>{pme?.statut || 'actif'}</span></p>
        </div>
        <BoutonPrimaire label="+ Nouvelle transaction" onClick={() => navigate('/pme/nouvelle-transaction')} disabled={modeOffline} fullWidth={false} />
      </div>

      {/* 3 CARTES STATS */}
      <div style={s.grille3}>
        <CarteStats label="Solde actuel" valeur={formaterMontant(resume?.solde)} unite="FCFA" accent="#D4AF37" />
        <CarteStats label="Total revenus" valeur={formaterMontant(resume?.total_revenus)} unite="FCFA" couleurValeur="#4CAF50" accent="#4CAF50" />
        <CarteStats label="Total dépenses" valeur={formaterMontant(resume?.total_depenses)} unite="FCFA" couleurValeur="#FF4444" accent="#FF4444" />
      </div>

      {/* GRAPHIQUE */}
      <div style={s.section}>
        <p style={s.sectionLabel}>ÉVOLUTION</p>
        <h2 style={s.sectionTitre}>Revenus & Dépenses</h2>
        <div style={s.carteGraphe}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={graphique} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#151515" />
              <XAxis dataKey="mois" stroke="#333" tick={{ fill: '#555', fontSize: 11 }} />
              <YAxis stroke="#333" tick={{ fill: '#555', fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip content={<TooltipPersonnalise />} />
              <Area type="monotone" dataKey="revenus" stroke="#D4AF37" strokeWidth={2} fill="url(#gR)" />
              <Area type="monotone" dataKey="depenses" stroke="#FF4444" strokeWidth={2} fill="url(#gD)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIONS RAPIDES + SCORE */}
      <div style={s.grille2}>
        <div style={s.carte}>
          <p style={s.sectionLabel}>ACTIONS RAPIDES</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {[
              { icon: '💳', label: 'Saisir une transaction', route: '/pme/nouvelle-transaction' },
              { icon: '📄', label: 'Rapport mensuel', route: '/pme/rapport' },
              { icon: '🏆', label: 'Mon Score BCX', route: '/pme/score' },
            ].map((a) => (
              <button key={a.route} onClick={() => navigate(a.route)} disabled={modeOffline && a.route !== '/pme/score'} style={s.btnAction}>
                <span>{a.icon}</span>
                <span>{a.label}</span>
                <span style={{ marginLeft: 'auto', color: '#333' }}>→</span>
              </button>
            ))}
          </div>
        </div>
        <div style={s.carte}>
          <p style={s.sectionLabel}>SCORE BCX</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '16px 0 8px' }}>
            <span style={{ color: '#D4AF37', fontSize: '52px', fontWeight: '900', lineHeight: 1 }}>72</span>
            <span style={{ color: '#333', fontSize: '18px' }}>/100</span>
          </div>
          <div style={{ height: '4px', background: '#1a1a1a', borderRadius: '2px', marginBottom: '12px' }}>
            <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #D4AF37, #F5E17A)', borderRadius: '2px' }} />
          </div>
          <p style={{ color: '#555', fontSize: '12px', margin: '0 0 16px' }}>✅ Éligible au crédit BCX</p>
          <button onClick={() => navigate('/pme/score')} style={{ background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#D4AF37', cursor: 'pointer', fontSize: '13px', padding: '10px 16px', width: '100%' }}>
            Voir le détail complet →
          </button>
        </div>
      </div>

      {/* DERNIÈRES TRANSACTIONS */}
      <div style={s.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <p style={s.sectionLabel}>HISTORIQUE</p>
            <h2 style={s.sectionTitre}>Dernières transactions</h2>
          </div>
          <button onClick={() => navigate('/pme/rapport')} style={{ background: 'transparent', border: 'none', color: '#D4AF37', cursor: 'pointer', fontSize: '13px' }}>Voir tout →</button>
        </div>
        <div style={s.tableau}>
          {transactions.slice(0, 5).map((t, i) => (
            <div key={t.id || i} style={{ ...s.ligne, borderBottom: i < 4 ? '1px solid #0f0f0f' : 'none' }}>
              <BadgeStatut statut={t.type} />
              <span style={{ color: '#ccc', flex: 1, fontSize: '14px', marginLeft: '12px' }}>{t.description}</span>
              <span style={{ color: t.type === 'revenu' ? '#4CAF50' : '#FF4444', fontWeight: '700', fontSize: '14px' }}>
                {t.type === 'revenu' ? '+' : '-'}{formaterMontant(t.montant)} FCFA
              </span>
              <span style={{ color: '#333', fontSize: '11px', minWidth: '70px', textAlign: 'right', marginLeft: '12px' }}>
                {new Date(t.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter', sans-serif", padding: '32px 28px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' },
  banniereOffline: { background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', color: '#F5A623', fontSize: '13px', padding: '12px 16px', marginBottom: '24px', textAlign: 'center' },
  entete: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' },
  label: { color: '#D4AF37', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' },
  titreEntete: { color: '#fff', fontSize: '26px', fontWeight: '700', margin: '0 0 4px' },
  sousTitre: { color: '#444', fontSize: '13px', margin: 0 },
  grille3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
  grille2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' },
  section: { marginBottom: '32px' },
  sectionLabel: { color: '#D4AF37', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' },
  sectionTitre: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: '0 0 16px' },
  carte: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' },
  carteGraphe: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' },
  btnAction: { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '10px', color: '#888', cursor: 'pointer', fontSize: '14px', padding: '14px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', width: '100%' },
  tableau: { background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' },
  ligne: { display: 'flex', alignItems: 'center', padding: '16px 20px' },
};
