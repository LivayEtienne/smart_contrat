// SYSTÈME DE TOASTS — BCX Finance | Auteur : Parfait Eric Yao
import { useState, useEffect, useCallback } from 'react';

// ── Hook global useToast ───────────────────────────────────────
let _setToasts = null;

export function useToast() {
  return {
    success: (msg) => _setToasts && _setToasts(p => [...p, { id: Date.now(), type: 'success', msg }]),
    error:   (msg) => _setToasts && _setToasts(p => [...p, { id: Date.now(), type: 'error',   msg }]),
    info:    (msg) => _setToasts && _setToasts(p => [...p, { id: Date.now(), type: 'info',    msg }]),
    warning: (msg) => _setToasts && _setToasts(p => [...p, { id: Date.now(), type: 'warning', msg }]),
  };
}

// ── Composant ToastContainer ───────────────────────────────────
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  const retirer = useCallback((id) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => retirer(toasts[0].id), 3500);
    return () => clearTimeout(timer);
  }, [toasts, retirer]);

  const cfg = {
    success: { bg: '#0d1f0d', border: '#1a4d1a', color: '#4CAF50', icon: '✓' },
    error:   { bg: '#1f0d0d', border: '#4d1a1a', color: '#FF4444', icon: '✕' },
    info:    { bg: '#0d1220', border: '#1a2a4d', color: '#5B9BD5', icon: 'ℹ' },
    warning: { bg: '#1f180d', border: '#4d3a1a', color: '#F5A623', icon: '⚠' },
  };

  return (
    <div style={s.container}>
      {toasts.map(t => {
        const c = cfg[t.type] || cfg.info;
        return (
          <div key={t.id} style={{ ...s.toast, background: c.bg, border: `1px solid ${c.border}` }}>
            <span style={{ ...s.icon, color: c.color, borderColor: c.border }}>{c.icon}</span>
            <span style={s.msg}>{t.msg}</span>
            <button style={s.close} onClick={() => retirer(t.id)}>×</button>
          </div>
        );
      })}
    </div>
  );
}

const s = {
  container: { position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 },
  toast: { borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', animation: 'slideIn 0.3s ease', fontFamily: "'Inter',sans-serif", minWidth: 260 },
  icon: { borderRadius: 6, border: '1px solid', fontSize: 13, fontWeight: 700, height: 24, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  msg: { color: '#ccc', fontSize: 14, flex: 1, lineHeight: 1.4 },
  close: { background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontSize: 18, padding: '0 2px' },
};
