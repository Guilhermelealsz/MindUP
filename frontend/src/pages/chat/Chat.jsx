import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarChats } from '../../api';
import Sidebar from '../../components/Sidebar';
import './Chat.scss';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarChats();
    const interval = setInterval(carregarChats, 7000);
    return () => clearInterval(interval);
  }, []);

  function getAvatarSrc(value) {
    if (!value) return '/default-avatar.png';
    if (typeof value !== 'string') return '/default-avatar.png';
    if (value.startsWith('data:')) return value; // preview data URL
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/')) return `http://localhost:3000${value}`;
    // fallback: assume filename under uploads/avatars
    return `http://localhost:3000/uploads/avatars/${value}`;
  }

  const carregarChats = async () => {
    setLoading(true);
    try {
      const chatsData = await listarChats();

      // usar o campo nao_lidas retornado pelo backend (quando presente)
      const chatsComNaoLidas = (chatsData || []).map(chat => ({
        ...chat,
        mensagens_nao_lidas: chat.nao_lidas || 0
      }));

      setChats(chatsComNaoLidas);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    }
    setLoading(false);
  };

  const filtrarChats = () =>
    chats.filter(
      chat =>
        chat.outro_usuario_nome?.toLowerCase().includes(busca.toLowerCase()) ||
        (chat.ultima_mensagem || '').toLowerCase().includes(busca.toLowerCase())
    );

  return (
    <div className="chat-container">
      <Sidebar />
      <main className="chat-main">
        <header className="chat-header">
          <h2>Conversas</h2>
          <input
            className="chat-search"
            placeholder="Buscar..."
            value={busca}
            onChange={ev => setBusca(ev.target.value)}
          />
        </header>
        {loading ? (
          <div className="loading">Carregando conversas...</div>
        ) : filtrarChats().length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não tem conversas.</p>
            <p>Comece uma conversa visitando o perfil de alguém!</p>
          </div>
        ) : (
          <div className="chat-list">
            {filtrarChats().map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${chat.mensagens_nao_lidas ? 'unread' : ''}`}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <div className="chat-avatar">
                  <img
                    src={getAvatarSrc(chat.outro_usuario_avatar)}
                    alt={chat.outro_usuario_nome}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
                <div className="chat-info">
                  <strong className="chat-name">{chat.outro_usuario_nome}</strong>
                  <div className="chat-last-message">
                    {chat.ultima_mensagem || <i>Nenhuma mensagem ainda</i>}
                  </div>
                </div>
                <div className="chat-time">
                  {chat.data_ultima_mensagem && formatarData(chat.data_ultima_mensagem)}
                  {chat.mensagens_nao_lidas > 0 && (
                    <span className="unread-count">{chat.mensagens_nao_lidas}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function formatarData(dataString) {
  const data = new Date(dataString);
  const agora = new Date();
  const diffMs = agora - data;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMin / 60);
  const diffDias = Math.floor(diffHoras / 24);
  const mesmoAno = data.getFullYear() === agora.getFullYear();

  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${diffMin}min`;
  if (diffHoras < 24) return `${diffHoras}h`;
  if (diffDias < 7) return `${diffDias}d`;
  
  const opcoes = mesmoAno 
    ? { day: '2-digit', month: 'short' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  
  return data.toLocaleDateString('pt-BR', opcoes);
}