import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { depotService } from '../services/api';

export default function Profil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [compte, setCompte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletMsg, setWalletMsg] = useState('');

  useEffect(() => {
    const fetchCompte = async () => {
      try {
        const res = await depotService.monCompte();
        setCompte(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompte();
  }, []);

  const connecterMetaMask = async () => {
    if (!window.ethereum) {
      setWalletMsg('MetaMask non détecté — installez MetaMask');
      return;
    }
    setWalletLoading(true);
    setWalletMsg('');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const adresse = accounts[0];
      await depotService.mettreAJourWallet({ wallet_address: adresse });
      setCompte(prev => ({
        ...prev,
        investisseur: { ...prev.investisseur, wallet_address: adresse }
      }));
      setWalletMsg('✅ Wallet connecté et sauvegardé avec succès');
    } catch (err) {
      setWalletMsg('❌ Connexion MetaMask échouée');
    } finally {
      setWalletLoading(false);
    }
  };

  const niveauColor = { Pionnier: '#C0C0C0', Elite: '#D4AF37', Majeur: '#F5E17A' };

  if (loading) return (
    <div style={{ ...styles.page, justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: '#D4AF37' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>BCX <span style={{ color: '#D4AF37' }}>FINANCE</span></span>
        <div style={styles.navRight}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.title}>Mon Profil</h1>

        {/* INFOS PERSONNELLES */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Informations personnelles</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Prénom</span>
              <span style={styles.infoValue}>{compte?.investisseur?.prenom}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Nom</span>
              <span style={styles.infoValue}>{compte?.investisseur?.nom}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{compte?.investisseur?.email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Statut</span>
              <span style={{
                ...styles.infoValue,
                color: compte?.investisseur?.statut === 'actif' ? '#4CAF50' : '#FF4444'
              }}>
                {compte?.investisseur?.statut}
              </span>
            </div>
          </div>
        </div>

        {/* NIVEAU + SOLDE */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Mon investissement</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <span style={styles.infoLabel}>Niveau</span>
              <span style={{
                fontSize: '20px', fontWeight: '700',
                color: niveauColor[compte?.investisseur?.niveau] || '#555'
              }}>
                {compte?.investisseur?.niveau || '—'}
              </span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.infoLabel}>Total investi</span>
              <span style={styles.statValue}>
                ${compte?.compte?.total_investi_usd?.toLocaleString() || 0}
                <span style={styles.statUnit}>USD</span>
              </span>
            </div>
            <div style={{ ...styles.statBox, borderColor: '#D4AF37' }}>
              <span style={styles.infoLabel}>BCX Tokens</span>
              <span style={{ ...styles.statValue, color: '#D4AF37' }}>
                {compte?.compte?.total_bcx_tokens?.toLocaleString() || 0}
                <span style={styles.statUnit}>BCX</span>
              </span>
            </div>
          </div>
        </div>

        {/* WALLET */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Wallet crypto</h2>
          {compte?.investisseur?.wallet_address ? (
            <div style={styles.walletConnecte}>
              <span style={styles.walletDot}>●</span>
              <div>
                <p style={styles.walletAdresse}>{compte.investisseur.wallet_address}</p>
                <p style={styles.walletSub}>Wallet connecté — tokens BCX envoyés à cette adresse</p>
              </div>
            </div>
          ) : (
            <div>
              <p style={styles.walletEmpty}>
                Aucun wallet connecté — connectez MetaMask pour recevoir vos BCX tokens on-chain
              </p>
              <button
                style={walletLoading ? styles.btnMetaMaskLoading : styles.btnMetaMask}
                onClick={connecterMetaMask}
                disabled={walletLoading}
              >
                {walletLoading ? 'Connexion...' : '🦊 Connecter MetaMask'}
              </button>
            </div>
          )}
          {walletMsg && (
            <p style={{
              marginTop: '12px', fontSize: '13px',
              color: walletMsg.startsWith('✅') ? '#4CAF50' : '#FF4444'
            }}>
              {walletMsg}
            </p>
          )}
        </div>

        {/* AYANTS DROIT */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Ayants droit</h2>
            <button
              style={styles.btnAjouter}
              onClick={() => navigate('/ayants-droit')}
            >
              + Gérer
            </button>
          </div>
          <p style={styles.walletEmpty}>
            Désignez vos ayants droit pour sécuriser votre investissement.
          </p>
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
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  backBtn: {
    background: 'transparent', border: '1px solid #2a2a2a', color: '#888',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
  },
  content: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  title: { color: '#fff', fontSize: '24px', fontWeight: '800', marginBottom: '24px' },
  card: {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px',
    padding: '24px', marginBottom: '16px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { color: '#fff', fontSize: '15px', fontWeight: '600', margin: '0 0 16px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { color: '#555', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' },
  infoValue: { color: '#fff', fontSize: '15px', fontWeight: '500' },
  statBox: {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px',
    padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
  },
  statValue: { color: '#fff', fontSize: '22px', fontWeight: '700' },
  statUnit: { fontSize: '12px', color: '#555', marginLeft: '4px', fontWeight: '400' },
  walletConnecte: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  walletDot: { color: '#22c55e', fontSize: '12px', marginTop: '2px' },
  walletAdresse: { color: '#fff', fontSize: '13px', fontWeight: '600', margin: '0 0 4px', wordBreak: 'break-all' },
  walletSub: { color: '#555', fontSize: '12px', margin: 0 },
  walletEmpty: { color: '#555', fontSize: '13px', marginBottom: '16px' },
  btnMetaMask: {
    background: 'rgba(212,175,55,0.1)', border: '1px solid #D4AF37',
    borderRadius: '8px', padding: '12px 20px', color: '#D4AF37',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  btnMetaMaskLoading: {
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: '8px', padding: '12px 20px', color: '#555',
    fontSize: '14px', cursor: 'not-allowed',
  },
  btnAjouter: {
    background: 'rgba(212,175,55,0.1)', border: '1px solid #D4AF37',
    borderRadius: '6px', padding: '6px 14px', color: '#D4AF37',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
};