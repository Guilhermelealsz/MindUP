import Post from '../models/post.js';
import Notificacao from '../models/notificacao.js';

class PostController {
  static async getAll(req, res) {
    try {
      const posts = await Post.findAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { titulo, conteudo, categoria_id, imagem } = req.body;
      const autor_id = req.user.id; // Assumindo que o middleware de auth adiciona req.user
      const id = await Post.create({ titulo, conteudo, categoria_id, autor_id, imagem });
      res.status(201).json({ message: 'Post criado com sucesso', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { titulo, conteudo, categoria_id, imagem } = req.body;
      await Post.update(req.params.id, { titulo, conteudo, categoria_id, imagem });
      res.json({ message: 'Post atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await Post.delete(req.params.id);
      res.json({ message: 'Post deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByCategoria(req, res) {
    try {
      const posts = await Post.findByCategoria(req.params.categoriaId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByUser(req, res) {
    try {
      const posts = await Post.findByUser(req.params.userId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default PostController;
