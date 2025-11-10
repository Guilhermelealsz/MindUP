import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Feed from './pages/feed/Feed';
import Perfil from './pages/perfil/Perfil';
import ProfileEdit from './pages/ProfileEdit/ProfileEdit';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import Notifications from './pages/notifications/Notifications';
import Chat from './pages/chat/Chat';
import ChatDetail from './pages/chat/ChatDetail';
import Settings from './pages/settings/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';

function RotaPrivada({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function RotaAdmin({ children }) {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');

  if (!token) return <Navigate to="/login" />;

  if (usuario) {
    const usuarioData = JSON.parse(usuario);
    if (usuarioData.role !== 'admin') {
      return <Navigate to="/feed" />;
    }
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/feed"
          element={
            <RotaPrivada>
              <Feed />
            </RotaPrivada>
          }
        />

        <Route
          path="/perfil/:id"
          element={
            <RotaPrivada>
              <Perfil />
            </RotaPrivada>
          }
        />

        <Route
          path="/profile-edit/:id"
          element={
            <RotaPrivada>
              <ProfileEdit />
            </RotaPrivada>
          }
        />

        <Route
          path="/notifications"
          element={
            <RotaPrivada>
              <Notifications />
            </RotaPrivada>
          }
        />

        <Route
          path="/chat"
          element={
            <RotaPrivada>
              <Chat />
            </RotaPrivada>
          }
        />

        <Route
          path="/chat/:chatId"
          element={
            <RotaPrivada>
              <ChatDetail />
            </RotaPrivada>
          }
        />

        <Route
          path="/settings"
          element={
            <RotaPrivada>
              <Settings />
            </RotaPrivada>
          }
        />

        <Route
          path="/account-settings"
          element={
            <RotaPrivada>
              <AccountSettings />
            </RotaPrivada>
          }
        />

        <Route
          path="/admin"
          element={
            <RotaAdmin>
              <AdminDashboard />
            </RotaAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
