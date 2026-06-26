import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1100&fit=crop&q=85',
    alt: 'Investisseur BCX Finance',
    eyebrow: 'CERCLE DES INVESTISSEURS',
    titre: "Votre capital, tracé on-chain.",
    desc: "Investissez en FCFA ou en ETH, recevez des tokens BCX ERC-20 et suivez vos rendements en temps réel sur Ethereum Sepolia.",
    targetStat: 100,
    statLabel: 'On-chain',
    // Ajustement de l'opacité du noir pour cette image sombre (Moins de noir)
    overlayOpacity: 0.65,
    brightness: 'brightness(0.5) contrast(1.1)' 
  },
  {
    url: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=1100&fit=crop&crop=top&q=85',
    alt: 'Entrepreneur PME africaine BCX Finance',
    eyebrow: 'ESPACE PME',
    titre: "Pilotez votre activité, prouvez votre valeur.",
    desc: "Enregistrez vos recettes et dépenses, obtenez votre Score BCX et générez des rapports bancaires prêts à l'emploi.",
    targetStat: 85,
    statLabel: 'Score BCX Moyen',
    // Ajustement standard pour l'image lumineuse
    overlayOpacity: 0.8,
    brightness: 'brightness(0.35) contrast(1.0)'
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const [showMdp, setShowMdp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [slideActif, setSlideActif] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);
  
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  // MOTEUR CANVAS : Pluie de Devises Institutionnelles ($, €, ₿, FCFA)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const DEVISES = ['$', '€', '₿', 'FCFA', 'ETH', 'BCX'];
    const numSymbols = 80; // Légèrement réduit pour garder une lisibilité parfaite
    const symbols = [];
    
    for (let i = 0; i < numSymbols; i++) {
      const isGold = Math.random() > 0.5;
      symbols.push({
        text: DEVISES[Math.floor(Math.random() * DEVISES.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1.8 + 0.4, // Profondeur (Parallaxe)
        vx: (Math.random() * 0.12 + 0.03), // Défilement horizontal lent
        vy: (Math.random() - 0.5) * 0.03,
        fontSize: Math.floor(Math.random() * 5) + 8, // Entre 8px et 13px (Micro-typographie Luxe)
        color: isGold ? '#D4AF37' : '#FFFFFF',
        baseAlpha: Math.random() * 0.25 + 0.05, // Très subtil en arrière-plan
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseFactor: Math.random() * Math.PI
      });
    }

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Liaison réseau fine entre les devises proches
      for (let i = 0; i < numSymbols; i++) {
        for (let j = i + 1; j < numSymbols; j++) {
          if (symbols[i].z > 1.0 && symbols[j].z > 1.0) {
            const dist = Math.hypot(symbols[i].x - symbols[j].x, symbols[i].y - symbols[j].y);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(symbols[i].x, symbols[i].y);
              ctx.lineTo(symbols[j].x, symbols[j].y);
              ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 110) * 0.03})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }
      }

      // Rendu des Devises
      symbols.forEach(s => {
        s.x += s.vx * s.z;
        s.y += s.vy * s.z;
        s.pulseFactor += s.pulseSpeed;

        if (s.x > width) s.x = 0;
        if (s.y < 0 || s.y > height) s.y = Math.random() * height;

        // Répulsion fluide au curseur
        const distMouse = Math.hypot(s.x - mouse.x, s.y - mouse.y);
        if (distMouse < 130) {
          const force = (130 - distMouse) / 130;
          const angle = Math.atan2(s.y - mouse.y, s.x - mouse.x);
          s.x += Math.cos(angle) * force * 1.2;
          s.y += Math.sin(angle) * force * 1.2;
        }

        const alpha = s.baseAlpha + (Math.sin(s.pulseFactor) * 0.05);
        ctx.font = `600 ${s.fontSize * (s.z * 0.85)}px 'Inter', sans-serif`;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.02, Math.min(alpha, 0.4));
        
        ctx.fillText(s.text, s.x, s.y);
      });
      
      ctx.globalAlpha = 1.0; // Reset indispensable
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // PARALLAXE 3D CARTE
  const handleCardMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 
    const xRotation = 14 * ((y - rect.height / 2) / rect.height);
    const yRotation = -14 * ((x - rect.width / 2) / rect.width);
    card.style.transform = `perspective(1200px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.01, 1.01, 1.01)`;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  // Carrousel & Compteurs
  useEffect(() => {
    const t = setInterval(() => setSlideActif(i => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setCurrentStat(0);
    const target = SLIDES[slideActif].targetStat;
    let start = 0;
    const timer = setInterval(() => {
      start += 1;
      setCurrentStat(start);
      if (start >= target) clearInterval(timer);
    }, Math.abs(Math.floor(1000 / target)));
    return () => clearInterval(timer);
  }, [slideActif]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(form);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setLoginSuccess(true);
      setTimeout(() => {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'pme') navigate('/pme/dashboard');
        else navigate('/dashboard');
      }, 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d’authentification');
      setLoading(false);
    }
  };

  return (
    <div style={S.root}>
      <style>{`
        @keyframes textShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes sweep { 0% { transform: translateX(-100%) rotate(45deg); } 100% { transform: translateX(300%) rotate(45deg); } }
        @keyframes pulseLogo { 0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.1); } 50% { box-shadow: 0 0 40px rgba(212,175,55,0.4); } }
        
        .shimmer-text { background: linear-gradient(90deg, #fff 0%, #D4AF37 50%, #fff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textShimmer 4s linear infinite; }
        .input-glow-effect:focus-within { border-color: #D4AF37 !important; box-shadow: 0 0 25px rgba(212,175,55,0.15) !important; background: rgba(212,175,55,0.01) !important; }
        .premium-btn { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(212,175,55,0.2); filter: brightness(1.1); }
        .stat-hover:hover { transform: translateY(-5px); border-color: rgba(212,175,55,0.3) !important; background: rgba(255,255,255,0.02) !important; }
      `}</style>

      {/* CANVAS DES DEVISES QUANTIQUES INTERACTIVES */}
      <canvas ref={canvasRef} style={S.canvas} />

      {/* ── GAUCHE : Visuels FinTech Rééquilibrés ── */}
      <div className="login-gauche" style={S.gauche}>
        {SLIDES.map((slide, i) => (
          <div key={slide.url} style={{ 
            ...S.gPhotoContainer, 
            opacity: slideActif === i ? 1 : 0, 
            transition: 'opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1)' 
          }}>
            <img src={slide.url} alt={slide.alt} style={{ ...S.gPhoto, filter: SLIDES[slideActif].brightness }} />
          </div>
        ))}
        {/* L'overlay s'ajuste dynamiquement pour éviter l'effet "trop noir" du premier slide */}
        <div style={{ 
          ...S.gOverlay, 
          background: `linear-gradient(to bottom, rgba(2,2,4,0.0) 0%, rgba(2,2,4,${SLIDES[slideActif].overlayOpacity}) 65%, #020204 100%)`,
          transition: 'background 1.4s ease-in-out'
        }} />

        <div style={S.gContent}>
          <div style={S.gLogo} onClick={() => navigate('/')}>
            <img src="/logo.jpeg" alt="BCX Finance" style={S.logoImg} />
          </div>

          <div style={S.gBody}>
            <p style={S.gEyebrow}>{SLIDES[slideActif].eyebrow}</p>
            <h2 style={S.gH2} className="shimmer-text">{SLIDES[slideActif].titre}</h2>
            <p style={S.gDesc}>{SLIDES[slideActif].desc}</p>

            <div style={S.gStats}>
              <div style={S.gStatCard} className="stat-hover">
                <span style={S.gStatV}>{currentStat}%</span>
                <span style={S.gStatL}>{SLIDES[slideActif].statLabel}</span>
              </div>
              <div style={S.gStatCard} className="stat-hover">
                <span style={S.gStatV}>Audité</span>
                <span style={S.gStatL}>Smart-Contracts SEC</span>
              </div>
            </div>

            <div style={S.dotsWrap}>
              {SLIDES.map((_, i) => (
                <div key={i} onClick={() => setSlideActif(i)} style={{ ...S.progressBarTrack, flex: slideActif === i ? 3 : 1 }}>
                  <div style={{ ...S.progressBarFill, width: slideActif === i ? '100%' : slideActif > i ? '100%' : '0%', transition: slideActif === i ? 'width 7s linear' : 'width 0.5s ease' }} />
                </div>
              ))}
            </div>
          </div>
          <p style={S.gFooter}>SÉCURISÉ PAR LA TECHNOLOGIE ETHEREUM BLOCKCHAIN · © 2026</p>
        </div>
      </div>

      {/* ── DROITE : Écrin Formulaire 3D ── */}
      <div style={S.droite}>
        {loginSuccess ? (
          <div style={S.successBox}>
            <div style={S.successRing}>✓</div>
            <h2 style={S.successTitle}>Établissement du canal chiffré...</h2>
            <p style={S.successSub}>Bienvenue. Redirection vers votre console d'actifs.</p>
          </div>
        ) : (
          <div 
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={() => { if(cardRef.current) cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'; }}
            style={S.glassCard}
          >
            <div style={S.cardShineOverlay} />

            <p style={S.eyebrow}>PORTAIL INSTITUTIONNEL</p>
            <h1 style={S.titre}>Connectez votre Compte</h1>
            <p style={S.sous}>Système d'authentification chiffré de bout en bout.</p>

            <form onSubmit={handleSubmit} style={S.form}>
              <div style={S.field}>
                <label style={S.label}>ID CLÉ / ADRESSE EMAIL</label>
                <div className="input-glow-effect" style={S.inputWrap}>
                  <span style={S.inputIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input
                    style={S.input}
                    type="email"
                    placeholder="investisseur@bcx-finance.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>MOT DE PASSE SÉCURISÉ</label>
                <div className="input-glow-effect" style={S.inputWrap}>
                  <span style={S.inputIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    style={S.input}
                    type={showMdp ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={form.mot_de_passe}
                    onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                    required
                  />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowMdp(v => !v)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={showMdp ? "#D4AF37" : "#555"} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>

              {error && <div style={S.errBox}>{error}</div>}

              <button className="premium-btn" style={loading ? S.btnOff : S.btn} type="submit" disabled={loading}>
                {!loading && <div style={S.btnLaser} />}
                {loading ? 'Vérification des signatures...' : 'Déverrouiller l’accès sécurisé →'}
              </button>
            </form>

            <div style={S.sep}><span style={S.sepTxt}>OU CONTINUER AVEC</span></div>

            <div style={S.linksGrid}>
              <div style={S.linkBlock} onClick={() => navigate('/inscription')}>
                <span style={S.linkTitle}>Nouveau capital</span>
                <span style={S.linkAction}>Créer un compte</span>
              </div>
              <div style={S.linkBlock} onClick={() => navigate('/pme/connexion')}>
                <span style={S.linkTitle}>Espace Corporate</span>
                <span style={S.linkAction}>Accès Entreprises</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  root: { minHeight: '100vh', background: '#020204', display: 'flex', fontFamily: "'Inter', sans-serif", overflow: 'hidden', position: 'relative' },
  canvas: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 },
  gauche: { position: 'relative', width: '45%', flexShrink: 0, overflow: 'hidden', borderRight: '1px solid rgba(255, 255, 255, 0.03)', zIndex: 2 },
  gPhotoContainer: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  gPhoto: { width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.02)', transition: 'filter 1.4s ease-in-out' },
  gOverlay: { position: 'absolute', inset: 0 },
  gContent: { position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', height: '100%', padding: '60px', justifyContent: 'space-between', boxSizing: 'border-box' },
  gLogo: { cursor: 'pointer', width: 'fit-content' },
  logoImg: { height: 44, borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', animation: 'pulseLogo 3s ease-in-out infinite' },
  gBody: { marginTop: 'auto', marginBottom: '40px' },
  gEyebrow: { color: '#D4AF37', fontSize: '10px', fontWeight: 700, letterSpacing: '5px' },
  gH2: { color: '#fff', fontSize: 'clamp(30px, 2.8vw, 46px)', fontWeight: 800, lineHeight: 1.15, margin: '16px 0', letterSpacing: '-1px' },
  gDesc: { color: '#71717A', fontSize: '14px', lineHeight: 1.65, maxWidth: '440px', margin: 0 },
  gStats: { display: 'flex', gap: '16px', marginTop: '32px' },
  gStatCard: { flex: 1, padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', backdropFilter: 'blur(20px)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' },
  gStatV: { color: '#D4AF37', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' },
  gStatL: { color: '#52525B', fontSize: '11px', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  dotsWrap: { display: 'flex', gap: '8px', marginTop: '40px' },
  progressBarTrack: { height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden', cursor: 'pointer' },
  progressBarFill: { height: '100%', background: '#D4AF37' },
  gFooter: { color: '#3F3F46', fontSize: '10px', fontWeight: 600, letterSpacing: '1px' },
  droite: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', zIndex: 2 },
  glassCard: { width: '100%', maxWidth: '460px', background: 'linear-gradient(135deg, rgba(12, 12, 18, 0.65) 0%, rgba(4, 4, 8, 0.85) 100%)', backdropFilter: 'blur(35px)', webkitBackdropFilter: 'blur(35px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '28px', padding: '48px', boxSizing: 'border-box', transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, box-shadow 0.3s ease', boxShadow: '0 40px 90px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' },
  cardShineOverlay: { position: 'absolute', inset: 0, background: 'radial-gradient(circle 250px at var(--x, -1000px) var(--y, -1000px), rgba(212,175,55,0.04), transparent 100%)', pointerEvents: 'none' },
  eyebrow: { color: '#D4AF37', fontSize: '10px', fontWeight: 700, letterSpacing: '4px', marginBottom: '12px' },
  titre: { color: '#fff', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.8px', margin: '0 0 6px' },
  sous: { color: '#52525B', fontSize: '14px', lineHeight: 1.5, margin: '0 0 36px' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#71717A', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' },
  inputWrap: { display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0 16px', height: '54px', transition: 'all 0.3s' },
  inputIcon: { display: 'flex', marginRight: '4px' },
  input: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', height: '100%' },
  eyeBtn: { background: 'transparent', border: 'none', cursor: 'pointer' },
  errBox: { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#F87171', fontSize: '13px', padding: '14px' },
  btn: { background: 'linear-gradient(90deg, #C5A028, #F3E49F, #C5A028)', backgroundSize: '200% auto', border: 'none', borderRadius: '14px', color: '#020204', cursor: 'pointer', fontSize: '15px', fontWeight: 700, padding: '16px', letterSpacing: '0.3px', marginTop: '8px' },
  btnLaser: { position: 'absolute', top: 0, left: 0, width: '30%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transform: 'skewX(-45deg)', animation: 'sweep 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' },
  btnOff: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '14px', color: '#3F3F46', cursor: 'not-allowed', fontSize: '15px', padding: '16px', marginTop: '8px' },
  sep: { position: 'relative', margin: '36px 0 24px', textAlign: 'center' },
  sepTxt: { background: '#07070d', color: '#3F3F46', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', padding: '0 16px', position: 'relative', zIndex: 2 },
  linksGrid: { display: 'flex', gap: '12px' },
  linkBlock: { flex: 1, background: 'rgba(255,255,255,0.005)', border: '1px solid rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s' },
  linkTitle: { color: '#52525B', fontSize: '11px', fontWeight: 600 },
  linkAction: { color: '#D4AF37', fontSize: '12px', fontWeight: 700, marginTop: '4px' },
  successBox: { textAlign: 'center', padding: '40px' },
  successRing: { width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(212,175,55,0.05)', border: '1px solid #D4AF37', color: '#D4AF37', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 50px rgba(212,175,55,0.3)' },
  successTitle: { color: '#fff', fontSize: '24px', fontWeight: 700 },
  successSub: { color: '#71717A', fontSize: '14px', marginTop: '8px' }
};