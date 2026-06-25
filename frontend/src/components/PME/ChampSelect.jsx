// COMPOSANT : ChampSelect
export default function ChampSelect({ label, name, value, onChange, options = [], required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: "'Inter', sans-serif" }}>
      {label && (
        <label style={{ color: '#666', fontSize: '12px', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {label}{required && <span style={{ color: '#D4AF37', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          background: '#0d0d0d',
          border: '1px solid #222',
          borderRadius: '10px',
          color: value ? '#fff' : '#555',
          fontSize: '14px',
          padding: '13px 16px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
        }}
      >
        <option value="">-- Choisir --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
