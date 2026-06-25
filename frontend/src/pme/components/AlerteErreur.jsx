export default function AlerteErreur({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'rgba(255, 68, 68, 0.08)',
      border: '1px solid rgba(255, 68, 68, 0.3)',
      borderLeft: '3px solid #FF4444',
      borderRadius: '10px',
      color: '#FF4444',
      padding: '14px 16px',
      fontSize: '14px',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  );
}
