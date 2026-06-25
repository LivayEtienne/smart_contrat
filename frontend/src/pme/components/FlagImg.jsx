export default function FlagImg({ flag, nom, code, size = 22 }) {
  return (
    <span
      style={{ fontSize: size, lineHeight: 1, flexShrink: 0, userSelect: 'none', display: 'inline-block' }}
      role="img"
      aria-label={nom || code}
    >
      {flag || '🏳'}
    </span>
  );
}
