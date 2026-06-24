// PAGE D'ACCUEIL — BCX Finance | Route : / | Auteur : Parfait Eric Yao
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QUESTIONS_IA = [
  { q: "Qu'est-ce que BCX Finance ?", r: "BCX Finance est une plateforme fintech SaaS dédiée aux PME et investisseurs d'Afrique de l'Ouest. Elle permet aux PME de gérer leurs finances, obtenir un score de crédibilité et accéder à des opportunités d'investissement." },
  { q: "Comment fonctionne le Score BCX ?", r: "Le Score BCX est calculé sur 4 critères : le ratio revenus/dépenses (40 pts), la régularité mensuelle (30 pts), le volume traité (20 pts) et l'ancienneté du compte (10 pts). Un score de 80+ vous rend éligible au crédit BCX." },
  { q: "C'est quoi un investisseur sur BCX ?", r: "Un investisseur BCX peut déposer des fonds via mobile money (Voie A) ou crypto (Voie B) et recevoir des tokens BCX en retour. Les tokens représentent sa participation dans l'écosystème fintech BCX." },
  { q: "Comment m'inscrire ?", r: "Cliquez sur 'Je suis une PME' ou 'Je suis un investisseur' sur cette page. L'inscription prend moins de 2 minutes. Vous aurez accès à votre tableau de bord immédiatement après." },
  { q: "Est-ce sécurisé ?", r: "Oui. BCX Finance utilise un chiffrement JWT pour l'authentification, des mots de passe hashés avec bcryptjs, et toutes les transactions blockchain passent par le réseau Sepolia avec vérification on-chain." },
];

