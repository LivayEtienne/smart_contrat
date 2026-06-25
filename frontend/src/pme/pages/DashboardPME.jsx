import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import BadgeStatut from '../components/BadgeStatut';

const fmt = (n) => n?.toLocaleString('fr-FR') || '0';
const CACHE_KEY = 'pme_dashboard_cache';

const ONGLETS = [
  { key: 'toutes',   label: 'Toutes les transactions' },
  { key: 'revenus',  label: 'Revenus' },
  { key: 'depenses', label: 'Dépenses' },
  { key: 'attente',  label: 'En attente' },
];

function TooltipBar({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111', border: '1px solid #222', borderRadius: 10, padding: '10px 14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontFamily: "'Inter',sans-serif" }}>
      <p style={{ color: '#666', margin: '0 0 6px', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '3px 0', fontWeight: 600 }}>
          {p.name === 'revenus' ? '▲' : '▼'} {fmt(p.value)} FCFA
        </p>
      ))}
    </div>
  );
}

function StatCard({ label, valeur, unite, couleur, icone, variation }) {
  const isPos = variation > 0;
  const isNeg = variation < 0;
  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '20px 22px', fontFamily: "'Inter',sans-serif", flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, background: `${couleur}18`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{icone}</div>
        <span style={{ color: '#2a2a2a', fontSize: 16, cursor: 'default' }}>ⓘ</span>
      </div>
      <p style={{ color: '#555', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 8px' }}>{label}</p>
      <p style={{ color: couleur || '#fff', fontSize: '26px', fontWeight: '800', margin: 0, lineHeight: 1 }}>{valeur}</p>
      {unite && <p style={{ color: '#333', fontSize: 11, marginTop: 4, marginBottom: 0 }}>{unite}</p>}
      {variation !== undefined && (
        <p style={{ color: isNeg ? '#FF4444' : isPos ? '#4CAF50' : '#555', fontSize: 12, marginTop: 10, marginBottom: 0, fontWeight: 500 }}>
          {isPos ? '▲ +' : isNeg ? '▼ ' : ''}{Math.abs(variation)}% ce mois
        </p>
      )}
    </div>
  );
}

export default function DashboardPME() {
  const navigate = useNavigate();
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [modeOffline, setModeOffline] = useState(false);
  const [onglet, setOnglet] = useState('toutes');
  const pme = JSON.parse(localStorage.getItem('pme') || '{}');
  const initiale = pme.nom ? pme.nom[0].toUpperCase() : 'P';

  useEffect(() => {
    const goOnline  = () => { setModeOffline(false); charger(); };
    const goOffline = () => setModeOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  const charger = async () => {
    try {
      const token = localStorage.getItem('pme_token');
      const res = await fetch('http://localhost:3003/api/pme/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDonnees(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) { setDonnees(JSON.parse(cache)); setModeOffline(true); }
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { charger(); }, []);

  if (chargement) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#D4AF37', fontFamily: "'Inter',sans-serif" }}>Chargement...</p>
    </div>
  );

  if (!donnees) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#FF4444', fontFamily: "'Inter',sans-serif" }}>Impossible de charger les données.</p>
    </div>
  );

  const { resume = {}, transactions = [] } = donnees;

  // Regrouper par mois pour les graphiques
  const parMoisMap = {};
  transactions.forEach(t => {
    const mois = new Date(t.date).toLocaleDateString('fr-FR', { month: 'short' });
    if (!parMoisMap[mois]) parMoisMap[mois] = { mois, revenus: 0, depenses: 0 };
    if (t.type === 'revenu') parMoisMap[mois].revenus += t.montant;
    else parMoisMap[mois].depenses += t.montant;
  });
  const graphBar = Object.values(parMoisMap).slice(-7);

  let solde = 0;
  const graphArea = graphBar.map(d => ({ mois: d.mois, solde: (solde += d.revenus - d.depenses) }));

  // Filtrer les transactions selon l'onglet
  const txFiltrees = transactions.filter(t => {
    if (onglet === 'toutes')   return true;
    if (onglet === 'revenus')  return t.type === 'revenu';
    if (onglet === 'depenses') return t.type === 'depense';
    if (onglet === 'attente')  return t.statut === 'en_attente';
    return true;
  });

  const countAttente = transactions.filter(t => t.statut === 'en_attente').length;
  const dateAuj = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── EN-TÊTE CONTENU ── */}
      <div style={S.header}>
        <div>
          <p style={S.breadcrumb}><span style={{ color: '#333' }}>PME</span> / Tableau de bord</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {modeOffline && <span style={{ fontSize: 12, color: '#F5A623', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 6, padding: '4px 10px' }}>📡 Hors ligne</span>}
          <button style={S.headerBtn} onClick={() => navigate('/pme/rapport')} title="Notifications">🔔</button>
          <button style={S.headerBtn} onClick={() => navigate('/pme/profil')} title="Paramètres">⚙</button>
          <div onClick={() => navigate('/pme/profil')} style={{ width: 34, height: 34, background: '#D4AF37', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#000', cursor: 'pointer' }}>{initiale}</div>
        </div>
      </div>

      <div style={S.main}>

        {/* ── BANNIÈRE PRO ── */}
        <div style={S.banner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>✦</span>
            <div>
              <p style={{ color: '#000', fontWeight: 700, fontSize: 14, margin: 0 }}>Débloquez les analyses avancées</p>
              <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: 12, margin: 0 }}>Passez à BCX Pro pour des rapports détaillés et des prévisions en temps réel.</p>
            </div>
          </div>
          <button onClick={() => navigate('/pme/score')} style={{ background: '#000', border: 'none', borderRadius: 8, color: '#D4AF37', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: '9px 18px', flexShrink: 0 }}>
            Voir mon Score →
          </button>
        </div>

        {/* ── VUE D'ENSEMBLE ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Vue d'ensemble</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={S.filterBtn}>📅 {dateAuj}</button>
            <button style={S.filterBtn}>30 derniers jours</button>
            <button
              onClick={() => navigate('/pme/rapport')}
              style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Inter',sans-serif" }}
            >
              ↓ Exporter
            </button>
          </div>
        </div>

        {/* ── 4 CARTES STATS ── */}
        <div style={S.statsRow}>
          <StatCard label="Solde actuel"      valeur={fmt(resume.solde)}          unite="FCFA"  couleur="#D4AF37" icone="◈" />
          <StatCard label="Total revenus"     valeur={fmt(resume.total_revenus)}  unite="FCFA"  couleur="#4CAF50" icone="▲" variation={resume.total_revenus > 0 ? 12 : 0} />
          <StatCard label="Total dépenses"    valeur={fmt(resume.total_depenses)} unite="FCFA"  couleur="#FF4444" icone="▼" />
          <StatCard label="Nb transactions"   valeur={transactions.length}        unite="opérations" couleur="#7C6EF5" icone="◎" />
        </div>

        {/* ── GRAPHIQUES ── */}
        <div style={S.chartsRow}>

          {/* Bar chart */}
          <div style={S.chartCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <p style={S.chartLabel}>TRANSACTIONS</p>
                <h3 style={S.chartTitle}>Revenus & Dépenses</h3>
              </div>
              <button style={S.filterBtn}>30 derniers jours ▾</button>
            </div>
            {graphBar.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={graphBar} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barCategoryGap="35%">
                  <CartesianGrid stroke="#151515" vertical={false} />
                  <XAxis dataKey="mois" stroke="#222" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#222" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
                  <Tooltip content={<TooltipBar />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="revenus" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="depenses" fill="#FF444444" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#333', fontSize: 13 }}>Aucune donnée graphique disponible</p>
              </div>
            )}
          </div>

          {/* Area chart */}
          <div style={{ ...S.chartCard, flex: '0 0 auto', width: 'clamp(240px, 38%, 340px)' }}>
            <div style={{ marginBottom: 4 }}>
              <p style={S.chartLabel}>ÉVOLUTION</p>
              <h3 style={S.chartTitle}>Solde cumulé</h3>
            </div>
            {graphArea.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={graphArea} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSolde" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#151515" vertical={false} />
                  <XAxis dataKey="mois" stroke="#222" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#222" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 10, fontFamily: "'Inter',sans-serif", fontSize: 12 }}
                    labelStyle={{ color: '#666', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}
                    itemStyle={{ color: '#D4AF37', fontWeight: 600 }}
                    formatter={v => [`${fmt(v)} FCFA`, 'Solde']}
                  />
                  <Area type="monotone" dataKey="solde" stroke="#D4AF37" strokeWidth={2} fill="url(#gSolde)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#333', fontSize: 13 }}>Pas de données</p>
              </div>
            )}
          </div>
        </div>

        {/* ── DERNIÈRES TRANSACTIONS ── */}
        <div style={S.txSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Dernières transactions</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate('/pme/rapport')} style={{ background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 8, color: '#D4AF37', cursor: 'pointer', fontSize: 13, padding: '7px 14px', fontFamily: "'Inter',sans-serif" }}>Voir tout</button>
              <button style={S.filterBtn}>30 derniers jours ▾</button>
              <button onClick={() => navigate('/pme/rapport')} style={{ background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Inter',sans-serif" }}>
                ↓ Exporter
              </button>
            </div>
          </div>

          {/* Onglets */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 0, borderBottom: '1px solid #1a1a1a', flexWrap: 'wrap' }}>
            {ONGLETS.map(o => (
              <button
                key={o.key}
                onClick={() => setOnglet(o.key)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: onglet === o.key ? '#D4AF37' : '#555',
                  fontSize: 13, padding: '10px 14px', fontFamily: "'Inter',sans-serif",
                  borderBottom: onglet === o.key ? '2px solid #D4AF37' : '2px solid transparent',
                  fontWeight: onglet === o.key ? 600 : 400,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {o.label}
                {o.key === 'attente' && countAttente > 0 && (
                  <span style={{ background: '#F5A623', borderRadius: 20, color: '#000', fontSize: 10, fontWeight: 700, padding: '1px 7px' }}>{countAttente}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tableau */}
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderTop: 'none', borderRadius: '0 0 14px 14px', overflow: 'hidden' }}>
            {/* En-tête */}
            <div style={S.txHeader}>
              <span style={{ flex: 3 }}>Description</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Date</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Montant</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Type</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Statut</span>
            </div>

            {txFiltrees.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ color: '#444', fontSize: 28, margin: '0 0 8px' }}>📋</p>
                <p style={{ color: '#333', fontSize: 14, margin: 0 }}>Aucune transaction dans cette catégorie</p>
                <button onClick={() => navigate('/pme/nouvelle-transaction')} disabled={modeOffline} style={{ background: 'transparent', border: '1px solid #222', borderRadius: 8, color: '#D4AF37', cursor: modeOffline ? 'not-allowed' : 'pointer', fontSize: 13, marginTop: 16, padding: '10px 20px', fontFamily: "'Inter',sans-serif" }}>
                  + Saisir une transaction
                </button>
              </div>
            ) : (
              txFiltrees.slice(0, 8).map((t, i) => (
                <div key={t.id || i} style={{ ...S.txLigne, background: i % 2 === 0 ? '#111' : '#0f0f0f', borderBottom: i < txFiltrees.length - 1 ? '1px solid #0d0d0d' : 'none' }}>
                  <span style={{ flex: 3, color: '#ccc', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</span>
                  <span style={{ flex: 1, color: '#444', fontSize: 12, textAlign: 'center' }}>{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                  <span style={{ flex: 1, textAlign: 'right', color: t.type === 'revenu' ? '#4CAF50' : '#FF4444', fontWeight: 700, fontSize: 13 }}>
                    {t.type === 'revenu' ? '+' : '-'}{fmt(t.montant)}
                  </span>
                  <span style={{ flex: 1, textAlign: 'center' }}><BadgeStatut statut={t.type} /></span>
                  <span style={{ flex: 1, textAlign: 'center' }}><BadgeStatut statut={t.statut || t.type} /></span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const S = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 32px', borderBottom: '1px solid #111', background: '#0A0A0A',
    position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)',
  },
  breadcrumb: { color: '#888', fontSize: 13, fontFamily: "'Inter',sans-serif", margin: 0 },
  headerBtn: {
    background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 8,
    color: '#555', cursor: 'pointer', fontSize: 16, padding: '6px 10px',
    fontFamily: "'Inter',sans-serif",
  },
  main: { padding: '28px 32px', maxWidth: 1200, boxSizing: 'border-box' },
  banner: {
    background: 'linear-gradient(135deg, #D4AF37 0%, #F5E17A 100%)',
    borderRadius: 14, padding: '16px 22px', marginBottom: 28,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap',
  },
  statsRow: {
    display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap',
  },
  chartsRow: {
    display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  chartCard: {
    background: '#111', border: '1px solid #1a1a1a', borderRadius: 14,
    padding: '20px 22px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', flex: 1, minWidth: 260,
  },
  chartLabel: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 2px' },
  chartTitle: { color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 16px' },
  filterBtn: {
    background: '#111', border: '1px solid #1a1a1a', borderRadius: 8,
    color: '#555', cursor: 'pointer', fontSize: 12, padding: '7px 12px',
    fontFamily: "'Inter',sans-serif",
  },
  txSection: { marginBottom: 32 },
  txHeader: {
    display: 'flex', alignItems: 'center', padding: '11px 20px',
    background: '#0d0d0d', color: '#333', fontSize: 11, fontWeight: 600,
    letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a',
  },
  txLigne: {
    display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 8,
  },
};
