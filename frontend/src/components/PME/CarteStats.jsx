// COMPOSANT : CarteStats
export default function CarteStats({ label, valeur, unite, couleurValeur, accent }) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #1e1e1e',
      borderLeft: `3px solid ${accent || '#D4AF37'}`,
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      fontFamily: "'Inter', sans-serif",
    }}>
      <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 12px' }}>
        {label}
      </p>
      <p style={{ color: couleurValeur || '#fff', fontSize: '28px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
        {valeur}
      </p>
      {unite && (
        <p style={{ color: '#444', fontSize: '12px', marginTop: '6px' }}>{unite}</p>
      )}
    </div>
  );
}
