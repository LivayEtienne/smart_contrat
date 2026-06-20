// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar'; 

export default function Layout({ children }) {
  return (
    <div style={layoutStyles.container}>
      <Sidebar />
      <main style={layoutStyles.mainContent}>
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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
    // CORRECTION CRUCIALE : 24px en haut/bas, 0px absolue sur les côtés gauche et droite
    padding: '24px 0px', 
    boxSizing: 'border-box',
    background: '#060608',
  }
};