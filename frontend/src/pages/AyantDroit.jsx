import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AyantsDroit() {
  const navigate = useNavigate();
  const [ayants, setAyants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', lien_parente: ''
  });
  const [msg, setMsg] = useState('');

  // Données mockées — à remplacer par appel API
  useEffect(() => {
    setAyants([
      {
        id: '1',
        nom: 'Diallo',
        prenom: 'Fatoumata',
        email: 'fatoumata@email.com',
        lien_parente: 'Épouse',
        statut: 'en_attente'
      }
    ]);
  }, []);

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.lien_parente) {
      setMsg('Nom, prénom et lien de parenté sont obligatoires');
      return;
    }
    setLoading(true);
    try {
      // TODO : appel API quand le backend sera prêt
      // await ayantsDroitService.ajouter(form);
      setAyants(prev => [...prev, { ...form, id: Date.now().toString(), statut: 'en_attente' }]);
      setForm({ nom: '', prenom: '', email: '', lien_parente: '' });
      setShowForm(false);
      setMsg('✅ Ayant droit ajouté, en attente de validation');
    } catch (err) {
      setMsg('❌ Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const statutColor = { en_attente: '#F5A623', valide: '#4CAF50', refuse: '#FF4444' };
  const statutLabel = { en_attente: 'En attente', valide: 'Validé', refuse: 'Refusé' };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <img src="/logo.jpeg" alt="BCX Finance" style={{ height: 36, objectFit: 'contain' }} />
        <button style={styles.backBtn} onClick={() => navigate('/profil')}>← Profil</button>
      </nav>

      <div style={styles.content}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Ayants droit</h1>
          <button style={styles.btnAjouter} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '+ Ajouter'}
          </button>
        </div>

        <p style={styles.sub}>
          Désignez les personnes qui hériteront de vos BCX tokens. Chaque ajout est validé par BCX Finance.
        </p>

        {/* FORMULAIRE */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Nouvel ayant droit</h3>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Prénom *</label>
                <input
                  style={styles.input}
                  placeholder="Fatoumata"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Nom *</label>
                <input
                  style={styles.input}
                  placeholder="Diallo"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  placeholder="email@exemple.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Lien de parenté *</label>
                <select
                  style={styles.input}
                  value={form.lien_parente}
                  onChange={(e) => setForm({ ...form, lien_parente: e.target.value })}
                >
                  <option value="">Sélectionner...</option>
                  <option value="Époux/Épouse">Époux / Épouse</option>
                  <option value="Fils">Fils</option>
                  <option value="Fille">Fille</option>
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Frère">Frère</option>
                  <option value="Sœur">Sœur</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
            {msg && (
              <p style={{ color: msg.startsWith('✅') ? '#4CAF50' : '#FF4444', fontSize: '13px' }}>
                {msg}
              </p>
            )}
            <button
              style={loading ? styles.btnDisabled : styles.btnSoumettre}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Soumettre'}
            </button>
          </div>
        )}

        {msg && !showForm && (
          <p style={{
            color: msg.startsWith('✅') ? '#4CAF50' : '#FF4444',
            fontSize: '13px', marginBottom: '16px'
          }}>
            {msg}
          </p>
        )}

        {/* LISTE */}
        {ayants.length === 0 ? (
          <div style={styles.empty}>
            <p>Aucun ayant droit désigné.</p>
            <p style={{ color: '#555', fontSize: '13px' }}>
              Ajoutez un ayant droit pour sécuriser votre investissement.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {ayants.map((a) => (
              <div key={a.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.name}>{a.prenom} {a.nom}</p>
                    <p style={styles.lien}>{a.lien_parente} {a.email ? `— ${a.email}` : ''}</p>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: '700',
                    padding: '4px 12px', borderRadius: '20px',
                    color: statutColor[a.statut],
                    background: `rgba(${a.statut === 'valide' ? '76,175,80' : a.statut === 'refuse' ? '255,68,68' : '245,166,35'}, 0.08)`,
                    border: `1px solid rgba(${a.statut === 'valide' ? '76,175,80' : a.statut === 'refuse' ? '255,68,68' : '245,166,35'}, 0.2)`,
                  }}>
                    {statutLabel[a.statut]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
  backBtn: {
    background: 'transparent', border: '1px solid #2a2a2a', color: '#888',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
  },
  content: { maxWidth: '700px', margin: '0 auto', padding: '32px 24px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  title: { color: '#fff', fontSize: '24px', fontWeight: '800', margin: 0 },
  sub: { color: '#555', fontSize: '13px', marginBottom: '28px' },
  formCard: {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px',
    padding: '24px', marginBottom: '24px',
  },
  formTitle: { color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#aaa', fontSize: '13px' },
  input: {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px',
    padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none',
  },
  btnSoumettre: {
    background: 'linear-gradient(135deg, #D4AF37, #F5E17A)', color: '#0A0A0A',
    border: 'none', borderRadius: '8px', padding: '12px 24px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  btnDisabled: {
    background: '#2a2a2a', color: '#555', border: 'none', borderRadius: '8px',
    padding: '12px 24px', fontSize: '14px', cursor: 'not-allowed',
  },
  btnAjouter: {
    background: 'rgba(212,175,55,0.1)', border: '1px solid #D4AF37',
    borderRadius: '8px', padding: '8px 18px', color: '#D4AF37',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  empty: {
    background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px',
    padding: '40px', textAlign: 'center', color: '#555',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#fff', fontSize: '15px', fontWeight: '600', margin: '0 0 4px' },
  lien: { color: '#555', fontSize: '13px', margin: 0 },
};