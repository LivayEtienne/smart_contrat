export default function BoutonSecondaire({ label, onClick, disabled, type = 'button', fullWidth = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'transparent',
        border: '1px solid #2a2a2a',
        borderRadius: '10px',
        color: disabled ? '#333' : '#888',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        padding: '12px 20px',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: "'Inter', sans-serif",
        transition: 'border-color 0.2s ease, color 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}
