import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listarNotificacoes, contarMensagensNaoLidas, listarChats } from '../api';
import logo from '../assets/image 27.png';
import './Sidebar.scss';

export default function Sidebar() {
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const [chatsRecentes, setChatsRecentes] = useState([]);
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
    carregarChatsRecentes();

    // Atualizar a cada 10 segundos para mais responsividade
    const interval = setInterval(() => {
      carregarNotificacoesNaoLidas();
      carregarMensagensNaoLidas();
      carregarChatsRecentes();
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

  const carregarChatsRecentes = async () => {
    try {
      const chats = await listarChats();
      // Limitar a 5 conversas mais recentes
      setChatsRecentes(chats.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar chats recentes:', error);
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
      badge: mensagensNaoLidas > 0 ? mensagensNaoLidas : null,
      showChats: true
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
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>
            {item.showChats && location.pathname.startsWith('/chat') && (
              <div className="chat-list-sidebar">
                {chatsRecentes.map(chat => (
                    <div
                      key={chat.id}
                      className={`chat-item-sidebar ${location.pathname === `/chat/${chat.id}` ? 'active' : ''}`}
                      onClick={() => navigate(`/chat/${chat.id}`)}
                    >
                      <img
                        src={getAvatarSrc(chat.outro_usuario_avatar)}
                        alt={chat.outro_usuario_nome}
                        className="chat-avatar-sidebar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div className="chat-info-sidebar">
                        <div className="chat-name-sidebar">{chat.outro_usuario_nome}</div>
                        <div className="chat-last-message-sidebar">
                          {chat.ultima_mensagem || 'Nenhuma mensagem'}
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            )}
          </div>
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
