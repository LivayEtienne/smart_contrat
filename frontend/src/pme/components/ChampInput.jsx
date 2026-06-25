import { useState } from 'react';

export default function ChampInput({ label, name, placeholder, value, onChange, type = 'text', required, avecOeil }) {
  const [voir, setVoir] = useState(false);
  const typeEffectif = avecOeil ? (voir ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: "'Inter', sans-serif" }}>
      {label && (
        <label style={{ color: '#666', fontSize: '12px', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {label}{required && <span style={{ color: '#D4AF37', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={typeEffectif}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            background: '#0d0d0d',
            border: '1px solid #222',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
            padding: avecOeil ? '13px 44px 13px 16px' : '13px 16px',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
            transition: 'border-color 0.2s ease',
          }}
        />
        {avecOeil && (
          <span
            onClick={() => setVoir(!voir)}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', userSelect: 'none' }}
          >
            {voir ? '🙈' : '👁️'}
          </span>
        )}
      </div>
    </div>
  );
}
