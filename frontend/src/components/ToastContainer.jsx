// ToastContainer.jsx — BCX Finance
import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastCtx = createContext(null);

export function useToast() {
  return useContext(ToastCtx);
}

let _addToast = null;
export function toast(msg, type = 'info') {
  if (_addToast) _addToast(msg, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => { _addToast = add; return () => { _addToast = null; }; }, [add]);

  const colors = {
    success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', icon: '✓', color: '#22c55e' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: '✕', color: '#ef4444' },
    warning: { bg: 'rgba(245,179,47,0.12)', border: 'rgba(245,179,47,0.3)', icon: '⚠', color: '#F5B32F' },
    info:    { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', icon: 'ℹ', color: '#6366f1' },
  };

  if (!toasts.length) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
      {toasts.map(t => {
        const c = colors[t.type] || colors.info;
        return (
          <div key={t.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'slideIn 0.2s ease' }}>
            <span style={{ color: c.color, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
            <span style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5 }}>{t.msg}</span>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}
