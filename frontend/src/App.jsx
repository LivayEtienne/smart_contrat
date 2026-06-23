import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewDepot from './pages/NewDepot';
import AdminPanel from './pages/AdminPanel';
import Profil from './pages/Profil';
import AyantsDroit from './pages/AyantDroit';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import TableBord from './pages/TableBord';
// ── Pages PME (Léonie Gondo) ──
import InscriptionPME from './pages/InscriptionPME';
import DashboardPME from './pages/DashboardPME';
import NouvelleTransaction from './pages/NouvelleTransaction';
import ScoreBCX from './pages/ScoreBCX';

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

        {/* ── Pages PME (Léonie Gondo) ── */}
        {/* Page d'inscription publique */}
        <Route path="/pme/inscription" element={<InscriptionPME />} />
        {/* Dashboard PME */}
        <Route path="/pme/dashboard" element={
          <ProtectedRoute>
            <Layout><DashboardPME /></Layout>
          </ProtectedRoute>
        } />
        {/* Nouvelle transaction */}
        <Route path="/pme/nouvelle-transaction" element={
          <ProtectedRoute>
            <Layout><NouvelleTransaction /></Layout>
          </ProtectedRoute>
        } />
        {/* Score BCX */}
        <Route path="/pme/score" element={
          <ProtectedRoute>
            <Layout><ScoreBCX /></Layout>
          </ProtectedRoute>
        } />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}