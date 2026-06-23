// PAGE : Inscription PME | Route : /pme/inscription | Auteur : Léonie Gondo
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoutonPrimaire from '../../components/PME/BoutonPrimaire';
import ChampInput from '../../components/PME/ChampInput';
import ChampSelect from '../../components/PME/ChampSelect';
import AlerteSucces from '../../components/PME/AlerteSucces';
import AlerteErreur from '../../components/PME/AlerteErreur';

const SECTEURS = [
  { value: 'commerce', label: 'Commerce / Distribution' },
  { value: 'restauration', label: 'Restauration / Alimentaire' },
  { value: 'services', label: 'Services aux entreprises' },
  { value: 'artisanat', label: 'Artisanat / Fabrication' },
  { value: 'transport', label: 'Transport / Logistique' },
  { value: 'agriculture', label: 'Agriculture / Élevage' },
  { value: 'technologie', label: 'Technologie / Numérique' },
  { value: 'autre', label: 'Autre' },
];

export default function InscriptionPME() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', secteur: '', email: '', telephone: '', adresse: '', motDePasse: '', confirmerMotDePasse: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErreur(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.secteur || !form.email || !form.motDePasse) { setErreur('Merci de remplir tous les champs obligatoires.'); return; }
    if (form.motDePasse !== form.confirmerMotDePasse) { setErreur('Les mots de passe ne correspondent pas.'); return; }
    if (form.motDePasse.length < 6) { setErreur('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setChargement(true);
    try {
      const response = await fetch('http://localhost:3003/api/pme/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: form.nom, secteur: form.secteur, email: form.email, mot_de_passe: form.motDePasse }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur serveur');
      localStorage.setItem('pme_token', data.token);
      localStorage.setItem('pme', JSON.stringify(data.pme));
      setSucces(true);
      setTimeout(() => navigate('/pme/dashboard'), 1500);
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={s.page}>
      {/* PANNEAU GAUCHE */}
      <div style={s.panneau}>
        <div style={s.panneauInner}>
          <div style={s.logo}>BCX <span style={{ color: '#D4AF37' }}>FINANCE</span></div>
          <h2 style={s.panneauTitre}>Gérez vos finances d'entreprise avec confiance</h2>
          <p style={s.panneauTexte}>Rejoignez des centaines de PME africaines qui suivent leurs revenus, dépenses et score de crédit en temps réel.</p>
          <div style={s.avantages}>
            {['📊 Tableau de bord en temps réel', '🏆 Score de crédibilité BCX', '📄 Rapports mensuels PDF', '🔒 Données sécurisées'].map((a) => (
              <div key={a} style={s.avantageItem}>{a}</div>
            ))}
          </div>
        </div>
      </div>

      {/* PANNEAU DROIT — FORMULAIRE */}
      <div style={s.formulaireZone}>
        <div style={s.formulaireCard}>
          <h1 style={s.titre}>Créer votre compte PME</h1>
          <p style={s.sousTitre}>Inscription gratuite — moins de 2 minutes</p>

          <AlerteSucces message={succes ? 'Inscription réussie ! Redirection...' : ''} />
          <AlerteErreur message={erreur} />

          <form onSubmit={handleSubmit} style={s.form}>
            <ChampInput label="Nom de la PME" name="nom" placeholder="Ex : Boutique Couleur d'Afrique" value={form.nom} onChange={handleChange} required />
            <ChampSelect label="Secteur d'activité" name="secteur" value={form.secteur} onChange={handleChange} options={SECTEURS} required />
            <ChampInput label="Email professionnel" name="email" type="email" placeholder="contact@mapme.com" value={form.email} onChange={handleChange} required />
            <ChampInput label="Téléphone" name="telephone" type="tel" placeholder="+226 70 00 00 00" value={form.telephone} onChange={handleChange} />
            <ChampInput label="Adresse" name="adresse" placeholder="Quartier, Ville, Pays" value={form.adresse} onChange={handleChange} />
            <ChampInput label="Mot de passe" name="motDePasse" placeholder="Au moins 6 caractères" value={form.motDePasse} onChange={handleChange} required avecOeil />
            <ChampInput label="Confirmer le mot de passe" name="confirmerMotDePasse" placeholder="Répétez le mot de passe" value={form.confirmerMotDePasse} onChange={handleChange} required avecOeil />
            <div style={{ marginTop: '8px' }}>
              <BoutonPrimaire label="Créer mon compte" type="submit" loading={chargement} />
            </div>
          </form>

          <p style={s.lienConnexion}>
            Déjà inscrit ?{' '}
            <span style={s.lien} onClick={() => navigate('/login')}>Se connecter</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' },
  panneau: { width: '42%', background: 'linear-gradient(160deg, #111 0%, #0d0d0d 100%)', borderRight: '1px solid #1a1a1a', padding: '48px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' },
  panneauInner: { maxWidth: '360px' },
  logo: { fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '4px', marginBottom: '40px' },
  panneauTitre: { color: '#fff', fontSize: '26px', fontWeight: '700', lineHeight: '1.4', margin: '0 0 16px' },
  panneauTexte: { color: '#555', fontSize: '14px', lineHeight: '1.7', margin: '0 0 32px' },
  avantages: { display: 'flex', flexDirection: 'column', gap: '12px' },
  avantageItem: { color: '#888', fontSize: '14px', padding: '12px 16px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderLeft: '3px solid #D4AF37', borderRadius: '8px' },
  formulaireZone: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', boxSizing: 'border-box', overflowY: 'auto' },
  formulaireCard: { width: '100%', maxWidth: '440px' },
  titre: { color: '#fff', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' },
  sousTitre: { color: '#555', fontSize: '13px', margin: '0 0 28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px', margin: '20px 0' },
  lienConnexion: { color: '#555', fontSize: '13px', marginTop: '24px', textAlign: 'center' },
  lien: { color: '#D4AF37', cursor: 'pointer', textDecoration: 'underline' },
};
