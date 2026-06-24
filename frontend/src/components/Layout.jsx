// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import useOnlineStatus from '../hooks/useOnlineStatus';

export default function Layout({ children }) {
  const online = useOnlineStatus();

  return (
    <div style={layoutStyles.container}>
      <Sidebar />
      <main style={layoutStyles.mainContent}>
        <div style={layoutStyles.syncBar}>
          <span style={online ? layoutStyles.onlineBadge : layoutStyles.offlineBadge}>
            {online ? 'En ligne' : 'Hors ligne'}
          </span>
          <span style={layoutStyles.syncText}>
            {online
              ? 'Toutes les données sont synchronisées.'
              : 'Mode hors ligne : affichage des données du cache local. Les actions d’écriture sont désactivées.'}
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}

const layoutStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    background: '#060608',
    overflowX: 'hidden',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  mainContent: {
    marginLeft: '240px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
    padding: '24px 24px 24px 32px',
    boxSizing: 'border-box',
    background: '#060608',
  },
  syncBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #1a1a1a',
    background: '#0B0B0E',
  },
  onlineBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#1f2f1f',
    color: '#4CAF50',
    fontSize: '12px',
    fontWeight: 700,
  },
  offlineBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#2f1f1f',
    color: '#FF4444',
    fontSize: '12px',
    fontWeight: 700,
  },
  syncText: {
    color: '#888',
    fontSize: '13px',
  }
};