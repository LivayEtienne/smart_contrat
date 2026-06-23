import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewDepot from './pages/NewDepot';
import AdminPanel from './pages/AdminPanel';
import Profil from './pages/Profil';
import AyantsDroit from './pages/AyantDroit';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoutePME from './components/ProtectedRoutePME';
import Layout from './components/Layout';
import TableBord from './pages/TableBord';
// ── Pages PME (Léonie Gondo)
import InscriptionPME from './pages/PME/InscriptionPME';
import DashboardPME from './pages/PME/DashboardPME';
import NouvelleTransaction from './pages/PME/NouvelleTransaction';
import ScoreBCX from './pages/PME/ScoreBCX';
import RapportMensuel from './pages/PME/RapportMensuel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page publique */}
        <Route path="/login" element={<Login />} />

        {/* Pages investisseur — avec sidebar */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/depot/nouveau" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout><NewDepot /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout><Profil /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/ayants-droit" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout><AyantsDroit /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/tableau-bord" element={
          <ProtectedRoute roleRequis="investisseur">
            <Layout><TableBord /></Layout>
          </ProtectedRoute>
        } />

        {/* Page admin */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequis="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* ── Pages PME — ProtectedRoutePME (token pme_token) ── */}
        <Route path="/pme/inscription" element={<InscriptionPME />} />
        <Route path="/pme/dashboard" element={
          <ProtectedRoutePME>
            <DashboardPME />
          </ProtectedRoutePME>
        } />
        <Route path="/pme/nouvelle-transaction" element={
          <ProtectedRoutePME>
            <NouvelleTransaction />
          </ProtectedRoutePME>
        } />
        <Route path="/pme/score" element={
          <ProtectedRoutePME>
            <ScoreBCX />
          </ProtectedRoutePME>
        } />
        <Route path="/pme/rapport" element={
          <ProtectedRoutePME>
            <RapportMensuel />
          </ProtectedRoutePME>
        } />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
