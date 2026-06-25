import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Pages investisseur (PM) ───────────────────────────────────
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewDepot from './pages/NewDepot';
import AdminPanel from './pages/AdminPanel';
import Profil from './pages/Profil';
import AyantsDroit from './pages/AyantDroit';
import TableBord from './pages/TableBord';

// ── Pages PME (Groupe 1) ──────────────────────────────────────
import Landing from './pages/Landing';
import InscriptionPME from './pages/PME/InscriptionPME';
import ConnexionPME from './pages/PME/ConnexionPME';
import DashboardPME from './pages/PME/DashboardPME';
import NouvelleTransaction from './pages/PME/NouvelleTransaction';
import ScoreBCX from './pages/PME/ScoreBCX';
import RapportMensuel from './pages/PME/RapportMensuel';
import ProfilPME from './pages/PME/ProfilPME';

// ── Pages investisseur publiques ─────────────────────────────
import InscriptionInvestisseur from './pages/InscriptionInvestisseur';

// ── Composants ────────────────────────────────────────────────
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoutePME from './components/ProtectedRoutePME';
import Layout from './components/Layout';
import NavbarPME from './components/PME/NavbarPME';
import ToastContainer from './components/ToastContainer';

// Wrapper qui ajoute la navbar PME
function LayoutPME({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <NavbarPME />
      <div style={{ paddingBottom: 70 }}>{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>

        {/* ── Page d'accueil ────────────────────────────────── */}
        <Route path="/" element={<Landing />} />

        {/* ── Auth investisseur ─────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<InscriptionInvestisseur />} />

        {/* ── Pages investisseur ────────────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
        } />
        <Route path="/depot/nouveau" element={
          <ProtectedRoute roleRequis="investisseur"><Layout><NewDepot /></Layout></ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute roleRequis="investisseur"><Layout><Profil /></Layout></ProtectedRoute>
        } />
        <Route path="/ayants-droit" element={
          <ProtectedRoute roleRequis="investisseur"><Layout><AyantsDroit /></Layout></ProtectedRoute>
        } />
        <Route path="/tableau-bord" element={
          <ProtectedRoute roleRequis="investisseur"><Layout><TableBord /></Layout></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roleRequis="admin"><AdminPanel /></ProtectedRoute>
        } />

        {/* ── Pages PME ─────────────────────────────────────── */}
        <Route path="/pme/inscription" element={<InscriptionPME />} />
        <Route path="/pme/connexion" element={<ConnexionPME />} />
        <Route path="/pme/dashboard" element={
          <ProtectedRoutePME><LayoutPME><DashboardPME /></LayoutPME></ProtectedRoutePME>
        } />
        <Route path="/pme/nouvelle-transaction" element={
          <ProtectedRoutePME><LayoutPME><NouvelleTransaction /></LayoutPME></ProtectedRoutePME>
        } />
        <Route path="/pme/score" element={
          <ProtectedRoutePME><LayoutPME><ScoreBCX /></LayoutPME></ProtectedRoutePME>
        } />
        <Route path="/pme/rapport" element={
          <ProtectedRoutePME><LayoutPME><RapportMensuel /></LayoutPME></ProtectedRoutePME>
        } />
        <Route path="/pme/profil" element={
          <ProtectedRoutePME><LayoutPME><ProfilPME /></LayoutPME></ProtectedRoutePME>
        } />

        {/* ── Redirection par défaut ─────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
