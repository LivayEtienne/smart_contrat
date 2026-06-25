// LANDING PAGE — BCX Finance | Auteur : Parfait Eric Yao
import { useState, useEffect } from 'react';
import AfriqueSection from '../components/PME/AfriqueSection';
import { useNavigate } from 'react-router-dom';

const FAQ = [
  { q: "Qu'est-ce que BCX Finance ?", r: "BCX Finance est une plateforme SaaS dédiée aux PME et investisseurs d'Afrique de l'Ouest. Elle permet aux PME de piloter leurs finances et d'obtenir un Score BCX reconnu par les banques." },
  { q: "Comment fonctionne le Score BCX ?", r: "Le Score BCX (0–100) est calculé sur 4 critères : ratio revenus/dépenses (40 pts), régularité mensuelle (30 pts), volume traité (20 pts), ancienneté du compte (10 pts). Un score ≥ 80 vous rend éligible au crédit BCX." },
  { q: "Qu'est-ce qu'un token BCX ?", r: "Le token BCX est un actif numérique ERC-20 déployé sur Ethereum Sepolia. Les investisseurs reçoivent des tokens proportionnellement à leurs dépôts validés, traçables on-chain." },
  { q: "Comment m'inscrire ?", r: "Cliquez sur 'Créer mon compte PME'. L'inscription prend moins de 2 minutes, sans carte bancaire requise." },
  { q: "Est-ce sécurisé ?", r: "Oui. BCX utilise JWT pour l'authentification, bcryptjs pour le hashage des mots de passe, et toutes les transactions blockchain sont vérifiables sur Etherscan Sepolia." },
  { q: "C'est gratuit ?", r: "L'offre Pionnier est 100% gratuite : dashboard, Score BCX, rapports mensuels. Des offres premium débloquent des analyses avancées et un support prioritaire." },
];

const PAYS_LISTE = [
  { code: 'SN', nom: 'Sénégal' }, { code: 'CI', nom: "Côte d'Ivoire" },
  { code: 'BF', nom: 'Burkina Faso' }, { code: 'ML', nom: 'Mali' },
  { code: 'GN', nom: 'Guinée' }, { code: 'TG', nom: 'Togo' },
  { code: 'BJ', nom: 'Bénin' }, { code: 'NE', nom: 'Niger' },
  { code: 'CM', nom: 'Cameroun' }, { code: 'NG', nom: 'Nigéria' },
  { code: 'GH', nom: 'Ghana' }, { code: 'CD', nom: 'RD Congo' },
];

const PILLS_PAYS = [
  { flag: '🇨🇮', nom: "Côte d'Ivoire" }, { flag: '🇸🇳', nom: 'Sénégal' },
  { flag: '🇲🇱', nom: 'Mali' }, { flag: '🇧🇯', nom: 'Bénin' },
  { flag: '🇧🇫', nom: 'Burkina Faso' }, { flag: '🇹🇬', nom: 'Togo' },
  { flag: '🇳🇪', nom: 'Niger' }, { flag: '🇨🇲', nom: 'Cameroun' },
  { flag: '🇬🇳', nom: 'Guinée' }, { flag: '🇳🇬', nom: 'Nigéria' },
  { flag: '🇨🇩', nom: 'RD Congo' }, { flag: '🇬🇭', nom: 'Ghana' },
];

