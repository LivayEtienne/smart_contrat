import { Navigate } from 'react-router-dom';

export default function ProtectedRoutePME({ children }) {
  const token = localStorage.getItem('pme_token');
  if (!token) return <Navigate to="/pme/inscription" replace />;
  return children;
}
