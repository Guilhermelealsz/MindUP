import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarPosts, listarCategorias, criarPost, curtirPost, removerCurtida } from '../../api';
import './feed.scss';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoPost, setNovoPost] = useState({ titulo: '', conteudo: '', categoria_id: '' });
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  
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

  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="logo">
          <h1>MINDUP</h1>
        </div>
        <div className="user-section">
          <span onClick={() => navigate(`/perfil/${usuario?.id}`)} style={{cursor: 'pointer'}}>
            👤 {usuario?.nome}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <div className="feed-content">
        <aside className="sidebar">
          <button 
            className="btn-novo-post"
            onClick={() => setMostrarModal(true)}
          >
            + Novo Post
          </button>

          <div className="categorias-section">
            <h3>Categorias</h3>
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
        </aside>

        <main className="posts-section">
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
                    <button className="btn-interacao">
                      💬 {post.total_comentarios || 0}
                    </button>
                  </div>
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