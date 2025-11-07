import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listarNotificacoesNaoLidas, contarMensagensNaoLidas } from '../api';
import logo from '../assets/image 27.png';
import './Sidebar.scss';

export default function Sidebar() {
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    carregarNotificacoesNaoLidas();
    carregarMensagensNaoLidas();

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      carregarNotificacoesNaoLidas();
      carregarMensagensNaoLidas();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const carregarNotificacoesNaoLidas = async () => {
    try {
      const response = await listarNotificacoesNaoLidas();
      setNotificacoesNaoLidas(response.notificacoes || 0);
    } catch (error) {
      console.error('Erro ao carregar notificações não lidas:', error);
    }
  };

  const carregarMensagensNaoLidas = async () => {
    try {
      const response = await contarMensagensNaoLidas();
      setMensagensNaoLidas(response.total || 0);
    } catch (error) {
      console.error('Erro ao carregar mensagens não lidas:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const menuItems = [
    {
      id: 'feed',
      label: 'Feed',
      icon: '',
      path: '/feed'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: '',
      path: '/chat',
      badge: mensagensNaoLidas > 0 ? mensagensNaoLidas : null
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: '',
      path: '/notifications',
      badge: notificacoesNaoLidas > 0 ? notificacoesNaoLidas : null
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: '',
      path: `/perfil/${JSON.parse(localStorage.getItem('usuario') || '{}').id}`
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: '',
      path: '/settings'
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="MindUp" className="logo-image" />
        <div className="user-avatar">
          {usuario.avatar ? (
            <img
              src={`http://localhost:3000${usuario.avatar}`}
              alt="Avatar"
              className="avatar-image"
            />
          ) : (
            <div className="avatar-circle">
              {usuario.nome?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {item.badge && (
              <span className="sidebar-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-item logout-btn"
          onClick={handleLogout}
        >
          <span className="sidebar-icon"></span>
          <span className="sidebar-label">Sair</span>
        </button>
      </div>
    </aside>
  );
}
