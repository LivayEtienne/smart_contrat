import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastContainer';

export default function ProfilPME() {
  const navigate = useNavigate();
  const toast = useToast();
  const [pme, setPme] = useState({});
  const [form, setForm] = useState({ nom: '', secteur: '', email: '', telephone: '' });
  const [modifMdp, setModifMdp] = useState(false);
  const [mdp, setMdp] = useState({ actuel: '', nouveau: '', confirmer: '' });
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('pme') || '{}');
    setPme(data);
    setForm({ nom: data.nom || '', secteur: data.secteur || '', email: data.email || '', telephone: data.telephone || '' });
  }, []);

  const sauvegarder = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.email) { toast.error('Nom et email sont obligatoires.'); return; }
    setChargement(true);
    try {
      const updated = { ...pme, nom: form.nom, secteur: form.secteur, email: form.email, telephone: form.telephone };
      localStorage.setItem('pme', JSON.stringify(updated));
      setPme(updated);
      toast.success('Profil mis à jour avec succès !');
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    } finally {
      setChargement(false);
    }
  };

  const initiale = pme.nom ? pme.nom[0].toUpperCase() : 'P';

  return (
    <div style={s.page}>
      <div style={s.entete}>
        <button style={s.btnRetour} onClick={() => navigate('/pme/dashboard')}>← Retour</button>
        <p style={s.label}>MON COMPTE</p>
        <h1 style={s.titre}>Profil PME</h1>
      </div>

      <div style={s.profilCard}>
        <div style={s.avatarGrand}>{initiale}</div>
        <div>
          <h2 style={s.profilNom}>{pme.nom || 'Ma PME'}</h2>
          <p style={s.profilSecteur}>{pme.secteur || 'Secteur non défini'}</p>
          <span style={s.badge}>✓ Compte actif</span>
        </div>
      </div>

      <div style={s.card}>
        <p style={s.sectionLabel}>INFORMATIONS</p>
        <form onSubmit={sauvegarder} style={s.form}>
          <div style={s.row}>
            <div style={s.champ}>
              <label style={s.champLabel}>Nom de la PME *</label>
              <input style={s.input} value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Nom de votre entreprise" />
            </div>
            <div style={s.champ}>
              <label style={s.champLabel}>Secteur d'activité</label>
              <input style={s.input} value={form.secteur} onChange={e => setForm({...form, secteur: e.target.value})} placeholder="Ex : Commerce, Services..." />
            </div>
          </div>
          <div style={s.row}>
            <div style={s.champ}>
              <label style={s.champLabel}>Email professionnel *</label>
              <input style={s.input} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contact@mapme.com" />
            </div>
            <div style={s.champ}>
              <label style={s.champLabel}>Téléphone</label>
              <input style={s.input} value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} placeholder="+226 70 00 00 00" />
            </div>
          </div>
          <button type="submit" style={s.btnSauver} disabled={chargement}>
            {chargement ? '⏳ Enregistrement...' : '✓ Sauvegarder les modifications'}
          </button>
        </form>
      </div>

      <div style={s.card}>
        <p style={s.sectionLabel}>SÉCURITÉ</p>
        <div style={s.secuRow}>
          <div>
            <p style={{ color: '#ccc', fontSize: 14, margin: '0 0 4px', fontWeight: 600 }}>Mot de passe</p>
            <p style={{ color: '#444', fontSize: 13, margin: 0 }}>Dernière modification inconnue</p>
          </div>
          <button style={s.btnSecu} onClick={() => setModifMdp(!modifMdp)}>
            {modifMdp ? 'Annuler' : 'Modifier'}
          </button>
        </div>
        {modifMdp && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={s.champLabel}>Mot de passe actuel</label>
              <input style={s.input} type="password" value={mdp.actuel} onChange={e => setMdp({...mdp, actuel: e.target.value})} placeholder="••••••••" />
            </div>
            <div>
              <label style={s.champLabel}>Nouveau mot de passe</label>
              <input style={s.input} type="password" value={mdp.nouveau} onChange={e => setMdp({...mdp, nouveau: e.target.value})} placeholder="••••••••" />
            </div>
            <div>
              <label style={s.champLabel}>Confirmer le nouveau mot de passe</label>
              <input style={s.input} type="password" value={mdp.confirmer} onChange={e => setMdp({...mdp, confirmer: e.target.value})} placeholder="••••••••" />
            </div>
            <button style={s.btnSauver} onClick={() => {
              if (!mdp.nouveau || mdp.nouveau.length < 6) { toast.error('Le nouveau mot de passe doit faire au moins 6 caractères.'); return; }
              if (mdp.nouveau !== mdp.confirmer) { toast.error('Les mots de passe ne correspondent pas.'); return; }
              toast.info('Modification du mot de passe — disponible prochainement.');
              setModifMdp(false);
              setMdp({ actuel: '', nouveau: '', confirmer: '' });
            }}>
              Changer le mot de passe
            </button>
          </div>
        )}
      </div>

      <div style={s.card}>
        <p style={s.sectionLabel}>SESSION</p>
        <div style={s.secuRow}>
          <div>
            <p style={{ color: '#ccc', fontSize: 14, margin: '0 0 4px', fontWeight: 600 }}>Se déconnecter</p>
            <p style={{ color: '#444', fontSize: 13, margin: 0 }}>Vous serez redirigé vers la page d'accueil</p>
          </div>
          <button style={{ ...s.btnSecu, color: '#FF4444', borderColor: '#FF444422' }} onClick={() => {
            localStorage.removeItem('pme_token');
            localStorage.removeItem('pme');
            toast.info('Déconnexion réussie.');
            setTimeout(() => navigate('/'), 800);
          }}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", padding: '32px 24px 80px', maxWidth: 760, margin: '0 auto', boxSizing: 'border-box' },
  entete: { marginBottom: 28 },
  btnRetour: { background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 12, display: 'block' },
  label: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px' },
  titre: { color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 },
  profilCard: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20, padding: '24px 28px' },
  avatarGrand: { alignItems: 'center', background: '#D4AF37', borderRadius: 16, color: '#000', display: 'flex', fontSize: 32, fontWeight: 900, height: 72, justifyContent: 'center', minWidth: 72 },
  profilNom: { color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' },
  profilSecteur: { color: '#555', fontSize: 14, margin: '0 0 10px' },
  badge: { background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.2)', borderRadius: 20, color: '#4CAF50', fontSize: 12, padding: '4px 12px' },
  card: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, marginBottom: 16, padding: '24px 28px' },
  sectionLabel: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 20px' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  champ: { display: 'flex', flexDirection: 'column', gap: 6 },
  champLabel: { color: '#555', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', padding: '11px 14px' },
  btnSauver: { background: '#D4AF37', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 700, marginTop: 4, padding: '12px 24px', alignSelf: 'flex-start' },
  secuRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  btnSecu: { background: 'transparent', border: '1px solid #222', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13, padding: '8px 16px', flexShrink: 0 },
};
