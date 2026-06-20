import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { depotService } from '../services/api';

export default function NewDepot() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    montant: '',
    devise_origine: 'FCFA',
    moyen_paiement: '',
    voie: 'A',
    tx_hash: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletConnecte, setWalletConnecte] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const montantUSD = form.devise_origine === 'FCFA'
    ? (parseFloat(form.montant) / 600).toFixed(2)
    : parseFloat(form.montant).toFixed(2);

  // ── CONNEXION METAMASK ─────────────────────────────────────────
  const connecterMetaMask = async () => {
    if (!window.ethereum) {
      setError('MetaMask non détecté — installez MetaMask sur votre navigateur');
      return;
    }
    setWalletLoading(true);
    setError('');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const adresse = accounts[0];
      setWalletConnecte(adresse);

      // Sauvegarder l'adresse dans le backend
      try {
        await depotService.mettreAJourWallet({ wallet_address: adresse });
        console.log('🦊 Wallet sauvegardé en base :', adresse);
      } catch (saveErr) {
        // Ne pas bloquer l'affichage si la sauvegarde échoue
        console.warn('⚠️ Wallet connecté localement mais non sauvegardé en base :', saveErr.message);
      }

    } catch (err) {
      if (err.code === 4001) {
        setError('Connexion MetaMask annulée par l\'utilisateur');
      } else {
        setError('Connexion MetaMask échouée — réessayez');
      }
    } finally {
      setWalletLoading(false);
    }
  };

  // ── SOUMISSION DU DÉPÔT ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation minimum 500 USD
    const montantUSDNum = form.devise_origine === 'FCFA'
      ? parseFloat(form.montant) / 600
      : parseFloat(form.montant);

    if (montantUSDNum < 500) {
      setError('Le montant minimum est de 500 USD (300 000 FCFA)');
      return;
    }

    // Voie B — wallet obligatoire
    if (form.voie === 'B' && !walletConnecte) {
      setError('Veuillez connecter votre MetaMask avant de soumettre');
      return;
    }

    setLoading(true);
    try {
      await depotService.creer({
        montant: parseFloat(form.montant),
        devise_origine: form.devise_origine,
        moyen_paiement: form.moyen_paiement,
        voie: form.voie,
        tx_hash: form.voie === 'B' ? form.tx_hash : undefined,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du dépôt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Retour</button>
        <h1 style={styles.title}>Nouveau dépôt</h1>
        <p style={styles.sub}>Minimum 500 USD pour rejoindre le Cercle</p>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* VOIE */}
          <div style={styles.voieGrid}>
            {['A', 'B'].map((v) => (
              <div
                key={v}
                style={form.voie === v ? styles.voieActive : styles.voie}
                onClick={() => {
                  setForm({ ...form, voie: v, devise_origine: v === 'B' ? 'CRYPTO' : 'FCFA' });
                  setWalletConnecte(null);
                  setError('');
                }}
              >
                <span style={styles.voieLabel}>Voie {v}</span>
                <span style={styles.voieDesc}>
                  {v === 'A' ? 'FCFA / Virement / Mobile Money' : 'Crypto / MetaMask'}
                </span>
              </div>
            ))}
          </div>

          {/* CONNEXION METAMASK — Voie B uniquement */}
          {form.voie === 'B' && (
            <div style={styles.walletBox}>
              {walletConnecte ? (
                <div style={styles.walletConnecte}>
                  <span style={styles.walletDot}>●</span>
                  <span style={styles.walletAdresse}>
                    {walletConnecte.slice(0, 6)}...{walletConnecte.slice(-4)}
                  </span>
                  <span style={styles.walletOk}>Wallet connecté</span>
                </div>
              ) : (
                <button
                  type="button"
                  style={walletLoading ? styles.btnMetaMaskLoading : styles.btnMetaMask}
                  onClick={connecterMetaMask}
                  disabled={walletLoading}
                >
                  {walletLoading ? 'Connexion...' : '🦊 Connecter MetaMask'}
                </button>
              )}
            </div>
          )}

          {/* MONTANT */}
          <div style={styles.field}>
            <label style={styles.label}>Montant</label>
            <input
              style={styles.input}
              type="number"
              placeholder={form.devise_origine === 'FCFA' ? '300000' : '500'}
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
              required
            />
            {form.montant && form.devise_origine !== 'CRYPTO' && (
              <span style={
                parseFloat(montantUSD) < 500 ? styles.convertDanger : styles.convert
              }>
                ≈ {montantUSD} USD
                {parseFloat(montantUSD) < 500 && ' — minimum 500 USD requis'}
              </span>
            )}
          </div>

          {/* DEVISE */}
          <div style={styles.field}>
            <label style={styles.label}>Devise</label>
            <select
              style={styles.input}
              value={form.devise_origine}
              onChange={(e) => setForm({ ...form, devise_origine: e.target.value })}
            >
              {form.voie === 'A' ? (
                <>
                  <option value="FCFA">FCFA</option>
                  <option value="USD">USD</option>
                </>
              ) : (
                <option value="CRYPTO">CRYPTO</option>
              )}
            </select>
          </div>

          {/* MOYEN DE PAIEMENT */}
          <div style={styles.field}>
            <label style={styles.label}>Moyen de paiement</label>
            <input
              style={styles.input}
              type="text"
              placeholder={form.voie === 'A' ? 'Orange Money, Wave, virement...' : 'MetaMask'}
              value={form.moyen_paiement}
              onChange={(e) => setForm({ ...form, moyen_paiement: e.target.value })}
            />
          </div>

          {/* TX HASH — Voie B uniquement, saisi manuellement si pas auto */}
          {form.voie === 'B' && walletConnecte && (
            <div style={styles.field}>
              <label style={styles.label}>Hash de transaction (optionnel)</label>
              <input
                style={styles.input}
                type="text"
                placeholder="0x... (laissez vide si non disponible)"
                value={form.tx_hash}
                onChange={(e) => setForm({ ...form, tx_hash: e.target.value })}
              />
              <span style={styles.txHint}>
                Disponible sur sepolia.etherscan.io après votre envoi crypto
              </span>
            </div>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Soumettre le dépôt'}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#0A0A0A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Inter', sans-serif", padding: '24px',
  },
  card: {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px',
    padding: '40px', width: '100%', maxWidth: '480px',
  },
  back: {
    background: 'transparent', border: 'none', color: '#555',
    cursor: 'pointer', fontSize: '13px', padding: '0', marginBottom: '24px',
  },
  title: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' },
  sub: { color: '#555', fontSize: '13px', marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  voieGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  voie: {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px',
    padding: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px',
  },
  voieActive: {
    background: 'rgba(212,175,55,0.08)', border: '1px solid #D4AF37', borderRadius: '10px',
    padding: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px',
  },
  voieLabel: { color: '#D4AF37', fontSize: '14px', fontWeight: '700' },
  voieDesc: { color: '#666', fontSize: '11px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#aaa', fontSize: '13px' },
  input: {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
    padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none',
  },
  convert: { color: '#D4AF37', fontSize: '12px' },
  convertDanger: { color: '#ff4444', fontSize: '12px' },
  walletBox: {
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: '10px', padding: '16px',
  },
  walletConnecte: {
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  walletDot: { color: '#22c55e', fontSize: '10px' },
  walletAdresse: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  walletOk: { color: '#22c55e', fontSize: '12px', marginLeft: 'auto' },
  btnMetaMask: {
    background: 'rgba(212,175,55,0.1)', border: '1px solid #D4AF37',
    borderRadius: '8px', padding: '12px', color: '#D4AF37',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%',
  },
  btnMetaMaskLoading: {
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: '8px', padding: '12px', color: '#555',
    fontSize: '14px', fontWeight: '600', cursor: 'not-allowed', width: '100%',
  },
  txHint: { color: '#555', fontSize: '11px' },
  error: {
    color: '#ff4444', fontSize: '13px', textAlign: 'center',
    background: 'rgba(255,68,68,0.08)', padding: '10px', borderRadius: '8px',
  },
  btn: {
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A)', color: '#0A0A0A',
    border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer',
  },
  btnDisabled: {
    background: '#2a2a2a', color: '#555', border: 'none', borderRadius: '8px',
    padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'not-allowed',
  },
};