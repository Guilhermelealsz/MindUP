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

  // Usuários
  async register(userData) {
    const response = await this.request('/usuarios/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

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

  async getProfile(userId) {
    return this.request(`/usuarios/${userId}`);
  }

  async updateProfile(userId, userData) {
    return this.request(`/usuarios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Posts
  async getPosts() {
    return this.request('/posts');
  }

  async getPostById(id) {
    return this.request(`/posts/${id}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id, postData) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getPostsByCategory(categoryId) {
    return this.request(`/posts/categoria/${categoryId}`);
  }

  // Categorias
  async getCategories() {
    return this.request('/categorias');
  }

  async createCategory(categoryData) {
    return this.request('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Comentários
  async createComment(commentData) {
    return this.request('/comentarios', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async getCommentsByPost(postId) {
    return this.request(`/comentarios/post/${postId}`);
  }

  async deleteComment(id) {
    return this.request(`/comentarios/${id}`, {
      method: 'DELETE',
    });
  }

  // Curtidas
  async likePost(postId) {
    return this.request('/curtidas', {
      method: 'POST',
      body: JSON.stringify({ post_id: postId }),
    });
  }

  async unlikePost(postId) {
    return this.request(`/curtidas/${postId}`, {
      method: 'DELETE',
    });
  }

  async getLikes(postId) {
    return this.request(`/curtidas/${postId}`);
  }

  // Notificações
  async getNotifications(userId) {
    return this.request(`/notificacoes/usuario/${userId}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notificacoes/${id}/read`, {
      method: 'PUT',
    });
  }

  // Upload de imagem
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

  // Follow/Unfollow
  async follow(userId) {
    return this.request('/follows', {
      method: 'POST',
      body: JSON.stringify({ following_id: userId }),
    });
  }

  async unfollow(userId) {
    return this.request(`/follows/${userId}`, {
      method: 'DELETE',
    });
  }

  // Additional user methods
  async getUserPosts(userId) {
    return this.request(`/posts/usuario/${userId}`);
  }

  async getFollowing(userId) {
    return this.request(`/usuarios/${userId}/following`);
  }

  async getFollowers(userId) {
    return this.request(`/usuarios/${userId}/followers`);
  }
}

export default new ApiService();
