import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roleRequis }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

   if (!token) return <Navigate to="/login" replace />;
   if (roleRequis && user.role !== roleRequis) return <Navigate to="/dashboard" replace />;

  return children;
}