export default function Landing() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState('');
  const [chargementIA, setChargementIA] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  const poserQuestion = async (texte) => {
    const q = texte || question;
    if (!q.trim()) return;
    setChargementIA(true);
    setReponse('');
    // Recherche dans les FAQ d'abord
    const faq = QUESTIONS_IA.find(f => q.toLowerCase().includes(f.q.toLowerCase().split(' ')[2] || ''));
    if (faq) {
      setTimeout(() => { setReponse(faq.r); setChargementIA(false); }, 600);
      return;
    }
    // Réponse générique intelligente
    const mots = q.toLowerCase();
    let rep = '';
    if (mots.includes('pme') || mots.includes('entreprise')) rep = "BCX Finance accompagne les PME africaines dans la gestion de leurs finances. Inscrivez-vous gratuitement et commencez à suivre vos revenus, dépenses et score de crédibilité dès aujourd'hui.";
    else if (mots.includes('invest') || mots.includes('token') || mots.includes('bcx')) rep = "Le token BCX est un actif numérique ERC-20 déployé sur le réseau Ethereum Sepolia. Les investisseurs reçoivent des tokens proportionnellement à leurs dépôts. Valeur et liquidité garanties par le smart contract BCX.";
    else if (mots.includes('prix') || mots.includes('gratuit') || mots.includes('cout') || mots.includes('abonnement')) rep = "BCX Finance propose 3 offres : Pionnier (gratuit), Élite et Majeur. L'offre Pionnier donne accès aux fonctionnalités essentielles sans frais. Les offres premium débloquent l'analyse avancée et le support prioritaire.";
    else if (mots.includes('contact') || mots.includes('support') || mots.includes('aide')) rep = "Notre équipe est disponible via le formulaire de contact ci-dessous. Vous pouvez aussi nous joindre directement sur WhatsApp pour un support rapide.";
    else rep = "Je suis l'assistant BCX Finance. Je peux vous renseigner sur nos fonctionnalités, le Score BCX, les offres investisseurs ou la procédure d'inscription. Que souhaitez-vous savoir ?";
    setTimeout(() => { setReponse(rep); setChargementIA(false); }, 800);
  };

  return (
    <div style={s.root}>
      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logo} onClick={() => window.scrollTo(0,0)}>
            BCX <span style={{ color: '#D4AF37' }}>FINANCE</span>
          </div>
          {/* Desktop menu */}
          <div style={s.navLinks}>
            {['À propos', 'Fonctionnalités', 'Solutions', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-').replace('à', 'a')}`} style={s.navLink}>{l}</a>
            ))}
          </div>
          <div style={s.navActions}>
            <button style={s.btnNavSecondaire} onClick={() => navigate('/login')}>Connexion</button>
            <button style={s.btnNavPrimaire} onClick={() => navigate('/pme/inscription')}>S'inscrire</button>
          </div>
          {/* Mobile hamburger */}
          <button style={s.hamburger} onClick={() => setMenuOuvert(!menuOuvert)}>
            <span style={s.bar} /><span style={s.bar} /><span style={s.bar} />
          </button>
        </div>
        {/* Mobile menu */}
        {menuOuvert && (
          <div style={s.mobileMenu}>
            {['À propos', 'Fonctionnalités', 'Solutions', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-').replace('à', 'a')}`} style={s.mobileLien} onClick={() => setMenuOuvert(false)}>{l}</a>
            ))}
            <button style={{ ...s.btnNavSecondaire, width: '100%', marginBottom: 8 }} onClick={() => navigate('/login')}>Connexion</button>
            <button style={{ ...s.btnNavPrimaire, width: '100%' }} onClick={() => navigate('/pme/inscription')}>S'inscrire</button>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🚀 Fintech Apprentice Africa — Promotion 1</div>
          <h1 style={s.heroTitre}>
            La finance africaine,<br />
            <span style={{ color: '#D4AF37' }}>réinventée.</span>
          </h1>
          <p style={s.heroDesc}>
            BCX Finance connecte les PME d'Afrique de l'Ouest aux investisseurs via une plateforme sécurisée, transparente et alimentée par la blockchain.
          </p>
          <div style={s.heroBtns}>
            <button style={s.btnHeroPrimaire} onClick={() => navigate('/pme/inscription')}>
              <span>🏢</span> Je suis une PME
            </button>
            <button style={s.btnHeroSecondaire} onClick={() => navigate('/login')}>
              <span>💼</span> Je suis un investisseur
            </button>
          </div>
          <p style={s.heroSub}>✓ Inscription gratuite &nbsp;&nbsp; ✓ Sans carte bancaire &nbsp;&nbsp; ✓ Prêt en 2 minutes</p>
        </div>
        <div style={s.heroVisuel}>
          <div style={s.dashMock}>
            <div style={s.dashBar}>
              <span style={s.dashDot('#FF5F57')} /><span style={s.dashDot('#FEBC2E')} /><span style={s.dashDot('#28C840')} />
              <span style={{ color: '#333', fontSize: 11, marginLeft: 8 }}>BCX Finance — Dashboard PME</span>
            </div>
            <div style={s.dashBody}>
              <div style={s.dashRow}>
                <div style={s.dashCard('#D4AF37', '1 250 000', 'Solde FCFA')} />
                <div style={s.dashCard('#4CAF50', '83', 'Score BCX')} />
              </div>
              <div style={{ ...s.dashGraphFake, marginTop: 12 }}>
                {[60, 85, 45, 90, 70, 95].map((h, i) => (
                  <div key={i} style={{ width: '13%', height: `${h}%`, background: i % 2 === 0 ? 'rgba(212,175,55,0.6)' : 'rgba(255,68,68,0.4)', borderRadius: '4px 4px 0 0' }} />
                ))}
              </div>
              <div style={s.dashTxList}>
                {['+ 450 000 FCFA — Vente', '- 85 000 FCFA — Loyer', '+ 320 000 FCFA — Prestation'].map((t, i) => (
                  <div key={i} style={s.dashTxItem}>
                    <span style={{ color: t.startsWith('+') ? '#4CAF50' : '#FF4444', fontSize: 11, fontWeight: 700 }}>{t.startsWith('+') ? '▲' : '▼'}</span>
                    <span style={{ color: '#555', fontSize: 11, marginLeft: 6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUI SUIS-JE ─────────────────────────────────────── */}
      <section style={s.section} id="solutions">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>NOS SOLUTIONS</p>
          <h2 style={s.sectionTitre}>Qui êtes-vous ?</h2>
          <p style={s.sectionDesc}>BCX Finance est conçu pour deux types d'utilisateurs avec des besoins différents.</p>
          <div style={s.cardsWho}>
            {/* PME */}
            <div style={s.cardWho}>
              <div style={s.cardWhoIcon}>🏢</div>
              <h3 style={s.cardWhoTitre}>Je suis une PME</h3>
              <p style={s.cardWhoDesc}>Gérez vos finances, suivez vos revenus et dépenses, obtenez votre Score de crédibilité BCX et accédez à des financements.</p>
              <ul style={s.cardWhoList}>
                {['📊 Tableau de bord financier', '🏆 Score BCX (0-100)', '📄 Rapports mensuels PDF', '💳 Saisie de transactions', '📡 Mode offline'].map(f => (
                  <li key={f} style={s.cardWhoItem}>{f}</li>
                ))}
              </ul>
              <button style={s.btnCardPrimaire} onClick={() => navigate('/pme/inscription')}>
                Créer mon compte PME →
              </button>
            </div>
            {/* INVESTISSEUR */}
            <div style={{ ...s.cardWho, borderColor: '#D4AF37', background: 'linear-gradient(160deg, #111 0%, #0d0d0d 100%)' }}>
              <div style={{ ...s.cardWhoIcon, background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>💼</div>
              <h3 style={s.cardWhoTitre}>Je suis un investisseur</h3>
              <p style={s.cardWhoDesc}>Investissez via mobile money ou crypto, recevez des tokens BCX et suivez vos rendements en temps réel sur la blockchain.</p>
              <ul style={s.cardWhoList}>
                {['💰 Dépôt Voie A (FCFA/Mobile)', '🔗 Dépôt Voie B (Crypto/ETH)', '🪙 Tokens BCX on-chain', '👥 Gestion des ayants droit', '📈 Tableau de bord investisseur'].map(f => (
                  <li key={f} style={s.cardWhoItem}>{f}</li>
                ))}
              </ul>
              <button style={s.btnCardSecondaire} onClick={() => navigate('/login')}>
                Accéder à mon espace →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── À PROPOS ─────────────────────────────────────────── */}
      <section style={{ ...s.section, background: '#080808' }} id="a-propos">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>À PROPOS</p>
          <h2 style={s.sectionTitre}>Pourquoi BCX Finance ?</h2>
          <div style={s.aproposGrid}>
            <div style={s.aproposTexte}>
              <p style={s.aproposP}>En Afrique de l'Ouest, plus de <strong style={{ color: '#D4AF37' }}>3 millions de PME</strong> n'ont pas accès au financement formel faute de traçabilité financière et de score de crédit reconnu.</p>
              <p style={s.aproposP}>BCX Finance change ça. Notre algorithme Score BCX analyse l'historique financier de chaque PME et génère un score de crédibilité compréhensible par les banques et les investisseurs.</p>
              <p style={s.aproposP}>En parallèle, notre module investisseur connecte des capitaux privés aux PME vérifiées via la blockchain, garantissant transparence et traçabilité à chaque transaction.</p>
            </div>
            <div style={s.aproposStats}>
              {[
                { val: '3M+', label: 'PME cibles en Afrique de l\'Ouest' },
                { val: '0-100', label: 'Score BCX — indicateur universel' },
                { val: '100%', label: 'Transactions tracées on-chain' },
                { val: '< 2min', label: 'Temps d\'inscription' },
              ].map(st => (
                <div key={st.label} style={s.statBox}>
                  <span style={s.statVal}>{st.val}</span>
                  <span style={s.statLabel}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FONCTIONNALITÉS ──────────────────────────────────── */}
      <section style={s.section} id="fonctionnalites">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>FONCTIONNALITÉS</p>
          <h2 style={s.sectionTitre}>Tout ce dont vous avez besoin</h2>
          <div style={s.featGrid}>
            {[
              { icon: '📊', titre: 'Dashboard temps réel', desc: 'Visualisez revenus, dépenses et solde en un coup d\'œil avec des graphiques interactifs.' },
              { icon: '🏆', titre: 'Score BCX', desc: 'Un algorithme sur 4 critères calcule votre crédibilité financière de 0 à 100 points.' },
              { icon: '📄', titre: 'Rapports PDF', desc: 'Exportez vos rapports mensuels en PDF pour vos partenaires, banques et administrations.' },
              { icon: '🔗', titre: 'Blockchain Ethereum', desc: 'Toutes les transactions d\'investissement sont vérifiables sur Sepolia Testnet.' },
              { icon: '📡', titre: 'Mode offline', desc: 'Continuez à saisir vos transactions même sans connexion. Sync automatique au retour.' },
              { icon: '🔒', titre: 'Sécurité JWT', desc: 'Authentification par token avec rôles séparés PME / Investisseur / Admin.' },
            ].map(f => (
              <div key={f.titre} style={s.featCard}>
                <span style={s.featIcon}>{f.icon}</span>
                <h3 style={s.featTitre}>{f.titre}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT IA ─────────────────────────────────────────── */}
      <section style={{ ...s.section, background: '#080808' }} id="contact">
        <div style={{ ...s.sectionInner, maxWidth: 680 }}>
          <p style={s.sectionLabel}>ASSISTANT IA</p>
          <h2 style={s.sectionTitre}>Une question ? Je réponds.</h2>
          <p style={s.sectionDesc}>Notre assistant BCX répond à toutes vos questions sur la plateforme, les fonctionnalités et les offres.</p>

          {/* FAQ rapide */}
          <div style={s.faqRapide}>
            {QUESTIONS_IA.slice(0, 4).map(f => (
              <button key={f.q} style={s.faqBtn} onClick={() => { setQuestion(f.q); poserQuestion(f.q); }}>
                {f.q}
              </button>
            ))}
          </div>

          {/* Champ libre */}
          <div style={s.iaInput}>
            <input
              style={s.iaChamp}
              placeholder="Posez votre question..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && poserQuestion()}
            />
            <button style={s.iaBtn} onClick={() => poserQuestion()} disabled={chargementIA}>
              {chargementIA ? '...' : '→'}
            </button>
          </div>

          {/* Réponse */}
          {(reponse || chargementIA) && (
            <div style={s.iaReponse}>
              <div style={s.iaAvatar}>BCX</div>
              <p style={s.iaTexte}>{chargementIA ? '⏳ En train de répondre...' : reponse}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.logo}>BCX <span style={{ color: '#D4AF37' }}>FINANCE</span></div>
          <p style={{ color: '#333', fontSize: 13, margin: '8px 0 0' }}>Fintech Apprentice Africa — Promotion 1 — Juin 2026</p>
          <div style={s.footerLinks}>
            <span style={s.footerLink} onClick={() => navigate('/pme/inscription')}>Inscription PME</span>
            <span style={s.footerLink} onClick={() => navigate('/login')}>Espace Investisseur</span>
          </div>
          <p style={{ color: '#1a1a1a', fontSize: 11, margin: '16px 0 0' }}>© 2026 BCX Finance — Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}

// ── HELPERS INLINE ────────────────────────────────────────────
const dashDot = (c) => ({ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: c, marginRight: 4 });
const dashCard = (color, val, label) => (
  <div style={{ flex: 1, background: '#0d0d0d', border: `1px solid ${color}22`, borderLeft: `3px solid ${color}`, borderRadius: 8, padding: '10px 12px' }}>
    <p style={{ color: '#444', fontSize: 9, margin: '0 0 4px', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</p>
    <p style={{ color, fontSize: 18, fontWeight: 900, margin: 0 }}>{val}</p>
  </div>
);
Object.assign(Landing.prototype || {}, { dashDot, dashCard });

// ── STYLES ────────────────────────────────────────────────────
const s = {
  root: { background: '#0A0A0A', fontFamily: "'Inter', sans-serif", minHeight: '100vh', color: '#fff' },

  // NAV
  nav: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #111', backdropFilter: 'blur(12px)' },
  navInner: { maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 32 },
  logo: { fontSize: 20, fontWeight: 900, letterSpacing: 3, color: '#fff', cursor: 'pointer', userSelect: 'none' },
  navLinks: { display: 'flex', gap: 28, flex: 1 },
  navLink: { color: '#555', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' },
  navActions: { display: 'flex', gap: 10 },
  btnNavSecondaire: { background: 'transparent', border: '1px solid #222', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 13, padding: '8px 16px' },
  btnNavPrimaire: { background: '#D4AF37', border: 'none', borderRadius: 8, color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: '8px 18px' },
  hamburger: { display: 'none', flexDirection: 'column', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 'auto' },
  bar: { width: 22, height: 2, background: '#888', borderRadius: 2, display: 'block' },
  mobileMenu: { padding: '16px 24px', borderTop: '1px solid #111', display: 'flex', flexDirection: 'column', gap: 12 },
  mobileLien: { color: '#888', fontSize: 14, textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #111' },

  // HERO
  hero: { maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' },
  heroContent: { flex: 1, minWidth: 280 },
  heroBadge: { display: 'inline-block', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 20, color: '#D4AF37', fontSize: 12, fontWeight: 600, padding: '6px 14px', marginBottom: 24 },
  heroTitre: { color: '#fff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: -1 },
  heroDesc: { color: '#555', fontSize: 17, lineHeight: 1.7, margin: '0 0 32px', maxWidth: 460 },
  heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  btnHeroPrimaire: { background: '#fff', border: 'none', borderRadius: 12, color: '#000', cursor: 'pointer', fontSize: 15, fontWeight: 700, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 8 },
  btnHeroSecondaire: { background: 'transparent', border: '1px solid #D4AF37', borderRadius: 12, color: '#D4AF37', cursor: 'pointer', fontSize: 15, fontWeight: 600, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 8 },
  heroSub: { color: '#2a2a2a', fontSize: 12 },
  heroVisuel: { flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' },

  // MOCK DASHBOARD
  dashMock: { width: '100%', maxWidth: 380, background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' },
  dashBar: { background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '10px 14px', display: 'flex', alignItems: 'center' },
  dashBody: { padding: 16 },
  dashRow: { display: 'flex', gap: 10 },
  dashGraphFake: { height: 80, display: 'flex', alignItems: 'flex-end', gap: '2%', background: '#0d0d0d', borderRadius: 8, padding: '8px 12px' },
  dashTxList: { marginTop: 10 },
  dashTxItem: { display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #0d0d0d' },

  // SECTIONS
  section: { padding: '80px 0' },
  sectionInner: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  sectionLabel: { color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 8px' },
  sectionTitre: { color: '#fff', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, margin: '0 0 12px' },
  sectionDesc: { color: '#555', fontSize: 15, margin: '0 0 40px', maxWidth: 520 },

  // CARDS QUI
  cardsWho: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 },
  cardWho: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 20, padding: 32 },
  cardWhoIcon: { fontSize: 32, width: 64, height: 64, borderRadius: 16, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cardWhoTitre: { color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 12px' },
  cardWhoDesc: { color: '#555', fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' },
  cardWhoList: { listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 },
  cardWhoItem: { color: '#666', fontSize: 14 },
  btnCardPrimaire: { background: '#fff', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '12px 20px', width: '100%' },
  btnCardSecondaire: { background: '#D4AF37', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '12px 20px', width: '100%' },

  // À PROPOS
  aproposGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' },
  aproposTexte: {},
  aproposP: { color: '#555', fontSize: 15, lineHeight: 1.8, margin: '0 0 16px' },
  aproposStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  statBox: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 6 },
  statVal: { color: '#D4AF37', fontSize: 28, fontWeight: 900 },
  statLabel: { color: '#444', fontSize: 12 },

  // FEATURES
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  featCard: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: 24 },
  featIcon: { fontSize: 28, display: 'block', marginBottom: 12 },
  featTitre: { color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 8px' },
  featDesc: { color: '#555', fontSize: 13, lineHeight: 1.6, margin: 0 },

  // IA
  faqRapide: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  faqBtn: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 20, color: '#555', cursor: 'pointer', fontSize: 12, padding: '8px 14px' },
  iaInput: { display: 'flex', gap: 10, marginBottom: 16 },
  iaChamp: { flex: 1, background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', padding: '12px 16px' },
  iaBtn: { background: '#D4AF37', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 18, fontWeight: 700, padding: '0 20px', minWidth: 48 },
  iaReponse: { background: '#111', border: '1px solid #1a1a1a', borderLeft: '3px solid #D4AF37', borderRadius: 12, display: 'flex', gap: 12, padding: 20 },
  iaAvatar: { background: '#D4AF37', borderRadius: 8, color: '#000', fontSize: 10, fontWeight: 800, height: 32, minWidth: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 0.5 },
  iaTexte: { color: '#888', fontSize: 14, lineHeight: 1.7, margin: 0 },

  // FOOTER
  footer: { background: '#080808', borderTop: '1px solid #111', padding: '40px 24px' },
  footerInner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  footerLinks: { display: 'flex', gap: 24, justifyContent: 'center', marginTop: 16 },
  footerLink: { color: '#333', fontSize: 13, cursor: 'pointer' },
};
