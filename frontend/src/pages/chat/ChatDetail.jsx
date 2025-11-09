import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarMensagensChat, enviarMensagem, buscarPost, marcarMensagensComoLidas } from '../../api';
import Sidebar from '../../components/Sidebar';
import './Chat.scss';

export default function ChatDetail() {
  const { chatId } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [postCompartilhado, setPostCompartilhado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    carregarMensagens();

    // Atualizar mensagens a cada 5 segundos
    const interval = setInterval(() => {
      carregarMensagens();
    }, 5000);

    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();

    // Marcar mensagens como lidas quando carregadas
    if (mensagens.length > 0) {
      marcarMensagensComoLidas(chatId).catch(error => {
        console.error('Erro ao marcar mensagens como lidas:', error);
      });
    }
  }, [mensagens, chatId]);

  const carregarMensagens = async () => {
    try {
      const mensagensData = await listarMensagensChat(chatId);
      setMensagens(mensagensData);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() && !postCompartilhado) return;

    setEnviando(true);
    try {
      const dados = {};
      if (novaMensagem.trim()) {
        dados.texto = novaMensagem.trim();
      }
      if (postCompartilhado) {
        dados.postId = postCompartilhado.id;
      }

      await enviarMensagem(chatId, dados);
      setNovaMensagem('');
      setPostCompartilhado(null);
      await carregarMensagens();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setEnviando(false);
    }
  };

  const handleCompartilharPost = async (postId) => {
    try {
      const post = await buscarPost(postId);
      setPostCompartilhado(post);
    } catch (error) {
      console.error('Erro ao buscar post:', error);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="chat-page">
        <Sidebar />
        <main className="chat-main">
          <div className="loading">Carregando mensagens...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <Sidebar />
      <main className="chat-main">
        <div className="chat-header">
          <button
            className="back-button"
            onClick={() => navigate('/chat')}
          >
            ← Voltar
          </button>
          <h1>Chat</h1>
        </div>

        <div className="chat-messages">
          {mensagens.length === 0 ? (
            <div className="empty-messages">
              <p>Nenhuma mensagem ainda. Comece a conversa!</p>
            </div>
          ) : (
            mensagens.map(mensagem => (
              <div
                key={mensagem.id}
                className={`message ${mensagem.remetente_id === usuarioAtual.id ? 'own' : 'other'}`}
              >
                <div className="message-avatar">
                  <img
                    src={mensagem.remetente_avatar || '/default-avatar.png'}
                    alt={mensagem.remetente_nome}
                  />
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-author">{mensagem.remetente_nome}</span>
                    <span className="message-time">{formatarData(mensagem.data_envio)}</span>
                  </div>
                  {mensagem.texto && (
                    <div className="message-text">{mensagem.texto}</div>
                  )}
                  {mensagem.post_id && (
                    <div className="message-post">
                      <div className="post-preview">
                        <h4>{mensagem.post_titulo}</h4>
                        <p>{mensagem.post_conteudo?.substring(0, 100)}...</p>
                        {mensagem.post_imagem && (
                          <img src={`http://localhost:3000${mensagem.post_imagem}`} alt="Post" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {postCompartilhado && (
          <div className="post-share-preview">
            <div className="post-preview">
              <h4>Compartilhar: {postCompartilhado.titulo}</h4>
              <p>{postCompartilhado.conteudo?.substring(0, 100)}...</p>
              <button
                className="remove-share"
                onClick={() => setPostCompartilhado(null)}
              >
                Remover
              </button>
            </div>
          </div>
        )}

        <form className="chat-input" onSubmit={handleEnviarMensagem}>
          <input
            type="text"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={enviando}
          />
          <button
            type="submit"
            disabled={enviando || (!novaMensagem.trim() && !postCompartilhado)}
          >
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </main>
    </div>
  );
}
