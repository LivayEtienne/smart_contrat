export default function BadgeStatut({ statut }) {
  const config = {
    entree:     { label: '▲ Entrée',      couleur: '#4CAF50', bg: 'rgba(76,175,80,0.1)',   border: 'rgba(76,175,80,0.3)'   },
    sortie:     { label: '▼ Sortie',      couleur: '#FF4444', bg: 'rgba(255,68,68,0.1)',   border: 'rgba(255,68,68,0.3)'   },
    revenu:     { label: '▲ Revenu',      couleur: '#4CAF50', bg: 'rgba(76,175,80,0.1)',   border: 'rgba(76,175,80,0.3)'   },
    depense:    { label: '▼ Dépense',     couleur: '#FF4444', bg: 'rgba(255,68,68,0.1)',   border: 'rgba(255,68,68,0.3)'   },
    en_attente: { label: '⏳ En attente', couleur: '#F5A623', bg: 'rgba(245,166,35,0.1)',  border: 'rgba(245,166,35,0.3)'  },
    valide:     { label: '✅ Validé',     couleur: '#4CAF50', bg: 'rgba(76,175,80,0.1)',   border: 'rgba(76,175,80,0.3)'   },
    refuse:     { label: '❌ Refusé',    couleur: '#FF4444', bg: 'rgba(255,68,68,0.1)',   border: 'rgba(255,68,68,0.3)'   },
  };

  const c = config[statut] || { label: statut, couleur: '#888', bg: 'rgba(136,136,136,0.1)', border: 'rgba(136,136,136,0.3)' };

  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '6px',
      color: c.couleur,
      fontSize: '12px',
      fontWeight: '600',
      padding: '4px 10px',
      fontFamily: "'Inter', sans-serif",
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  );
}
