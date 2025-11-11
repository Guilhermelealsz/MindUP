import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listarNotificacoes, contarMensagensNaoLidas } from '../api';
import logo from '../assets/logo.png';
import feedIcon from '../assets/FeedICon.png';
import chatIcon from '../assets/ChatIcon.png';
import notificacaoIcon from '../assets/NotificacaoIcon.png';
import perfilIcon from '../assets/PerfilIcon.png';
import configIcon from '../assets/configIcon.png';
import sairIcon from '../assets/sairICon.png';
import './Sidebar.scss';

export default function Sidebar() {
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  function getAvatarSrc(value) {
    if (!value) return '/default-avatar.png';
    if (typeof value !== 'string') return '/default-avatar.png';
    if (value.startsWith('data:')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/')) return `http://localhost:3000${value}`;
    return `http://localhost:3000/uploads/avatars/${value}`;
  }

  useEffect(() => {
    carregarNotificacoesNaoLidas();
    carregarMensagensNaoLidas();

    // Atualizar a cada 10 segundos para mais responsividade
    const interval = setInterval(() => {
      carregarNotificacoesNaoLidas();
      carregarMensagensNaoLidas();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const carregarNotificacoesNaoLidas = async () => {
    try {
      // Buscar todas as notificações e filtrar as do tipo 'mensagem'
      const all = await listarNotificacoes();
      const filtered = Array.isArray(all) ? all.filter(n => n.tipo !== 'mensagem') : [];
      const count = filtered.filter(n => !n.lida).length;
      setNotificacoesNaoLidas(count || 0);
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
      icon: feedIcon,
      path: '/feed'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: chatIcon,
      path: '/chat',
      badge: mensagensNaoLidas > 0 ? mensagensNaoLidas : null
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: notificacaoIcon,
      path: '/notifications',
      badge: notificacoesNaoLidas > 0 ? notificacoesNaoLidas : null
    },
    {
      id: 'books',
      label: 'Livros',
      icon: feedIcon, // You can replace with a book icon later
      path: '/books'
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: perfilIcon,
      path: `/perfil/${JSON.parse(localStorage.getItem('usuario') || '{}').id}`
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: configIcon,
      path: '/settings'
    },

  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
          <img src={logo} alt="MindUp" className="logo-image" onClick={() => navigate('/feed')} style={{ cursor: 'pointer' }} />
        <div className="user-avatar">
          {usuario.avatar ? (
            <img
              src={getAvatarSrc(usuario.avatar)}
              alt="Avatar"
              className="avatar-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
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
          <div key={item.id}>
            <button
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <img src={item.icon} alt={item.label} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>

          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-item logout-btn"
          onClick={handleLogout}
        >
          <img src={sairIcon} alt="Sair" className="sidebar-icon" />
          <span className="sidebar-label">Sair</span>
        </button>
      </div>
    </aside>
  );
}
