import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarMensagensChat, enviarMensagem, marcarMensagensComoLidas } from '../../api';
import Sidebar from '../../components/Sidebar';
import './Chat.scss';

export default function ChatDetail() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState([]);
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => { 
    carregarMensagens(); 
    marcarComoLidas(); 
    
  }, [chatId]);

  useEffect(() => {
    const interval = setInterval(carregarMensagens, 5000);
    return () => clearInterval(interval);
    
  }, [chatId]);
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  async function carregarMensagens() {
    setLoading(true);
    try {
      const ms = await listarMensagensChat(chatId);
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      ms.forEach(msg => {
        msg.eh_sua = msg.remetente_id === usuario.id;
      });
      setMsgs(ms);
    } catch {
      alert('Erro ao buscar mensagens');
    }
    setLoading(false);
  }

  async function marcarComoLidas() {
    try {
      await marcarMensagensComoLidas(chatId);
    } catch { /* ignora */ }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!conteudo.trim()) return;
    try {
      await enviarMensagem(chatId, { texto: conteudo });
      setConteudo('');
      await carregarMensagens();
    } catch {
      alert('Erro ao enviar');
    }
  }

  return (
    <div className="chat-container">
      <Sidebar />
      <main className="chat-detail-main">
        <div className="chat-messages-list">
          {loading ? (
            <div className="loading">Carregando mensagens...</div>
          ) : msgs.length === 0 ? (
            <div className="empty-messages">Nenhuma mensagem.</div>
          ) : (
            msgs.map((msg, i) => (
              <div
                className={`chat-message ${msg.eh_sua ? 'own-message' : ''}`}
                key={msg.id || i}
                ref={i === msgs.length - 1 ? scrollRef : null}
              >
                {!msg.eh_sua && (
                  <div 
                    className="chat-avatar-container"
                    onClick={() => navigate(`/perfil/${msg.remetente_id}`)}
                  >
                    {msg.remetente_avatar && typeof msg.remetente_avatar === 'string' ? (
                      <img
                        className="chat-msg-avatar"
                        src={
                          msg.remetente_avatar.startsWith('http') ? msg.remetente_avatar : `http://localhost:3000${msg.remetente_avatar}`
                        }
                        alt={msg.remetente_nome}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <div className="chat-msg-avatar avatar-circle">
                        {msg.remetente_nome?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                {msg.post_id ? (
                  <div className="shared-post">
                    <div className="shared-post-header">
                      📤 Post compartilhado
                    </div>
                    <div className="shared-post-content">
                      <h4>{msg.post_titulo}</h4>
                      <p>{msg.post_conteudo}</p>
                      {msg.post_imagem && (
                        <img
                          src={`http://localhost:3000/uploads/${msg.post_imagem}`}
                          alt={msg.post_titulo}
                          className="shared-post-image"
                        />
                      )}
                      {msg.post_video && (
                        <video
                          src={`http://localhost:3000/uploads/${msg.post_video}`}
                          controls
                          className="shared-post-video"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="bubble">{msg.texto}</span>
                )}
                <span className="time">{formatarHora(msg.data_envio)}</span>
              </div>
            ))
          )}
        </div>
        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Digite sua mensagem"
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !conteudo.trim()}>
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
}

function formatarHora(data) {
  const date = new Date(data);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}