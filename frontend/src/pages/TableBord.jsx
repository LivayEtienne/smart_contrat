import { useState, useEffect } from 'react';
import { depotService } from '../services/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts';

export default function TableBord() {
  const [compte, setCompte] = useState(null);
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodeFiltre, setPeriodeFiltre] = useState('mois'); // 'semaine' | 'mois' | 'annee'

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

  // ── LOGIQUE DE GÉNÉRATION DE L'AXE CONTINU ET DES CUMULS ──────────────────
  const getDonneesEvolution = () => {
    const maintenant = new Date();
    let structureAxe = [];

    // 1. CRÉATION DU SQUELETTE TEMPOREL VIDE
    if (periodeFiltre === 'semaine') {
      const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      structureAxe = joursSemaine.map(jour => ({ label: jour, matchKey: jour, total: 0, tokens: 0 }));
    } 
    else if (periodeFiltre === 'mois') {
      // Génère les 30 derniers jours un par un
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(maintenant.getDate() - i);
        const label = d.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
        const matchKey = d.toLocaleDateString('fr-FR'); // Format 'DD/MM/YYYY' pour le mapping
        structureAxe.push({ label, matchKey, total: 0, tokens: 0 });
      }
    } 
    else if (periodeFiltre === 'annee') {
      const moisAnnee = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      structureAxe = moisAnnee.map((mois, index) => ({ label: mois, matchKey: index.toString(), total: 0, tokens: 0 }));
    }

    // 2. TRI ET CALCUL DES CUMULS GLOBAUX SANS FILTRE (Indispensable pour connaître le solde de départ)
    const depotsValides = depots
      .filter(d => d.statut === 'valide')
      .sort((a, b) => new Date(a.date_depot) - new Date(b.date_depot));

    // 3. INJECTION DES COMPTES RÉELS DANS LE SQUELETTE TEMPOREL
    let cumulTotal = 0;
    let cumulTokens = 0;

    // Pour éviter que la courbe ne commence à zéro si vous aviez déjà des investissements passés,
    // on va balayer le temps chronologiquement.
    return structureAxe.map(point => {
      // Trouver les dépôts qui correspondent à cette case temporelle précise
      const depotsDuJour = depotsValides.filter(d => {
        const dateDepot = new Date(d.date_depot);
        if (periodeFiltre === 'semaine') {
          let j = dateDepot.toLocaleDateString('fr-FR', { weekday: 'long' });
          return j.charAt(0).toUpperCase() + j.slice(1) === point.matchKey;
        } else if (periodeFiltre === 'mois') {
          return dateDepot.toLocaleDateString('fr-FR') === point.matchKey;
        } else if (periodeFiltre === 'annee') {
          return dateDepot.getMonth().toString() === point.matchKey;
        }
        return false;
      });

      // Si des dépôts existent ce jour-là, on les ajoute au cumul
      depotsDuJour.forEach(d => {
        cumulTotal += d.montant_usd;
        cumulTokens += d.ConversionToken?.tokens_attribues || 0;
      });

      // Si aucun dépôt ce jour-là, la courbe conserve la valeur de la veille (cumul stable)
      return {
        date: point.label,
        total: parseFloat(cumulTotal.toFixed(2)),
        tokens: parseFloat(cumulTokens.toFixed(2)),
      };
    });
  };

  const dataEvolution = getDonneesEvolution();

  // ── Données des graphiques secondaires ──────────────────
  const repartitionDevise = ['FCFA', 'USD', 'CRYPTO'].map(devise => ({
    name: devise,
    value: depots.filter(d => d.devise_origine === devise).length,
  })).filter(d => d.value > 0);

  const repartitionStatut = [
    { name: 'Validés', value: depots.filter(d => d.statut === 'valide').length, color: '#4CAF50' },
    { name: 'En attente', value: depots.filter(d => d.statut === 'en_attente').length, color: '#F5A623' },
    { name: 'Refusés', value: depots.filter(d => d.statut === 'refuse').length, color: '#FF4444' },
  ].filter(d => d.value > 0);

  const COLORS_DEVISE = ['#D4AF37', '#A0A0AA', '#4A90D9'];
  const niveauColor = { Pionnier: '#C0C0C0', Elite: '#D4AF37', Majeur: '#F5E17A' };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#0D0D11', border: '1px solid #22222A',
          borderRadius: '8px', padding: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          <p style={{ color: '#8E8E93', fontSize: '12px', margin: '0 0 6px', fontWeight: '500' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: '13px', margin: '4px 0', fontWeight: '600' }}>
              {p.name} : {p.value.toLocaleString()} {p.name === 'Total USD' ? 'USD' : 'BCX'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#060608' }}>
      <p style={{ color: '#D4AF37', fontWeight: '500' }}>Chargement du protocole...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.content}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Tableau de bord</h1>
            <p style={styles.sub}>Vue d'ensemble en temps réel de votre investissement BCX Finance</p>
          </div>
          {compte?.investisseur?.niveau && (
            <div style={styles.nivBadge}>
              <span style={{ color: niveauColor[compte.investisseur.niveau], fontWeight: '600', fontSize: '12px' }}>
                ◆ Membre {compte.investisseur.niveau}
              </span>
            </div>
          )}
        </div>

        {/* STATS CARDS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>TOTAL INVESTI</p>
            <p style={styles.statValue}>
              ${compte?.compte?.total_investi_usd?.toLocaleString() || 0}
              <span style={styles.statUnit}>USD</span>
            </p>
            <p style={styles.statSub}>Actifs cumulés validés</p>
          </div>
          
          <div style={{ ...styles.statCard, borderColor: 'rgba(212,175,55,0.3)' }}>
            <p style={styles.statLabel}>BCX TOKENS</p>
            <p style={{ ...styles.statValue, color: '#D4AF37' }}>
              {compte?.compte?.total_bcx_tokens?.toLocaleString() || 0}
              <span style={{ ...styles.statUnit, color: 'rgba(212,175,55,0.6)' }}>BCX</span>
            </p>
            <p style={{ ...styles.statSub, color: '#8C8C9A' }}>Contrats de jetons alloués</p>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>FLUX DE DÉPÔTS</p>
            <p style={styles.statValue}>{depots.length}</p>
            <p style={styles.statSub}>
              <span style={{ color: '#F5A623', fontWeight: '600' }}>{depots.filter(d => d.statut === 'en_attente').length}</span> en attente
            </p>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>DÉPÔTS VALIDÉS</p>
            <p style={{ ...styles.statValue, color: '#4CAF50' }}>
              {depots.filter(d => d.statut === 'valide').length}
            </p>
            <p style={styles.statSub}>Taux de succès global</p>
          </div>
        </div>

        {/* GRAPHÉ ÉVOLUTION PRINCIPAL AVEC AXE COMPLET CONTINU */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeaderRow}>
            <h2 style={styles.chartTitle}>Courbe de performance de l'investissement</h2>
            
            <div style={styles.timeFilters}>
              {['semaine', 'mois', 'annee'].map((periode) => (
                <button
                  key={periode}
                  onClick={() => setPeriodeFiltre(periode)}
                  style={periodeFiltre === periode ? styles.timeBtnActive : styles.timeBtn}
                >
                  {periode === 'semaine' ? '7J' : periode === 'mois' ? '1M' : '1A'}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={dataEvolution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A90D9" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4A90D9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#141419" vertical={false} />
              <XAxis dataKey="date" stroke="#48484F" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#48484F" fontSize={11} tickLine={false} axisLine={false} dx={-5} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22222A' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
              <Area
                type="monotone" dataKey="total" name="Total USD"
                stroke="#D4AF37" fill="url(#colorTotal)" strokeWidth={2} activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Area
                type="monotone" dataKey="tokens" name="BCX Tokens"
                stroke="#4A90D9" fill="url(#colorTokens)" strokeWidth={2} activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHES RÉPARTITION SECONDAIRES */}
        <div style={styles.pieGrid}>
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Allocation des devises d'origine</h2>
            {repartitionDevise.length === 0 ? (
              <div style={styles.chartEmpty}><p style={{ color: '#636366', margin: 0 }}>Aucune devise enregistrée</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={repartitionDevise}
                    cx="50%" cy="45%"
                    innerRadius={65} outerRadius={85}
                    paddingAngle={5} dataKey="value"
                  >
                    {repartitionDevise.map((_, index) => (
                      <Cell key={index} fill={COLORS_DEVISE[index % COLORS_DEVISE.length]} stroke="#0B0B0E" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0D0D11', border: '1px solid #22222A', borderRadius: '8px' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Index de validation des dossiers</h2>
            {repartitionStatut.length === 0 ? (
              <div style={styles.chartEmpty}><p style={{ color: '#636366', margin: 0 }}>Aucun dossier traité</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={repartitionStatut}
                    cx="50%" cy="45%"
                    innerRadius={65} outerRadius={85}
                    paddingAngle={5} dataKey="value"
                  >
                    {repartitionStatut.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="#0B0B0E" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0D0D11', border: '1px solid #22222A', borderRadius: '8px' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { width: '100%', margin: 0, padding: '0 32px 32px 32px', boxSizing: 'border-box' },
  content: { width: '100%', margin: 0, padding: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', width: '100%' },
  title: { color: '#fff', fontSize: '26px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' },
  sub: { color: '#636366', fontSize: '14px', margin: 0 },
  nivBadge: { background: '#0B0B0E', border: '1px solid #1A1A22', borderRadius: '30px', padding: '8px 18px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px', width: '100%' },
  statCard: { background: '#0B0B0E', border: '1px solid #1A1A22', borderRadius: '16px', padding: '24px' },
  statLabel: { color: '#636366', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', margin: '0 0 12px' },
  statValue: { color: '#fff', fontSize: '28px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' },
  statUnit: { fontSize: '14px', color: '#636366', marginLeft: '6px', fontWeight: '500' },
  statSub: { color: '#44444F', fontSize: '12px', margin: 0, fontWeight: '500' },
  chartCard: { background: '#0B0B0E', border: '1px solid #1A1A22', borderRadius: '16px', padding: '28px', marginBottom: '24px', width: '100%', boxSizing: 'border-box' },
  chartHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  chartTitle: { color: '#fff', fontSize: '15px', fontWeight: '600', margin: 0 },
  timeFilters: { display: 'flex', background: '#060608', padding: '4px', borderRadius: '8px', border: '1px solid #1A1A22' },
  timeBtn: { background: 'transparent', border: 'none', color: '#636366', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s' },
  timeBtnActive: { background: '#1A1A22', border: 'none', color: '#D4AF37', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' },
  chartEmpty: { height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pieGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', width: '100%' },
};