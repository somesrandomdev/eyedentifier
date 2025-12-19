import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Protected from './components/Protected';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnrollmentData from './pages/enrollment/EnrollmentData';
import EnrollmentPhoto from './pages/enrollment/EnrollmentPhoto';
import EnrollmentIris from './pages/enrollment/EnrollmentIris';
import EnrollmentSuccess from './pages/enrollment/EnrollmentSuccess';
import Identification from './pages/Identification';
import CitizensList from './pages/CitizensList';
import CitizenDetail from './pages/CitizenDetail';
import History from './pages/History';
import Settings from './pages/Settings';
import Home from './pages/Home';

function App() {
  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route path="/*" element={
        <Protected>
          <Layout>
            <Routes>
              <Route path="/tableau-de-bord" element={<Dashboard />} />

              {/* Enrôlement Wizard */}
              <Route path="/enroler" element={<EnrollmentData />} />
              <Route path="/enroler/donnees" element={<EnrollmentData />} />
              <Route path="/enroler/photo" element={<EnrollmentPhoto />} />
              <Route path="/enroler/iris" element={<EnrollmentIris />} />
              <Route path="/enroler/succes" element={<EnrollmentSuccess />} />

              {/* Autres pages */}
              <Route path="/identifier" element={<Identification />} />
              <Route path="/citoyens" element={<CitizensList />} />
              <Route path="/citoyens/:cni" element={<CitizenDetail />} />
              <Route path="/historique" element={<History />} />
              <Route path="/parametres" element={<Settings />} />

              {/* Route par défaut */}
              <Route path="*" element={<Navigate to="/tableau-de-bord" replace />} />
            </Routes>
          </Layout>
        </Protected>
      } />
    </Routes>
  );
}

export default App;