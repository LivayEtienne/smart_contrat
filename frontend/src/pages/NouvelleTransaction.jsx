// PAGE : Nouvelle Transaction | Route : /pme/nouvelle-transaction | Auteur : Léonie Gondo
// 📌 API ICI : cherche le commentaire "👉 API ICI"

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NouvelleTransaction() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'entree',
    montant: '',
    description: '',
    categorie: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErreur(''); };
  const choisirType = (type) => setForm({ ...form, type, categorie: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.montant || !form.description || !form.categorie) { setErreur('Montant, description et catégorie sont obligatoires.'); return; }
    if (Number(form.montant) <= 0) { setErreur('Le montant doit être supérieur à 0.'); return; }
    setChargement(true);
    try {
      // 👉 API ICI — Décommente quand Parfait envoie la route
      // const token = localStorage.getItem('token');
      // const response = await fetch('http://localhost:3003/api/pme/transactions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ type: form.type, montant: Number(form.montant), description: form.description, categorie: form.categorie, date: form.date }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Erreur serveur');

      // ---- DONNÉES FICTIVES (supprimer quand l'API est branchée) ----
      await new Promise((r) => setTimeout(r, 900));
      // ---------------------------------------------------------------

      setSucces(true);
      setTimeout(() => navigate('/pme/dashboard'), 1500);
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  const categoriesEntree = ['Vente produits', 'Prestation de service', 'Remboursement', 'Subvention', 'Autre revenu'];
  const categoriesSortie = ['Achat stock / matières', 'Loyer', 'Salaires', 'Transport', 'Électricité / Eau', 'Publicité', 'Autre dépense'];
  const categories = form.type === 'entree' ? categoriesEntree : categoriesSortie;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.btnRetour} onClick={() => navigate('/pme/dashboard')}>← Retour au tableau de bord</button>
        <h1 style={styles.titre}>Nouvelle transaction</h1>

        {succes && <div style={styles.alertSucces}>✅ Transaction enregistrée ! Redirection...</div>}
        {erreur && <div style={styles.alertErreur}>⚠️ {erreur}</div>}

        {/* CHOIX ENTRÉE / SORTIE */}
        <div style={styles.typeConteneur}>
          <button style={form.type === 'entree' ? styles.typeActifEntree : styles.typeInactif} onClick={() => choisirType('entree')}>
            ▲ Entrée d'argent
          </button>
          <button style={form.type === 'sortie' ? styles.typeActifSortie : styles.typeInactif} onClick={() => choisirType('sortie')}>
            ▼ Sortie d'argent
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.groupe}>
            <label style={styles.label}>Montant (FCFA) *</label>
            <input style={styles.input} type="number" name="montant" placeholder="Ex : 150000" value={form.montant} onChange={handleChange} min="1" />
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Catégorie *</label>
            <select style={styles.input} name="categorie" value={form.categorie} onChange={handleChange}>
              <option value="">-- Choisir une catégorie --</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Description *</label>
            <input style={styles.input} type="text" name="description" placeholder="Ex : Vente de 20 pagnes" value={form.description} onChange={handleChange} />
          </div>
          <div style={styles.groupe}>
            <label style={styles.label}>Date</label>
            <input style={styles.input} type="date" name="date" value={form.date} onChange={handleChange} />
          </div>

          {form.montant && form.description && (
            <div style={styles.resume}>
              <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px' }}>Récapitulatif</p>
              <p style={{ color: '#fff', fontSize: '15px', margin: 0 }}>
                <span style={{ color: form.type === 'entree' ? '#4CAF50' : '#FF4444', fontWeight: '700' }}>
                  {form.type === 'entree' ? '+' : '-'}{Number(form.montant).toLocaleString('fr-FR')} FCFA
                </span>
                {' '}— {form.description}
              </p>
            </div>
          )}

          <button type="submit" disabled={chargement}
            style={chargement ? styles.btnDesactive : (form.type === 'entree' ? styles.btnEntree : styles.btnSortie)}>
            {chargement ? 'Enregistrement...' : 'Enregistrer la transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' },
  card: { width: '100%', maxWidth: '480px', background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '32px', boxSizing: 'border-box' },
  btnRetour: { background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '20px' },
  titre: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px' },
  alertSucces: { background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4CAF50', borderRadius: '8px', color: '#4CAF50', padding: '12px 16px', fontSize: '14px', marginBottom: '16px' },
  alertErreur: { background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #FF4444', borderRadius: '8px', color: '#FF4444', padding: '12px 16px', fontSize: '14px', marginBottom: '16px' },
  typeConteneur: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' },
  typeActifEntree: { border: '2px solid #4CAF50', borderRadius: '8px', background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '12px' },
  typeActifSortie: { border: '2px solid #FF4444', borderRadius: '8px', background: 'rgba(255, 68, 68, 0.1)', color: '#FF4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '12px' },
  typeInactif: { border: '1px solid #2a2a2a', borderRadius: '8px', background: 'transparent', color: '#555', cursor: 'pointer', fontSize: '14px', padding: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  groupe: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#888', fontSize: '13px', fontWeight: '500' },
  input: { background: '#0A0A0A', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff', fontSize: '14px', padding: '12px 16px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  resume: { background: '#0A0A0A', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '16px' },
  btnEntree: { background: 'linear-gradient(135deg, #4CAF50, #81C784)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '700', padding: '14px', width: '100%' },
  btnSortie: { background: 'linear-gradient(135deg, #FF4444, #FF8A80)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '700', padding: '14px', width: '100%' },
  btnDesactive: { background: '#2a2a2a', border: 'none', borderRadius: '8px', color: '#555', cursor: 'not-allowed', fontSize: '15px', fontWeight: '700', padding: '14px', width: '100%' },
};
