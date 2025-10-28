const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  }

  // API para registro de usuário
  async register(userData) {
    const response = await this.request('/usuarios/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  // API para login de usuário
  async login(credentials) {
    const response = await this.request('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // API para obter perfil de usuário
  async getProfile(userId) {
    return this.request(`/usuarios/${userId}`);
  }

  // API para atualizar perfil de usuário
  async updateProfile(userId, userData) {
    return this.request(`/usuarios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // API para obter todos os posts
  async getPosts() {
    return this.request('/posts');
  }

  // API para obter post por ID
  async getPostById(id) {
    return this.request(`/posts/${id}`);
  }

  // API para criar post
  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // API para atualizar post
  async updatePost(id, postData) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  // API para deletar post
  async deletePost(id) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // API para obter posts por categoria
  async getPostsByCategory(categoryId) {
    return this.request(`/posts/categoria/${categoryId}`);
  }

  // API para obter todas as categorias
  async getCategories() {
    return this.request('/categorias');
  }

  // API para criar categoria
  async createCategory(categoryData) {
    return this.request('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // API para criar comentário
  async createComment(commentData) {
    return this.request('/comentarios', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  // API para obter comentários por post
  async getCommentsByPost(postId) {
    return this.request(`/comentarios/post/${postId}`);
  }

  // API para deletar comentário
  async deleteComment(id) {
    return this.request(`/comentarios/${id}`, {
      method: 'DELETE',
    });
  }

  // API para curtir post
  async likePost(postId) {
    return this.request('/curtidas', {
      method: 'POST',
      body: JSON.stringify({ post_id: postId }),
    });
  }

  // API para descurtir post
  async unlikePost(postId) {
    return this.request(`/curtidas/${postId}`, {
      method: 'DELETE',
    });
  }

  // API para obter curtidas de um post
  async getLikes(postId) {
    return this.request(`/curtidas/${postId}`);
  }

  // API para obter notificações do usuário
  async getNotifications(userId) {
    return this.request(`/notificacoes/usuario/${userId}`);
  }

  // API para marcar notificação como lida
  async markNotificationAsRead(id) {
    return this.request(`/notificacoes/${id}/read`, {
      method: 'PUT',
    });
  }

  // API para upload de imagem
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('imagem', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro no upload');
    }
    return data;
  }

  // API para seguir usuário
  async follow(userId) {
    return this.request('/follows', {
      method: 'POST',
      body: JSON.stringify({ following_id: userId }),
    });
  }

  // API para deixar de seguir usuário
  async unfollow(userId) {
    return this.request(`/follows/${userId}`, {
      method: 'DELETE',
    });
  }

  // API para obter posts do usuário
  async getUserPosts(userId) {
    return this.request(`/posts/usuario/${userId}`);
  }

  // API para obter usuários que o usuário está seguindo
  async getFollowing(userId) {
    return this.request(`/usuarios/${userId}/following`);
  }

  // API para obter seguidores do usuário
  async getFollowers(userId) {
    return this.request(`/usuarios/${userId}/followers`);
  }
}

export default new ApiService();
