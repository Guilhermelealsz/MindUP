import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  buscarPerfil,
  buscarEstatisticas,
  buscarPostsUsuario,
  listarSeguidores,
  listarSeguindo,
  seguirUsuario,
  deixarDeSeguir,
  verificarSeguindo,
  buscarChat,
  criarChat
} from '../../api';
import './perfil.scss';

export default function Perfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState({ seguidores: 0, seguindo: 0, posts: 0 });
  const [posts, setPosts] = useState([]);
  const [seguidores, setSeguidores] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [estaSeguin, setEstaSeguindo] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('posts'); // posts, seguidores, seguindo
  const [carregando, setCarregando] = useState(true);
  const [meuPerfil, setMeuPerfil] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, [id]);

  const carregarPerfil = async () => {
    try {
      setCarregando(true);
      const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
      setMeuPerfil(parseInt(id) === usuarioLogado.id);

      const [perfilData, statsData, postsData] = await Promise.all([
        buscarPerfil(id),
        buscarEstatisticas(id),
        buscarPostsUsuario(id)
      ]);

      setUsuario(perfilData);
      setStats({ ...statsData, posts: postsData.length });
      setPosts(postsData);

      if (parseInt(id) !== usuarioLogado.id) {
        const { seguindo } = await verificarSeguindo(id);
        setEstaSeguindo(seguindo);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setCarregando(false);
    }
  };

  const carregarSeguidores = async () => {
    try {
      const data = await listarSeguidores(id);
      setSeguidores(data);
    } catch (error) {
      console.error('Erro ao carregar seguidores:', error);
    }
  };

  const carregarSeguindo = async () => {
    try {
      const data = await listarSeguindo(id);
      setSeguindo(data);
    } catch (error) {
      console.error('Erro ao carregar seguindo:', error);
    }
  };

  const handleSeguir = async () => {
    try {
      if (estaSeguin) {
        await deixarDeSeguir(id);
        setEstaSeguindo(false);
        setStats({ ...stats, seguidores: stats.seguidores - 1 });
      } else {
        await seguirUsuario(id);
        setEstaSeguindo(true);
        setStats({ ...stats, seguidores: stats.seguidores + 1 });
      }
    } catch (error) {
      alert('Erro ao seguir/deixar de seguir');
    }
  };

  const handleIniciarChat = async () => {
    try {
      // Primeiro tenta buscar chat existente
      const chatExistente = await buscarChat(id);
      if (chatExistente.chatId) {
        navigate(`/chat/${chatExistente.chatId}`);
      } else {
        // Se não existe, cria um novo
        const novoChat = await criarChat(id);
        navigate(`/chat/${novoChat.chatId}`);
      }
    } catch (error) {
      console.error('Erro ao iniciar chat:', error);
      alert('Erro ao iniciar conversa');
    }
  };

  const mudarAba = (aba) => {
    setAbaAtiva(aba);
    if (aba === 'seguidores' && seguidores.length === 0) {
      carregarSeguidores();
    } else if (aba === 'seguindo' && seguindo.length === 0) {
      carregarSeguindo();
    }
  };

  if (carregando) {
    return (
      <div className="perfil-container">
        <div className="loading">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <button onClick={() => navigate('/feed')} className="btn-voltar">
          ← Voltar
        </button>
        <h1>Perfil</h1>
        <div></div>
      </header>

      <div className="perfil-content">
        {/* Informações do usuário */}
        <div className="perfil-info">
          <div className="perfil-avatar">
            {usuario?.avatar && !avatarError ? (
              <img
                src={`http://localhost:3000${usuario.avatar}`}
                alt="Avatar"
                className="avatar-image"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="avatar-circle">
                {usuario?.nome?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="perfil-detalhes">
            <h2>{usuario?.nome}</h2>
            <p className="perfil-email">{usuario?.email}</p>
            {usuario?.bio && <p className="perfil-bio">{usuario.bio}</p>}

            <div className="perfil-stats">
              <div className="stat">
                <strong>{stats.posts}</strong>
                <span>Posts</span>
              </div>
              <div className="stat" onClick={() => mudarAba('seguidores')}>
                <strong>{stats.seguidores}</strong>
                <span>Seguidores</span>
              </div>
              <div className="stat" onClick={() => mudarAba('seguindo')}>
                <strong>{stats.seguindo}</strong>
                <span>Seguindo</span>
              </div>
            </div>

            {meuPerfil ? (
              <button
                className="btn-editar"
                onClick={() => navigate(`/profile-edit/${id}`)}
              >
                 Editar Perfil
              </button>
            ) : (
              <div className="perfil-acoes">
                <button
                  className={`btn-seguir ${estaSeguin ? 'seguindo' : ''}`}
                  onClick={handleSeguir}
                >
                  {estaSeguin ? 'Seguindo' : 'Seguir'}
                </button>
                {estaSeguin && (
                  <button
                    className="btn-chat"
                    onClick={handleIniciarChat}
                  >
                    💬 Chat
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Abas */}
        <div className="perfil-abas">
          <button 
            className={abaAtiva === 'posts' ? 'active' : ''}
            onClick={() => mudarAba('posts')}
          >
             Posts
          </button>
          <button 
            className={abaAtiva === 'seguidores' ? 'active' : ''}
            onClick={() => mudarAba('seguidores')}
          >
             Seguidores
          </button>
          <button 
            className={abaAtiva === 'seguindo' ? 'active' : ''}
            onClick={() => mudarAba('seguindo')}
          >
             Seguindo
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div className="perfil-conteudo">
          {abaAtiva === 'posts' && (
            <div className="posts-grid">
              {posts.length === 0 ? (
                <p className="empty">Nenhum post ainda</p>
              ) : (
                posts.map(post => (
                  <article key={post.id} className="post-card-mini">
                    <h4>{post.titulo}</h4>
                    <p>{post.conteudo.substring(0, 100)}...</p>
                    <div className="post-footer-mini">
                      <span>❤️ {post.total_curtidas}</span>
                      <span>💬 {post.total_comentarios}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {abaAtiva === 'seguidores' && (
            <div className="usuarios-lista">
              {seguidores.length === 0 ? (
                <p className="empty">Nenhum seguidor ainda</p>
              ) : (
                seguidores.map(seg => (
                  <div key={seg.id} className="usuario-item" onClick={() => navigate(`/perfil/${seg.id}`)}>
                    <div className="avatar-mini">{seg.nome.charAt(0)}</div>
                    <div>
                      <strong>{seg.nome}</strong>
                      <p>{seg.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {abaAtiva === 'seguindo' && (
            <div className="usuarios-lista">
              {seguindo.length === 0 ? (
                <p className="empty">Não está seguindo ninguém</p>
              ) : (
                seguindo.map(seg => (
                  <div key={seg.id} className="usuario-item" onClick={() => navigate(`/perfil/${seg.id}`)}>
                    <div className="avatar-mini">{seg.nome.charAt(0)}</div>
                    <div>
                      <strong>{seg.nome}</strong>
                      <p>{seg.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}