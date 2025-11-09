import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarChats } from '../../api';
import Sidebar from '../../components/Sidebar';
import './Chat.scss';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarChats();

    // Atualizar lista de chats a cada 10 segundos
    const interval = setInterval(() => {
      carregarChats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const carregarChats = async () => {
    try {
      const chatsData = await listarChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin}min`;
    if (diffHoras < 24) return `${diffHoras}h`;
    if (diffDias < 7) return `${diffDias}d`;
    return data.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="chat-page">
        <Sidebar />
        <main className="chat-main">
          <div className="loading">Carregando conversas...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <Sidebar />
      <main className="chat-main">
        <div className="chat-header">
          <h1>Conversas</h1>
          <button
            className="btn-nova-conversa"
            onClick={() => navigate('/feed')}
          >
            + Começar Conversa
          </button>
        </div>

        <div className="chat-list">
          {chats.length === 0 ? (
            <div className="empty-state">
              <p>Você ainda não tem conversas.</p>
              <p>Comece uma conversa visitando o perfil de alguém!</p>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className="chat-item"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <div className="chat-avatar">
                  <img
                    src={chat.outro_usuario_avatar || '/default-avatar.png'}
                    alt={chat.outro_usuario_nome}
                  />
                </div>
                <div className="chat-info">
                  <div className="chat-name">{chat.outro_usuario_nome}</div>
                  <div className="chat-last-message">
                    {chat.ultima_mensagem || 'Nenhuma mensagem ainda'}
                  </div>
                </div>
                <div className="chat-time">
                  {chat.data_ultima_mensagem && formatarData(chat.data_ultima_mensagem)}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
