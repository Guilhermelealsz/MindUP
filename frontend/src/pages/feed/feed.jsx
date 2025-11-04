import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarPosts, listarCategorias, criarPost, curtirPost, removerCurtida, listarComentarios, adicionarComentario, deletarComentario, curtirComentario, descurtirComentario } from '../../api';
import Sidebar from '../../components/Sidebar';
import './feed.scss';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoPost, setNovoPost] = useState({ titulo: '', conteudo: '', categoria_id: '' });
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [comentariosVisiveis, setComentariosVisiveis] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [novoComentario, setNovoComentario] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [postsData, categoriasData] = await Promise.all([
        listarPosts(categoriaFiltro),
        listarCategorias()
      ]);
      setPosts(postsData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltroCategoria = async (categoriaId) => {
    setCategoriaFiltro(categoriaId);
    try {
      const postsData = await listarPosts(categoriaId);
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao filtrar posts:', error);
    }
  };

  const handleCriarPost = async (e) => {
    e.preventDefault();
    
    if (!novoPost.titulo || !novoPost.conteudo) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await criarPost(novoPost);
      setMostrarModal(false);
      setNovoPost({ titulo: '', conteudo: '', categoria_id: '' });
      carregarDados();
    } catch (error) {
      alert('Erro ao criar post: ' + (error.response?.data?.erro || 'Erro desconhecido'));
    }
  };

  const handleCurtir = async (postId) => {
    try {
      await curtirPost(postId);
      carregarDados();
    } catch (error) {
      if (error.response?.status === 400) {
        await removerCurtida(postId);
        carregarDados();
      }
    }
  };

  const handleVerPerfil = (autorId) => {
    navigate(`/perfil/${autorId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const toggleComentarios = async (postId) => {
    const visivel = !comentariosVisiveis[postId];
    setComentariosVisiveis({ ...comentariosVisiveis, [postId]: visivel });

    if (visivel && !comentarios[postId]) {
      try {
        const comentariosData = await listarComentarios(postId);
        setComentarios({ ...comentarios, [postId]: comentariosData });
      } catch (error) {
        console.error('Erro ao carregar comentários:', error);
      }
    }
  };

  const handleAdicionarComentario = async (postId, e) => {
    e.preventDefault();
    const texto = novoComentario[postId]?.trim();
    if (!texto) return;

    try {
      await adicionarComentario({ texto, post_id: postId });
      setNovoComentario({ ...novoComentario, [postId]: '' });
      // Recarregar comentários
      const comentariosData = await listarComentarios(postId);
      setComentarios({ ...comentarios, [postId]: comentariosData });
      carregarDados(); // Atualizar contadores
    } catch (error) {
      alert('Erro ao adicionar comentário');
    }
  };

  const handleDeletarComentario = async (comentarioId, postId) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return;

    try {
      await deletarComentario(comentarioId);
      const comentariosData = await listarComentarios(postId);
      setComentarios({ ...comentarios, [postId]: comentariosData });
      carregarDados();
    } catch (error) {
      alert('Erro ao deletar comentário');
    }
  };

  const handleCurtirComentario = async (comentarioId, postId) => {
    try {
      await curtirComentario(comentarioId);
      const comentariosData = await listarComentarios(postId);
      setComentarios({ ...comentarios, [postId]: comentariosData });
    } catch (error) {
      if (error.response?.status === 400) {
        await descurtirComentario(comentarioId);
        const comentariosData = await listarComentarios(postId);
        setComentarios({ ...comentarios, [postId]: comentariosData });
      }
    }
  };

  return (
    <div className="feed-container">
      <Sidebar />

      <div className="feed-content">
        <main className="posts-section">
          <div className="feed-header-actions">
            <button
              className="btn-novo-post"
              onClick={() => setMostrarModal(true)}
            >
              + Novo Post
            </button>

            <div className="categorias-section">
              <h3>Categorias</h3>
              <div className="categorias-buttons">
                <button
                  className={`categoria-item ${!categoriaFiltro ? 'active' : ''}`}
                  onClick={() => handleFiltroCategoria(null)}
                >
                  Todas
                </button>
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    className={`categoria-item ${categoriaFiltro === cat.id ? 'active' : ''}`}
                    onClick={() => handleFiltroCategoria(cat.id)}
                  >
                    {cat.nome}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h2>Feed de Conhecimento</h2>
          
          {carregando ? (
            <div className="loading">Carregando...</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              Nenhum post encontrado. Seja o primeiro a compartilhar conhecimento!
            </div>
          ) : (
            <div className="posts-list">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  <div className="post-header">
                    <div 
                      className="author-info"
                      onClick={() => handleVerPerfil(post.autor_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="author-avatar">
                        {post.autor_nome?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{post.autor_nome}</strong>
                        <span className="post-date">
                          {new Date(post.data_postagem).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    {post.categoria_nome && (
                      <span className="post-categoria">{post.categoria_nome}</span>
                    )}
                  </div>
                  
                  <h3 className="post-titulo">{post.titulo}</h3>
                  <p className="post-conteudo">{post.conteudo}</p>
                  
                  {post.imagem && (
                    <img 
                      src={`http://localhost:3000/uploads/${post.imagem}`} 
                      alt={post.titulo}
                      className="post-imagem"
                    />
                  )}
                  
                  <div className="post-footer">
                    <button
                      className="btn-interacao"
                      onClick={() => handleCurtir(post.id)}
                    >
                      ❤️ {post.total_curtidas || 0}
                    </button>
                    <button
                      className="btn-interacao"
                      onClick={() => toggleComentarios(post.id)}
                    >
                      💬 {post.total_comentarios || 0}
                    </button>
                  </div>

                  {comentariosVisiveis[post.id] && (
                    <div className="comentarios-section">
                      <div className="comentarios-lista">
                        {comentarios[post.id]?.length > 0 ? (
                          comentarios[post.id].map(comentario => (
                            <div key={comentario.id} className="comentario-item">
                              <div className="comentario-header">
                                <div className="comentario-autor">
                                  <strong>{comentario.autor_nome}</strong>
                                  <span className="comentario-data">
                                    {new Date(comentario.data).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                {usuario?.id === comentario.autor_id && (
                                  <button
                                    className="btn-deletar-comentario"
                                    onClick={() => handleDeletarComentario(comentario.id, post.id)}
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                              <p className="comentario-texto">{comentario.texto}</p>
                              <div className="comentario-footer">
                                <button
                                  className="btn-curtir-comentario"
                                  onClick={() => handleCurtirComentario(comentario.id, post.id)}
                                >
                                  👍 {comentario.curtidas || 0}
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="sem-comentarios">Nenhum comentário ainda.</p>
                        )}
                      </div>

                      <form
                        className="form-comentario"
                        onSubmit={(e) => handleAdicionarComentario(post.id, e)}
                      >
                        <input
                          type="text"
                          placeholder="Escreva um comentário..."
                          value={novoComentario[post.id] || ''}
                          onChange={(e) => setNovoComentario({
                            ...novoComentario,
                            [post.id]: e.target.value
                          })}
                        />
                        <button type="submit" className="btn-comentar">
                          Comentar
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Novo Post</h2>
            <form onSubmit={handleCriarPost}>
              <input
                type="text"
                placeholder="Título do post"
                value={novoPost.titulo}
                onChange={(e) => setNovoPost({ ...novoPost, titulo: e.target.value })}
              />
              
              <textarea
                placeholder="Compartilhe seu conhecimento..."
                rows="6"
                value={novoPost.conteudo}
                onChange={(e) => setNovoPost({ ...novoPost, conteudo: e.target.value })}
              />
              
              <select
                value={novoPost.categoria_id}
                onChange={(e) => setNovoPost({ ...novoPost, categoria_id: e.target.value })}
              >
                <option value="">Selecione uma categoria (opcional)</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}