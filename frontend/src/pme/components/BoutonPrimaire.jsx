export default function BoutonPrimaire({ label, onClick, disabled, loading, type = 'button', fullWidth = true }) {
  const inactif = disabled || loading;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={inactif}
      style={{
        background: inactif ? '#1a1a1a' : 'linear-gradient(135deg, #D4AF37 0%, #F5E17A 100%)',
        border: inactif ? '1px solid #2a2a2a' : 'none',
        borderRadius: '10px',
        color: inactif ? '#444' : '#0A0A0A',
        cursor: inactif ? 'not-allowed' : 'pointer',
        fontSize: '15px',
        fontWeight: '700',
        letterSpacing: '0.3px',
        padding: '14px 24px',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: "'Inter', sans-serif",
        boxShadow: inactif ? 'none' : '0 4px 20px rgba(212, 175, 55, 0.3)',
        transition: 'opacity 0.2s ease',
      }}
    >
      {loading ? '⏳ Chargement...' : label}
    </button>
  );
}
