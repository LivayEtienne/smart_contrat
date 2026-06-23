// ============================================================
// PAGE : Inscription PME
// Route : /pme/inscription
// Auteur : Léonie Gondo
// ============================================================
// 📌 OÙ BRANCHER L'API (quand Parfait envoie les routes) :
//    Cherche le commentaire  👉 API ICI  dans ce fichier
//    et remplace fetch('...') par la vraie URL backend
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InscriptionPME() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '', secteur: '', email: '', telephone: '', adresse: '',
    motDePasse: '', confirmerMotDePasse: '',
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);
  const [voirMdp, setVoirMdp] = useState(false);
  const [voirConfirm, setVoirConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErreur('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.secteur || !form.email || !form.motDePasse) {
      setErreur("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (form.motDePasse !== form.confirmerMotDePasse) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.motDePasse.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setChargement(true);
    try {
      // 👉 API ICI — Décommente quand Parfait envoie la route
      // const response = await fetch('http://localhost:3003/api/pme/inscription', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      //   body: JSON.stringify(form),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Erreur serveur');

      // ---- DONNÉES FICTIVES (supprimer quand l'API est branchée) ----
      await new Promise((r) => setTimeout(r, 1000));
      // ---------------------------------------------------------------

      setSucces(true);
      setTimeout(() => navigate('/pme/dashboard'), 1500);
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.logo}>BCX <span style={{ color: '#D4AF37' }}>FINANCE</span></span>
          <h1 style={styles.titre}>Inscription PME</h1>
          <p style={styles.sousTitre}>Rejoignez le réseau BCX et gérez vos finances d'entreprise</p>
        </div>

        {succes && <div style={styles.alertSucces}>✅ Inscription réussie ! Redirection en cours...</div>}
        {erreur && <div style={styles.alertErreur}>⚠️ {erreur}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.groupe}>
            <label style={styles.label}>Nom de la PME *</label>
            <input style={styles.input} type="text" name="nom" placeholder="Ex : Boutique Couleur d'Afrique" value={form.nom} onChange={handleChange} />
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Secteur d'activité *</label>
            <select style={styles.input} name="secteur" value={form.secteur} onChange={handleChange}>
              <option value="">-- Choisir un secteur --</option>
              <option value="commerce">Commerce / Distribution</option>
              <option value="restauration">Restauration / Alimentaire</option>
              <option value="services">Services aux entreprises</option>
              <option value="artisanat">Artisanat / Fabrication</option>
              <option value="transport">Transport / Logistique</option>
              <option value="agriculture">Agriculture / Élevage</option>
              <option value="technologie">Technologie / Numérique</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Email professionnel *</label>
            <input style={styles.input} type="email" name="email" placeholder="contact@mapme.com" value={form.email} onChange={handleChange} />
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Téléphone</label>
            <input style={styles.input} type="tel" name="telephone" placeholder="+226 70 00 00 00" value={form.telephone} onChange={handleChange} />
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Adresse</label>
            <input style={styles.input} type="text" name="adresse" placeholder="Quartier, Ville, Pays" value={form.adresse} onChange={handleChange} />
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Mot de passe *</label>
            <div style={styles.inputWrapper}>
              <input style={styles.inputAvecOeil} type={voirMdp ? 'text' : 'password'} name="motDePasse" placeholder="Au moins 6 caractères" value={form.motDePasse} onChange={handleChange} />
              <span style={styles.oeil} onClick={() => setVoirMdp(!voirMdp)}>
                {voirMdp ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Confirmer le mot de passe *</label>
            <div style={styles.inputWrapper}>
              <input style={styles.inputAvecOeil} type={voirConfirm ? 'text' : 'password'} name="confirmerMotDePasse" placeholder="Répétez le mot de passe" value={form.confirmerMotDePasse} onChange={handleChange} />
              <span style={styles.oeil} onClick={() => setVoirConfirm(!voirConfirm)}>
                {voirConfirm ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button type="submit" style={chargement ? styles.btnDesactive : styles.btn} disabled={chargement}>
            {chargement ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>

        <p style={styles.lienConnexion}>
          Déjà inscrit ?{' '}
          <span style={styles.lien} onClick={() => navigate('/login')}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' },
  card: { width: '100%', maxWidth: '480px', background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '40px 32px', boxSizing: 'border-box' },
  header: { textAlign: 'center', marginBottom: '32px' },
  logo: { fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '3px' },
  titre: { color: '#fff', fontSize: '24px', fontWeight: '700', margin: '16px 0 8px' },
  sousTitre: { color: '#555', fontSize: '14px', margin: 0 },
  alertSucces: { background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4CAF50', borderRadius: '8px', color: '#4CAF50', padding: '12px 16px', fontSize: '14px', marginBottom: '16px' },
  alertErreur: { background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #FF4444', borderRadius: '8px', color: '#FF4444', padding: '12px 16px', fontSize: '14px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  groupe: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#888', fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px' },
  input: { background: '#0A0A0A', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff', fontSize: '14px', padding: '12px 16px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { background: 'linear-gradient(135deg, #D4AF37, #F5E17A)', border: 'none', borderRadius: '8px', color: '#0A0A0A', cursor: 'pointer', fontSize: '15px', fontWeight: '700', marginTop: '8px', padding: '14px', width: '100%' },
  btnDesactive: { background: '#2a2a2a', border: 'none', borderRadius: '8px', color: '#555', cursor: 'not-allowed', fontSize: '15px', fontWeight: '700', marginTop: '8px', padding: '14px', width: '100%' },
  lienConnexion: { color: '#555', fontSize: '13px', marginTop: '24px', textAlign: 'center' },
  lien: { color: '#D4AF37', cursor: 'pointer', textDecoration: 'underline' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputAvecOeil: { background: '#0A0A0A', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff', fontSize: '14px', padding: '12px 44px 12px 16px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  oeil: { position: 'absolute', right: '14px', cursor: 'pointer', fontSize: '16px', userSelect: 'none' },
};