export default function Landing() {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('pme');
  const [iaQ, setIaQ] = useState('');
  const [iaR, setIaR] = useState('');
  const [iaLoading, setIaLoading] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { n += 2; setScoreAnim(Math.min(n, 83)); if (n >= 83) clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (hash) => {
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const ask = (txt) => {
    const q = txt || iaQ;
    if (!q.trim()) return;
    setIaLoading(true); setIaR('');
    const found = FAQ.find(f => f.q.toLowerCase().split(' ').some(w => w.length > 3 && q.toLowerCase().includes(w)));
    setTimeout(() => {
      if (found) setIaR(found.r);
      else {
        const m = q.toLowerCase();
        if (m.includes('pme') || m.includes('entreprise')) setIaR("BCX Finance accompagne les PME africaines. Inscrivez-vous gratuitement et pilotez vos revenus, dépenses et Score BCX dès aujourd'hui.");
        else if (m.includes('invest') || m.includes('token')) setIaR("Les investisseurs déposent via mobile money ou crypto et reçoivent des tokens BCX ERC-20 tracés on-chain sur Ethereum Sepolia.");
        else if (m.includes('prix') || m.includes('gratuit')) setIaR("L'offre Pionnier est 100% gratuite. Des offres premium débloquent analyses avancées et support prioritaire.");
        else setIaR("Je suis l'assistant BCX Finance. Posez-moi une question sur les fonctionnalités, le Score BCX, les dépôts investisseurs ou l'inscription.");
      }
      setIaLoading(false);
    }, 700);
  };

  const FEATURES = {
    pme: [
      { icon: '💳', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', titre: 'Suivi des recettes et dépenses', desc: 'Enregistrez chaque vente et achat en quelques secondes depuis votre téléphone.' },
      { icon: '◎', color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', titre: 'Score BCX sur 100 points', desc: 'Un score de crédibilité calculé sur la régularité, le solde et la stabilité des revenus.' },
      { icon: '📄', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', titre: 'Rapports PDF bancaires', desc: 'Générez un rapport mensuel prêt à présenter à votre banque ou partenaire financier.' },
      { icon: '📡', color: '#f97316', bg: 'rgba(249,115,22,0.08)', titre: 'Mode hors connexion', desc: 'Continuez à saisir vos transactions sans réseau. Synchronisation automatique au retour.' },
      { icon: '🔔', color: '#a855f7', bg: 'rgba(168,85,247,0.08)', titre: 'Alertes intelligentes', desc: 'Trésorerie faible, dépense anormale : recevez des conseils personnalisés au bon moment.' },
      { icon: '🔒', color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', titre: 'Données protégées', desc: 'Vos informations financières sont privées et sécurisées, accessibles uniquement par vous.' },
    ],
    inv: [
      { icon: '💰', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', titre: 'Dépôt Voie A — FCFA', desc: 'Investissez via mobile money (Orange, Wave, MTN). Attribution automatique de tokens BCX.' },
      { icon: '🔗', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', titre: 'Dépôt Voie B — Crypto', desc: 'Connectez MetaMask et déposez en ETH. Transfert de tokens BCX on-chain instantané.' },
      { icon: '🪙', color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', titre: 'Tokens BCX ERC-20', desc: 'Recevez des tokens BCX proportionnels à vos dépôts, vérifiables sur Etherscan.' },
      { icon: '👥', color: '#a855f7', bg: 'rgba(168,85,247,0.08)', titre: 'Gestion des ayants droit', desc: 'Désignez et gérez vos bénéficiaires directement depuis la plateforme.' },
      { icon: '📊', color: '#f97316', bg: 'rgba(249,115,22,0.08)', titre: 'Tableau de bord complet', desc: 'Suivez vos dépôts, statuts et tokens reçus en temps réel.' },
      { icon: '🔒', color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', titre: 'Sécurité blockchain', desc: 'Chaque transaction on-chain avec tx_hash vérifiable. Transparence totale.' },
    ],
  };

  return (
    <div style={S.root}>

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <header style={{ ...S.nav, ...(scrolled ? S.navScrolled : {}) }}>
        <div style={S.navIn}>
          <div style={S.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.jpeg" alt="BCX Finance" style={{ height: 40, objectFit: 'contain' }} />
          </div>
          <nav style={S.navLinks}>
            {[['À propos','#a-propos'],['Fonctionnalités','#fonctionnalites'],['Solutions','#solutions'],['Contact','#contact']].map(([l,h]) => (
              <span key={l} style={S.navLink} onClick={() => scrollTo(h)}>{l}</span>
            ))}
          </nav>
          <div style={S.navCtas}>
            <button style={S.btnGhost} onClick={() => nav('/login')}>Investisseur</button>
            <button style={S.btnGhost} onClick={() => nav('/pme/connexion')}>PME</button>
            <button style={S.btnOr} onClick={() => nav('/pme/inscription')}>Créer un compte</button>
          </div>
          <button style={S.ham} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ ...S.hamL, transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ ...S.hamL, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...S.hamL, transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
        {menuOpen && (
          <div style={S.mobileMenu}>
            {[['À propos','#a-propos'],['Fonctionnalités','#fonctionnalites'],['Solutions','#solutions'],['Contact','#contact']].map(([l,h]) => (
              <span key={l} style={S.mobileLink} onClick={() => scrollTo(h)}>{l}</span>
            ))}
            <button style={{ ...S.btnGhost, width: '100%', marginTop: 8 }} onClick={() => nav('/login')}>Se connecter</button>
            <button style={{ ...S.btnOr, width: '100%', marginTop: 8 }} onClick={() => nav('/pme/inscription')}>Créer un compte</button>
          </div>
        )}
      </header>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section style={S.hero}>
        <div style={S.heroGrid} />
        <div style={S.heroHalo} />
        <div style={S.heroIn}>
          <div style={S.heroLeft}>
            <div style={S.pill}>
              <span style={S.pillDot} />
              Conçu pour les PME africaines
            </div>
            <h1 style={S.h1}>
              Donnez de la valeur<br />à votre activité avec le<br />
              <span style={S.h1Or}>Score BCX.</span>
            </h1>
            <p style={S.heroSub}>Enregistrez vos recettes et dépenses, suivez votre santé financière et obtenez un rapport prêt à présenter à votre banque.</p>
            <div style={S.heroBtns}>
              <button style={S.btnHeroOr} onClick={() => nav('/pme/inscription')}>Créer mon compte gratuit →</button>
              <button style={S.btnHeroGhost} onClick={() => nav('/login')}>Espace investisseur</button>
            </div>
            <div style={S.heroStats}>
              {[['3M+','PME cibles'],['0–100','Score BCX'],['100%','On-chain']].map(([v,l]) => (
                <div key={l} style={S.heroStat}>
                  <span style={S.heroStatVal}>{v}</span>
                  <span style={S.heroStatLabel}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={S.heroRight}>
            <div style={S.heroImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=560&h=680&fit=crop&crop=top&q=88"
                alt="Entrepreneur africaine BCX Finance"
                style={S.heroImg}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=560&h=680&fit=crop&crop=top&q=88'; }}
              />
              <div style={S.heroImgFade} />
              <div style={S.floatCard1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(76,175,80,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4CAF50', fontWeight: 700 }}>+</div>
                  <div>
                    <p style={S.floatLabel}>Nouvelle recette</p>
                    <p style={S.floatVal}>+450 000 F CFA</p>
                  </div>
                </div>
              </div>
              <div style={S.floatCard2}>
                <p style={S.floatLabel2}>Score BCX</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={S.floatScore}>{scoreAnim}</span>
                  <span style={{ color: '#555', fontSize: 14 }}>/100</span>
                </div>
                <div style={S.floatScoreBar}>
                  <div style={{ ...S.floatScoreBarFill, width: `${scoreAnim}%`, transition: 'width 0.1s' }} />
                </div>
                <p style={S.floatNiveau}>Bon niveau de crédibilité</p>
              </div>
              <div style={S.floatCard3}>
                <span style={{ fontSize: 18 }}>📄</span>
                <div>
                  <p style={S.floatLabel}>Rapport juin 2026</p>
                  <p style={{ ...S.floatVal, color: '#D4AF37' }}>Prêt à télécharger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BANDE TECH ══════════════════════════════════════════ */}
      <div style={S.bandePart}>
        <span style={S.bandeLabel}>Technologie</span>
        {['Ethereum Sepolia', 'Sequelize ORM', 'Node.js / Express', 'React / Vite', 'JWT Auth', 'bcryptjs'].map(t => (
          <span key={t} style={S.bandeTech}>{t}</span>
        ))}
      </div>

      {/* ══ FONCTIONNALITÉS ══════════════════════════════════════ */}
      <section style={S.section} id="fonctionnalites">
        <div style={S.inner}>
          <div style={S.sHead}>
            <p style={S.eyebrow}>FONCTIONNALITÉS</p>
            <h2 style={S.h2}>Tout ce dont votre PME a besoin.</h2>
            <p style={S.lead}>Une suite complète pour piloter votre activité et prouver votre valeur aux financeurs.</p>
          </div>
          <div style={S.tabs}>
            {[['pme','Pour les PME'],['inv','Pour les investisseurs']].map(([k,l]) => (
              <button key={k} style={{ ...S.tab, ...(activeTab === k ? S.tabOn : {}) }} onClick={() => setActiveTab(k)}>{l}</button>
            ))}
          </div>
          <div style={S.featGrid}>
            {FEATURES[activeTab].map(f => (
              <div key={f.titre} style={S.featCard}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = f.color + '44'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1a1a1a'; }}>
                <div style={{ ...S.featIconWrap, background: f.bg, border: `1px solid ${f.color}22` }}>
                  <span style={{ fontSize: 22 }}>{f.icon}</span>
                </div>
                <h4 style={S.featTitre}>{f.titre}</h4>
                <p style={S.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOLUTIONS ════════════════════════════════════════════ */}
      <section style={{ ...S.section, background: '#060606' }} id="solutions">
        <div style={S.inner}>
          <div style={S.sHead}>
            <p style={S.eyebrow}>NOS SOLUTIONS</p>
            <h2 style={S.h2}>Deux univers, une plateforme.</h2>
          </div>
          <div style={S.solGrid}>
            <div style={{ ...S.solCard, borderTop: '3px solid #D4AF37' }}>
              <div style={{ ...S.solIcon, background: 'rgba(212,175,55,0.08)' }}>🏢</div>
              <h3 style={S.solTitre}>Je suis une PME</h3>
              <p style={S.solDesc}>Gérez vos finances, construisez votre Score BCX et ouvrez la porte aux financements formels.</p>
              <ul style={S.solList}>
                {['Dashboard financier temps réel','Score BCX certifiable','Rapports PDF mensuels','Saisie offline + sync','Historique complet'].map(f => (
                  <li key={f} style={S.solItem}><span style={S.solDot} />{f}</li>
                ))}
              </ul>
              <button style={S.btnSolOr} onClick={() => nav('/pme/inscription')}>Créer mon compte PME →</button>
            </div>
            <div style={{ ...S.solCard, borderTop: '3px solid #555' }}>
              <div style={{ ...S.solIcon, background: '#111' }}>💼</div>
              <h3 style={S.solTitre}>Je suis un investisseur</h3>
              <p style={S.solDesc}>Investissez via mobile money ou crypto, recevez des tokens BCX et suivez vos rendements on-chain.</p>
              <ul style={S.solList}>
                {['Dépôt Voie A (FCFA/Mobile)','Dépôt Voie B (ETH/MetaMask)','Tokens BCX ERC-20','Gestion des ayants droit','Dashboard investisseur complet'].map(f => (
                  <li key={f} style={S.solItem}><span style={{ ...S.solDot, background: '#333' }} />{f}</li>
                ))}
              </ul>
              <button style={S.btnSolBlanc} onClick={() => nav('/login')}>Accéder à mon espace →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ À PROPOS + CARTE AFRIQUE ═════════════════════════════ */}
      <AfriqueSection />

      {/* ══ AGENT IA ═════════════════════════════════════════════ */}
      <section style={{ ...S.section, background: '#060606' }} id="contact">
        <div style={{ ...S.inner, maxWidth: 800 }}>
          <div style={S.sHead}>
            <p style={S.eyebrow}>ASSISTANT BCX</p>
            <h2 style={S.h2}>Une question ? Je réponds.</h2>
            <p style={S.lead}>Notre assistant connaît chaque détail de BCX Finance. Posez votre question en français.</p>
          </div>
          <div style={S.suggestions}>
            {FAQ.slice(0, 4).map(f => (
              <button key={f.q} style={S.sugg}
                onClick={() => { setIaQ(f.q); ask(f.q); }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#D4AF37'; e.currentTarget.style.color='#D4AF37'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#1a1a1a'; e.currentTarget.style.color='#555'; }}>
                {f.q}
              </button>
            ))}
          </div>
          <div style={S.iaBox}>
            <div style={S.iaAv}>BCX</div>
            <input style={S.iaIn} placeholder="Posez votre question sur BCX Finance..."
              value={iaQ} onChange={e => setIaQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} />
            <button style={{ ...S.btnOr, padding: '0 20px', fontSize: 18, minWidth: 48, height: 48, borderRadius: 10 }}
              onClick={() => ask()} disabled={iaLoading}>
              {iaLoading ? '·' : '↑'}
            </button>
          </div>
          {(iaR || iaLoading) && (
            <div style={S.iaReponse}>
              <div style={S.iaAv}>BCX</div>
              <p style={S.iaTexte}>{iaLoading ? 'En train de répondre...' : iaR}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════════ */}
      <section style={S.cta}>
        <div style={S.ctaHalo} />
        <div style={S.ctaIn}>
          <h2 style={S.ctaH2}>Prêt à rejoindre BCX Finance ?</h2>
          <p style={S.ctaP}>Inscription gratuite. Aucune carte bancaire requise. Tableau de bord accessible immédiatement.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ ...S.btnHeroOr, fontSize: 16 }} onClick={() => nav('/pme/inscription')}>Créer mon compte PME →</button>
            <button style={{ ...S.btnHeroGhost, fontSize: 16 }} onClick={() => nav('/login')}>Espace investisseur</button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={S.footer}>

        {/* ── Bande newsletter ── */}
        <div style={S.ftNL}>
          <div style={S.ftNLIn}>
            <div style={S.ftNLLeft}>
              <span style={S.ftNLBadge}>✉ Newsletter</span>
              <h3 style={S.ftNLTitre}>Restez à l'avant-garde de la fintech africaine</h3>
              <p style={S.ftNLDesc}>Conseils financiers, nouvelles fonctionnalités, témoignages PME — chaque mois.</p>
            </div>
            <div style={S.ftNLRight}>
              <div style={S.ftNLRow}>
                <div style={S.ftNLField}>
                  <span style={{ color: '#444', fontSize: 15 }}>✉</span>
                  <input style={S.ftNLInput} type="email" placeholder="votre@email.com" />
                </div>
                <button style={S.ftNLBtn}>S'abonner →</button>
              </div>
              <p style={S.ftNLNote}>Gratuit · Désinscription en 1 clic · Pas de spam</p>
            </div>
          </div>
        </div>

        {/* ── Corps du footer ── */}
        <div style={S.ftBody}>
          <div style={S.ftInner}>

            {/* Colonne marque */}
            <div style={S.ftBrand}>
              <div style={S.ftLogo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src="/logo.jpeg" alt="BCX Finance" style={{ height: 44, objectFit: 'contain' }} />
              </div>
              <p style={S.ftSlogan}>La finance africaine réinventée.</p>
              <p style={S.ftAbout}>Plateforme SaaS pour les PME et les investisseurs d'Afrique de l'Ouest. Scoring financier, tokens BCX on-chain.</p>
              <div style={S.ftCountries}>
                {['🇸🇳','🇨🇮','🇲🇱','🇧🇫','🇹🇬','🇧🇯','🇳🇪','🇨🇲'].map(f => (
                  <span key={f} style={S.ftCountryFlag}>{f}</span>
                ))}
              </div>
              <div style={S.ftSocials}>
                {[['𝕏','Twitter'],['in','LinkedIn'],['f','Facebook'],['ig','Instagram']].map(([s,label]) => (
                  <div key={s} title={label} style={S.ftSocial}>{s}</div>
                ))}
              </div>
            </div>

            {/* Colonne PME */}
            <div style={S.ftCol}>
              <p style={S.ftColTitle}>Espace PME</p>
              <div style={S.ftDivider} />
              <span style={S.ftLink} onClick={() => nav('/pme/inscription')}>Créer un compte PME</span>
              <span style={S.ftLink} onClick={() => nav('/pme/connexion')}>Se connecter (PME)</span>
              <span style={S.ftLink} onClick={() => scrollTo('#fonctionnalites')}>Fonctionnalités</span>
              <span style={S.ftLink} onClick={() => scrollTo('#a-propos')}>À propos</span>
            </div>

            {/* Colonne Investisseurs */}
            <div style={S.ftCol}>
              <p style={S.ftColTitle}>Espace Investisseur</p>
              <div style={S.ftDivider} />
              <span style={S.ftLink} onClick={() => nav('/inscription')}>Créer un compte</span>
              <span style={S.ftLink} onClick={() => nav('/login')}>Se connecter</span>
              <span style={S.ftLink} onClick={() => scrollTo('#solutions')}>Nos solutions</span>
              <span style={S.ftLink} onClick={() => scrollTo('#fonctionnalites')}>Voie A / Voie B</span>
            </div>

            {/* Colonne Ressources */}
            <div style={S.ftCol}>
              <p style={S.ftColTitle}>Ressources</p>
              <div style={S.ftDivider} />
              <span style={S.ftLink} onClick={() => scrollTo('#contact')}>Centre d'aide</span>
              <span style={S.ftLink} onClick={() => scrollTo('#contact')}>FAQ</span>
              <span style={S.ftLink} onClick={() => scrollTo('#contact')}>Contact</span>
              <span style={S.ftLink}>Documentation API</span>
            </div>

            {/* Colonne Contact */}
            <div style={S.ftCol}>
              <p style={S.ftColTitle}>Contact</p>
              <div style={S.ftDivider} />
              {[
                { icon: '📍', line1: 'Dakar, Sénégal' },
                { icon: '✉', line1: 'contact@bcxfinance.com' },
                { icon: '🌐', line1: 'bcxfinance.vercel.app' },
                { icon: '⏰', line1: 'Lun–Ven  8h–18h GMT' },
              ].map(({ icon, line1 }) => (
                <div key={line1} style={S.ftContactRow}>
                  <span style={S.ftContactIcon}>{icon}</span>
                  <span style={S.ftContactTxt}>{line1}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── Bas du footer ── */}
          <div style={S.ftBottom}>
            <div style={S.ftBottomLeft}>
              <span style={S.ftBotTxt}>© 2026 BCX Finance · Fintech Apprentice Africa</span>
            </div>
            <div style={S.ftBotLinks}>
              {['Politique de confidentialité', "Conditions d'utilisation", 'Mentions légales'].map(l => (
                <span key={l} style={S.ftBotLink}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const S = {
  root: { background: '#0A0A0A', color: '#fff', fontFamily: "'Inter',-apple-system,sans-serif", margin: 0, padding: 0, overflowX: 'hidden' },
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, transition: 'all 0.3s', borderBottom: '1px solid transparent' },
  navScrolled: { background: 'rgba(10,10,10,0.97)', borderBottom: '1px solid #111', backdropFilter: 'blur(20px)' },
  navIn: { maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', gap: 40 },
  logo: { fontSize: 24, fontWeight: 900, letterSpacing: 1, color: '#fff', cursor: 'pointer', userSelect: 'none', flexShrink: 0 },
  navLinks: { display: 'flex', gap: 32, flex: 1 },
  navLink: { color: '#666', fontSize: 14, textDecoration: 'none', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' },
  navCtas: { display: 'flex', gap: 10 },
  btnGhost: { background: 'transparent', border: '1px solid #222', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 14, padding: '9px 18px', fontFamily: 'inherit' },
  btnOr: { background: '#D4AF37', border: 'none', borderRadius: 8, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '9px 18px', fontFamily: 'inherit' },
  ham: { display: 'none', flexDirection: 'column', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, marginLeft: 'auto' },
  hamL: { width: 22, height: 2, background: '#888', borderRadius: 2, display: 'block', transition: 'all 0.25s' },
  mobileMenu: { background: '#0d0d0d', borderTop: '1px solid #111', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4 },
  mobileLink: { color: '#666', fontSize: 15, textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #111', display: 'block', cursor: 'pointer' },
  hero: { position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 68, overflow: 'hidden' },
  heroGrid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,175,55,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.025) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' },
  heroHalo: { position: 'absolute', top: '10%', right: '5%', width: 700, height: 700, background: 'radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 65%)', pointerEvents: 'none' },
  heroIn: { maxWidth: 1280, margin: '0 auto', padding: '60px 32px', width: '100%', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap', position: 'relative', zIndex: 1 },
  heroLeft: { flex: '1 1 420px', minWidth: 0 },
  pill: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 100, color: '#D4AF37', fontSize: 12, fontWeight: 600, padding: '6px 16px', marginBottom: 28 },
  pillDot: { width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'block', boxShadow: '0 0 6px #D4AF37' },
  h1: { fontSize: 'clamp(22px,3vw,42px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', letterSpacing: -1, color: '#fff' },
  h1Or: { color: '#D4AF37' },
  heroSub: { color: '#555', fontSize: 14, lineHeight: 1.75, margin: '0 0 36px', maxWidth: 480 },
  heroBtns: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 },
  btnHeroOr: { background: '#D4AF37', border: 'none', borderRadius: 12, color: '#000', cursor: 'pointer', fontSize: 15, fontWeight: 800, padding: '15px 32px', fontFamily: 'inherit' },
  btnHeroGhost: { background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 12, color: '#777', cursor: 'pointer', fontSize: 15, fontWeight: 600, padding: '15px 32px', fontFamily: 'inherit' },
  heroStats: { display: 'flex', gap: 40 },
  heroStat: { display: 'flex', flexDirection: 'column', gap: 2 },
  heroStatVal: { color: '#fff', fontSize: 22, fontWeight: 900 },
  heroStatLabel: { color: '#444', fontSize: 12 },
  heroRight: { flex: '1 1 380px', minWidth: 0, display: 'flex', justifyContent: 'center', position: 'relative' },
  heroImgWrap: { position: 'relative', width: '100%', maxWidth: 420, borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' },
  heroImg: { width: '100%', height: 560, objectFit: 'cover', objectPosition: 'center 20%', display: 'block' },
  heroImgFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(transparent, #0A0A0A)', pointerEvents: 'none' },
  floatCard1: { position: 'absolute', top: '6%', right: '4%', background: 'rgba(15,15,15,0.95)', border: '1px solid #1a1a1a', borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.6)', padding: '12px 16px', backdropFilter: 'blur(12px)', minWidth: 200 },
  floatLabel: { color: '#666', fontSize: 11, margin: '0 0 2px' },
  floatVal: { color: '#4CAF50', fontSize: 15, fontWeight: 800, margin: 0 },
  floatCard2: { position: 'absolute', bottom: '22%', left: '4%', background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.6)', padding: '14px 18px', backdropFilter: 'blur(12px)', minWidth: 175 },
  floatLabel2: { color: '#D4AF37', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px' },
  floatScore: { color: '#D4AF37', fontSize: 30, fontWeight: 900 },
  floatScoreBar: { height: 4, background: '#1a1a1a', borderRadius: 2, margin: '8px 0 6px', overflow: 'hidden' },
  floatScoreBarFill: { height: '100%', background: 'linear-gradient(90deg,#D4AF37,#F5E17A)', borderRadius: 2 },
  floatNiveau: { color: '#4CAF50', fontSize: 11, margin: 0, fontWeight: 600 },
  floatCard3: { position: 'absolute', bottom: '6%', right: '4%', background: 'rgba(15,15,15,0.95)', border: '1px solid #1a1a1a', borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.6)', padding: '10px 14px', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 10, minWidth: 170 },
  bandePart: { background: '#0d0d0d', borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 20, overflowX: 'auto', flexWrap: 'wrap' },
  bandeLabel: { color: '#2a2a2a', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', flexShrink: 0 },
  bandeTech: { color: '#333', fontSize: 13, fontWeight: 600, padding: '4px 14px', border: '1px solid #1a1a1a', borderRadius: 20, flexShrink: 0 },
  section: { padding: '100px 0' },
  inner: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  sHead: { textAlign: 'center', marginBottom: 56 },
  eyebrow: { color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 12px' },
  h2: { color: '#fff', fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.15 },
  h2Or: { color: '#D4AF37' },
  lead: { color: '#555', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 },
  tabs: { display: 'flex', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 4, width: 'fit-content', margin: '0 auto 48px', gap: 0 },
  tab: { background: 'transparent', border: 'none', borderRadius: 9, color: '#555', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: '10px 24px', fontFamily: 'inherit', transition: 'all 0.2s' },
  tabOn: { background: '#D4AF37', color: '#000' },
  featGrid: { display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  featCard: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 20, padding: 28, transition: 'transform 0.2s, border-color 0.2s', cursor: 'default', flex: '0 1 300px', minWidth: 240 },
  featIconWrap: { width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  featTitre: { color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 10px' },
  featDesc: { color: '#555', fontSize: 14, lineHeight: 1.65, margin: 0 },
  solGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 24 },
  solCard: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column' },
  solIcon: { width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 24, border: '1px solid #1a1a1a' },
  solTitre: { color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 12px' },
  solDesc: { color: '#555', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' },
  solList: { listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
  solItem: { color: '#666', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 },
  solDot: { width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', flexShrink: 0 },
  btnSolOr: { background: '#D4AF37', border: 'none', borderRadius: 12, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 800, padding: '14px 24px', fontFamily: 'inherit' },
  btnSolBlanc: { background: '#fff', border: 'none', borderRadius: 12, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 800, padding: '14px 24px', fontFamily: 'inherit' },
  aproposGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 64, alignItems: 'start' },
  aproposLeft: {},
  aproposP: { color: '#555', fontSize: 15, lineHeight: 1.8, margin: '0 0 24px' },
  aproposCards: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '0 0 28px' },
  aproposStatCard: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 },
  aproposStatVal: { color: '#D4AF37', fontSize: 32, fontWeight: 900, letterSpacing: -1 },
  aproposStatLabel: { color: '#444', fontSize: 13 },
  paysList: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  paysItem: { display: 'flex', gap: 8, alignItems: 'center' },
  paysCode: { color: '#D4AF37', fontSize: 11, fontWeight: 700, minWidth: 24 },
  paysNom: { color: '#555', fontSize: 12 },
  carteWrap: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 8 },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  sugg: { background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 20, color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: '8px 16px', transition: 'all 0.2s' },
  iaBox: { display: 'flex', alignItems: 'center', gap: 12, background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: '12px 16px', marginBottom: 16 },
  iaAv: { background: '#D4AF37', borderRadius: 8, color: '#000', fontSize: 9, fontWeight: 800, height: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 0.5 },
  iaIn: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  iaReponse: { background: '#111', border: '1px solid #1a1a1a', borderLeft: '3px solid #D4AF37', borderRadius: 16, display: 'flex', gap: 16, padding: '20px 24px' },
  iaTexte: { color: '#888', fontSize: 15, lineHeight: 1.75, margin: 0 },
  cta: { position: 'relative', padding: '120px 0', overflow: 'hidden', background: '#0d0d0d', borderTop: '1px solid #111' },
  ctaHalo: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse,rgba(212,175,55,0.06) 0%,transparent 70%)', pointerEvents: 'none' },
  ctaIn: { position: 'relative', textAlign: 'center', padding: '0 24px' },
  ctaH2: { color: '#fff', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: -1 },
  ctaP: { color: '#555', fontSize: 16, margin: '0 0 40px', lineHeight: 1.7 },
  footer: { background: '#070707', borderTop: '1px solid #111' },

  /* Newsletter band */
  ftNL: { background: 'linear-gradient(135deg,rgba(212,175,55,0.07) 0%,rgba(212,175,55,0.02) 100%)', borderBottom: '1px solid rgba(212,175,55,0.12)', padding: '52px 0' },
  ftNLIn: { maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap' },
  ftNLLeft: { flex: '1 1 320px' },
  ftNLBadge: { display: 'inline-block', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 20, color: '#D4AF37', fontSize: 12, fontWeight: 700, padding: '5px 14px', marginBottom: 16, letterSpacing: 0.5 },
  ftNLTitre: { color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3, letterSpacing: -0.5 },
  ftNLDesc: { color: '#555', fontSize: 14, margin: 0, lineHeight: 1.65 },
  ftNLRight: { flex: '1 1 360px' },
  ftNLRow: { display: 'flex', gap: 10, marginBottom: 10 },
  ftNLField: { display: 'flex', alignItems: 'center', gap: 10, background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '0 16px', flex: 1, height: 50 },
  ftNLInput: { flex: 1, background: 'transparent', border: 'none', color: '#ddd', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  ftNLBtn: { background: '#D4AF37', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 800, padding: '0 26px', height: 50, fontFamily: 'inherit', flexShrink: 0, letterSpacing: 0.3 },
  ftNLNote: { color: '#444', fontSize: 12, margin: 0 },

  /* Footer body */
  ftBody: { padding: '64px 0 0' },
  ftInner: { maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: 56 },
  ftBrand: { flex: '0 0 230px' },
  ftLogo: { fontSize: 26, fontWeight: 900, letterSpacing: 1, color: '#fff', cursor: 'pointer', userSelect: 'none', marginBottom: 12 },
  ftSlogan: { color: '#888', fontSize: 13, fontWeight: 600, margin: '0 0 6px' },
  ftAbout: { color: '#444', fontSize: 12, lineHeight: 1.7, margin: '0 0 18px' },
  ftCountries: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 },
  ftCountryFlag: { fontSize: 20, lineHeight: 1 },
  ftSocials: { display: 'flex', gap: 8 },
  ftSocial: { width: 36, height: 36, borderRadius: 8, background: '#111', border: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13, cursor: 'pointer', fontWeight: 700 },

  ftCol: { display: 'flex', flexDirection: 'column', gap: 11, minWidth: 140 },
  ftColTitle: { color: '#fff', fontSize: 13, fontWeight: 800, margin: '0 0 2px', letterSpacing: 0.5 },
  ftDivider: { height: 1, background: 'linear-gradient(90deg,#D4AF37,transparent)', width: 32, marginBottom: 4 },
  ftLink: { color: '#555', fontSize: 13, cursor: 'pointer', transition: 'color 0.2s' },

  ftContactRow: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  ftContactIcon: { fontSize: 13, flexShrink: 0, marginTop: 1 },
  ftContactTxt: { color: '#555', fontSize: 13, lineHeight: 1.5 },

  /* Footer bottom bar */
  ftBottom: { maxWidth: 1280, margin: '0 auto', padding: '24px 40px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  ftBottomLeft: {},
  ftBotTxt: { color: '#333', fontSize: 12 },
  ftBotLinks: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  ftBotLink: { color: '#333', fontSize: 12, cursor: 'pointer' },
};
