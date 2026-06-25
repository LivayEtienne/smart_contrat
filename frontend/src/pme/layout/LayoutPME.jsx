import { useState, useEffect } from 'react';
import SidebarPME from '../components/SidebarPME';

export default function LayoutPME({ children }) {
  const [estMobile, setEstMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const onResize = () => setEstMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0A0A0A', overflow: 'hidden' }}>
      <SidebarPME />
      <div style={{
        flex: 1,
        minWidth: 0,
        paddingTop: estMobile ? 56 : 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}
