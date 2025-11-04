import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarNotificacoes, marcarNotificacaoComoLida, marcarTodasComoLidas } from '../../api';
import Sidebar from '../../components/Sidebar';
import './Notifications.scss';

export default function Notifications() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      setCarregando(true);
      const data = await listarNotificacoes();
      setNotificacoes(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleMarcarComoLida = async (id) => {
    try {
      await marcarNotificacaoComoLida(id);
      setNotificacoes(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, lida: true } : notif
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMarcarTodasComoLidas = async () => {
    try {
      await marcarTodasComoLidas();
      setNotificacoes(prev =>
        prev.map(notif => ({ ...notif, lida: true }))
      );
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleNotificacaoClick = async (notificacao) => {
    // Marcar como lida se não estiver
    if (!notificacao.lida) {
      await handleMarcarComoLida(notificacao.id);
    }

    // Navegar baseado no tipo de notificação
    if (notificacao.tipo === 'curtida_post' && notificacao.post_id) {
      navigate('/feed'); // Por enquanto, vai para o feed
    } else if (notificacao.tipo === 'comentario' && notificacao.post_id) {
      navigate('/feed'); // Por enquanto, vai para o feed
    } else if (notificacao.tipo === 'curtida_comentario') {
      navigate('/feed'); // Por enquanto, vai para o feed
    } else if (notificacao.tipo === 'seguidor' && notificacao.ator_id) {
      navigate(`/perfil/${notificacao.ator_id}`);
    }
  };

  const formatarMensagem = (notificacao) => {
    const atorNome = notificacao.ator_nome || 'Alguém';

    switch (notificacao.tipo) {
      case 'curtida_post':
        return `${atorNome} curtiu seu post "${notificacao.post_titulo || 'post'}"`;
      case 'comentario':
        return `${atorNome} comentou em seu post "${notificacao.post_titulo || 'post'}"`;
      case 'curtida_comentario':
        return `${atorNome} curtiu seu comentário`;
      case 'seguidor':
        return `${atorNome} começou a seguir você`;
      default:
        return 'Nova notificação';
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin}min atrás`;
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias < 7) return `${diffDias}d atrás`;

    return data.toLocaleDateString('pt-BR');
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);

  return (
    <div className="notifications-page">
      <Sidebar />

      <main className="notifications-content">
        <header className="notifications-header">
          <h1>Notificações</h1>
          {notificacoesNaoLidas.length > 0 && (
            <button
              className="btn-marcar-todas"
              onClick={handleMarcarTodasComoLidas}
            >
              Marcar todas como lidas
            </button>
          )}
        </header>

        <div className="notifications-list">
          {carregando ? (
            <div className="loading">Carregando notificações...</div>
          ) : notificacoes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>Nenhuma notificação</h3>
              <p>Você não tem notificações no momento.</p>
            </div>
          ) : (
            notificacoes.map(notificacao => (
              <div
                key={notificacao.id}
                className={`notification-item ${!notificacao.lida ? 'unread' : ''}`}
                onClick={() => handleNotificacaoClick(notificacao)}
              >
                <div className="notification-avatar">
                  {notificacao.ator_avatar ? (
                    <img
                      src={`http://localhost:3000/uploads/${notificacao.ator_avatar}`}
                      alt={notificacao.ator_nome}
                    />
                  ) : (
                    notificacao.ator_nome?.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="notification-content">
                  <p className="notification-message">
                    {formatarMensagem(notificacao)}
                  </p>
                  <span className="notification-time">
                    {formatarData(notificacao.data_notificacao)}
                  </span>
                </div>

                {!notificacao.lida && (
                  <div className="notification-indicator"></div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
