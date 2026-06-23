import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewDepot from './pages/NewDepot';
import MesDepots from './pages/MesDepots';
import AdminPanel from './pages/AdminPanel';
import Profil from './pages/Profil';
import AyantsDroit from './pages/AyantDroit';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import TableBord from './pages/TableBord';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page publique */}
        <Route path="/login" element={<Login />} />

        {/* Pages investisseur — avec sidebar */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/depot/nouveau" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout>
              <NewDepot />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/depot/mes-depots" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout>
              <MesDepots />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout>
              <Profil />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/ayants-droit" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout>
              <AyantsDroit />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/tableau-bord" element={
        <ProtectedRoute roleRequis="investisseur">
          <Layout>
            <TableBord />
          </Layout>
        </ProtectedRoute>
      } />

        {/* Page admin — sans sidebar investisseur */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequis="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}