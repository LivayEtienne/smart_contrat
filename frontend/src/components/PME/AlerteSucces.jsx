// COMPOSANT : AlerteSucces
export default function AlerteSucces({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'rgba(76, 175, 80, 0.08)',
      border: '1px solid rgba(76, 175, 80, 0.3)',
      borderLeft: '3px solid #4CAF50',
      borderRadius: '10px',
      color: '#4CAF50',
      padding: '14px 16px',
      fontSize: '14px',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      <span>✅</span>
      <span>{message}</span>
    </div>
  );
}
