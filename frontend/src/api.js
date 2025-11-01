import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cadastrarUsuario = async (dados) => {
  const response = await api.post('/usuarios', dados);
  return response.data;
};

export const fazerLogin = async (email, senha) => {
  const response = await api.post('/login', { email, senha });
  return response.data;
};

export const buscarPerfil = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const atualizarPerfil = async (id, dados) => {
  const response = await api.put(`/usuarios/${id}`, dados);
  return response.data;
};

export const listarPosts = async (categoriaId = null) => {
  const url = categoriaId ? `/posts?categoria_id=${categoriaId}` : '/posts';
  const response = await api.get(url);
  return response.data;
};

export const buscarPost = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const criarPost = async (dados) => {
  const formData = new FormData();
  formData.append('titulo', dados.titulo);
  formData.append('conteudo', dados.conteudo);
  if (dados.categoria_id) {
    formData.append('categoria_id', dados.categoria_id);
  }
  if (dados.imagem) {
    formData.append('imagem', dados.imagem);
  }

  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const editarPost = async (id, dados) => {
  const response = await api.put(`/posts/${id}`, dados);
  return response.data;
};

export const deletarPost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export const curtirPost = async (id) => {
  const response = await api.post(`/posts/${id}/curtir`);
  return response.data;
};

export const removerCurtida = async (id) => {
  const response = await api.delete(`/posts/${id}/curtir`);
  return response.data;
};

export const buscarCurtidas = async (id) => {
  const response = await api.get(`/posts/${id}/curtidas`);
  return response.data;
};

export const listarComentarios = async (postId) => {
  const response = await api.get(`/comentarios/${postId}`);
  return response.data;
};

export const adicionarComentario = async (dados) => {
  const response = await api.post('/comentarios', dados);
  return response.data;
};

export const deletarComentario = async (id) => {
  const response = await api.delete(`/comentarios/${id}`);
  return response.data;
};

export const listarCategorias = async () => {
  const response = await api.get('/categorias');
  return response.data;
};

export const criarCategoria = async (dados) => {
  const response = await api.post('/categorias', dados);
  return response.data;
};
// Funções de Seguidores
export const seguirUsuario = async (id) => {
  const response = await api.post(`/usuarios/${id}/seguir`);
  return response.data;
};

export const deixarDeSeguir = async (id) => {
  const response = await api.delete(`/usuarios/${id}/seguir`);
  return response.data;
};

export const verificarSeguindo = async (id) => {
  const response = await api.get(`/usuarios/${id}/seguindo`);
  return response.data;
};

export const listarSeguidores = async (id) => {
  const response = await api.get(`/usuarios/${id}/seguidores`);
  return response.data;
};

export const listarSeguindo = async (id) => {
  const response = await api.get(`/usuarios/${id}/seguindo-lista`);
  return response.data;
};

export const buscarEstatisticas = async (id) => {
  const response = await api.get(`/usuarios/${id}/stats`);
  return response.data;
};

export const buscarPostsUsuario = async (id) => {
  const response = await api.get(`/usuarios/${id}/posts`);
  return response.data;
};

export default api;