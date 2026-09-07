import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditProfilePage from './pages/profile/EditProfilePage';
import PublicProfilePage from './pages/profile/PublicProfilePage';
// import ExploreDevelopersPage from './pages/profile/ExploreDevelopersPage'; // TODO: yeterli kullanıcı sayısına ulaşınca tekrar aktif et
import ProjectsListPage from './pages/projects/ProjectsListPage';
import ProjectFormPage from './pages/projects/ProjectFormPage';
import GithubPage from './pages/github/GithubPage';
import CertificatesPage from './pages/certificates/CertificatesPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import DevlogListPage from './pages/blog/DevlogListPage';
import DevlogEditorPage from './pages/blog/DevlogEditorPage';
import PublicDevlogPage from './pages/blog/PublicDevlogPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Visitor Routes */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/explore" element={<ExploreDevelopersPage />} /> */} {/* TODO: yeterli kullanıcı sayısına ulaşınca tekrar aktif et */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/p/:slug" element={<PublicProfilePage />} />
          <Route path="/p/:slug/blog" element={<PublicDevlogPage />} />
          <Route path="/p/:slug/blog/:postSlug" element={<PublicDevlogPage />} />

          {/* Authenticated Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<EditProfilePage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/new" element={<ProjectFormPage />} />
            <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="/github" element={<GithubPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/devlog" element={<DevlogListPage />} />
            <Route path="/devlog/new" element={<DevlogEditorPage />} />
            <Route path="/devlog/:id/edit" element={<DevlogEditorPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
