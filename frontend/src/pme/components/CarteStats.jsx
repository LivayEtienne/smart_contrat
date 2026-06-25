export default function CarteStats({ label, valeur, unite, couleurValeur, accent, variation, icone }) {
  const isPos = variation && (variation.startsWith('+') || variation > 0);
  const isNeg = variation && (variation.startsWith('-') || variation < 0);
  const variationStr = typeof variation === 'number'
    ? (variation >= 0 ? `+${variation}%` : `${variation}%`)
    : variation;

  return (
    <div style={{
      background: '#111',
      border: '1px solid #1e1e1e',
      borderRadius: '14px',
      padding: '20px 22px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>
          {label}
        </p>
        {icone && (
          <div style={{ width: 32, height: 32, background: `${accent || '#D4AF37'}18`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            {icone}
          </div>
        )}
      </div>

      <p style={{ color: couleurValeur || '#fff', fontSize: '26px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
        {valeur}
      </p>
      {unite && (
        <p style={{ color: '#333', fontSize: '11px', marginTop: '4px', marginBottom: 0 }}>{unite}</p>
      )}

      {variationStr && (
        <p style={{
          color: isNeg ? '#FF4444' : isPos ? '#4CAF50' : '#555',
          fontSize: '12px', marginTop: 10, marginBottom: 0, fontWeight: 500,
        }}>
          {isPos ? '▲ ' : isNeg ? '▼ ' : ''}{variationStr} ce mois
        </p>
      )}
    </div>
  );
}
