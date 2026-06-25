import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoutonPrimaire from '../components/BoutonPrimaire';
import ChampInput from '../components/ChampInput';
import ChampSelect from '../components/ChampSelect';
import AlerteSucces from '../components/AlerteSucces';
import AlerteErreur from '../components/AlerteErreur';

const CATS_REVENU = [
  { value: 'Vente produits', label: 'Vente produits' },
  { value: 'Prestation de service', label: 'Prestation de service' },
  { value: 'Remboursement', label: 'Remboursement' },
  { value: 'Subvention', label: 'Subvention' },
  { value: 'Autre revenu', label: 'Autre revenu' },
];
const CATS_DEPENSE = [
  { value: 'Achat stock / matières', label: 'Achat stock / matières' },
  { value: 'Loyer', label: 'Loyer' },
  { value: 'Salaires', label: 'Salaires' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Électricité / Eau', label: 'Électricité / Eau' },
  { value: 'Publicité', label: 'Publicité' },
  { value: 'Autre dépense', label: 'Autre dépense' },
];

export default function NouvelleTransaction() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'revenu', montant: '', description: '', categorie: '', date: new Date().toISOString().split('T')[0] });
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
      const token = localStorage.getItem('pme_token');
      const response = await fetch('http://localhost:3003/api/pme/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: form.type, montant: Number(form.montant), description: form.description, date: form.date }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur serveur');
      setSucces(true);
      setTimeout(() => navigate('/pme/dashboard'), 1500);
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  const categories = form.type === 'revenu' ? CATS_REVENU : CATS_DEPENSE;
  const estRevenu = form.type === 'revenu';

  return (
    <div style={s.page}>
      <div style={s.card}>
        <button style={s.btnRetour} onClick={() => navigate('/pme/dashboard')}>← Retour</button>
        <p style={s.label}>TRANSACTION</p>
        <h1 style={s.titre}>Nouvelle entrée</h1>

        <AlerteSucces message={succes ? 'Transaction enregistrée ! Redirection...' : ''} />
        <AlerteErreur message={erreur} />

        <div style={s.typeConteneur}>
          <button style={estRevenu ? s.typeActifRevenu : s.typeInactif} onClick={() => choisirType('revenu')}>
            <span style={{ fontSize: '20px' }}>▲</span>
            <span>Entrée d'argent</span>
          </button>
          <button style={!estRevenu ? s.typeActifDepense : s.typeInactif} onClick={() => choisirType('depense')}>
            <span style={{ fontSize: '20px' }}>▼</span>
            <span>Sortie d'argent</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <ChampInput label="Montant (FCFA)" name="montant" type="number" placeholder="Ex : 150 000" value={form.montant} onChange={handleChange} required />
          <ChampSelect label="Catégorie" name="categorie" value={form.categorie} onChange={handleChange} options={categories} required />
          <ChampInput label="Description" name="description" placeholder="Ex : Vente de 20 pagnes" value={form.description} onChange={handleChange} required />
          <ChampInput label="Date" name="date" type="date" value={form.date} onChange={handleChange} />

          {form.montant && form.description && (
            <div style={s.recap}>
              <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>Récapitulatif</p>
              <p style={{ color: '#fff', fontSize: '16px', margin: 0 }}>
                <span style={{ color: estRevenu ? '#4CAF50' : '#FF4444', fontWeight: '800', fontSize: '22px' }}>
                  {estRevenu ? '+' : '-'}{Number(form.montant).toLocaleString('fr-FR')} FCFA
                </span>
                <span style={{ color: '#555', fontSize: '14px', marginLeft: '10px' }}>— {form.description}</span>
              </p>
            </div>
          )}

          <BoutonPrimaire label="Enregistrer la transaction" type="submit" loading={chargement} />
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' },
  card: { width: '100%', maxWidth: '500px', background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '36px', boxSizing: 'border-box', boxShadow: '0 8px 48px rgba(0,0,0,0.5)' },
  btnRetour: { background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '24px', display: 'block' },
  label: { color: '#D4AF37', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' },
  titre: { color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 24px' },
  typeConteneur: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '20px 0 24px' },
  typeActifRevenu: { border: '2px solid #4CAF50', borderRadius: '12px', background: 'rgba(76,175,80,0.08)', color: '#4CAF50', cursor: 'pointer', fontSize: '14px', fontWeight: '700', padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  typeActifDepense: { border: '2px solid #FF4444', borderRadius: '12px', background: 'rgba(255,68,68,0.08)', color: '#FF4444', cursor: 'pointer', fontSize: '14px', fontWeight: '700', padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  typeInactif: { border: '1px solid #1a1a1a', borderRadius: '12px', background: 'transparent', color: '#333', cursor: 'pointer', fontSize: '14px', padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  recap: { background: '#0d0d0d', border: '1px solid #1a1a1a', borderLeft: '3px solid #D4AF37', borderRadius: '10px', padding: '16px' },
};
