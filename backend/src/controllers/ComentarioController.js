import Comentario from '../models/comentario.js';
import Notificacao from '../models/notificacao.js';
import Post from '../models/post.js';

class ComentarioController {
  static async create(req, res) {
    try {
      const { texto, post_id } = req.body;
      const autor_id = req.user.id;
      const id = await Comentario.create({ texto, autor_id, post_id });

      // Criar notificação para o autor do post
      const post = await Post.findById(post_id);
      if (post.autor_id !== autor_id) {
        await Notificacao.create({
          usuario_id: post.autor_id,
          mensagem: `Novo comentário no seu post "${post.titulo}"`
        });
      }

      res.status(201).json({ message: 'Comentário criado com sucesso', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByPostId(req, res) {
    try {
      const comentarios = await Comentario.findByPostId(req.params.postId);
      res.json(comentarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const comentario = await Comentario.findById(req.params.id);
      if (!comentario) {
        return res.status(404).json({ error: 'Comentário não encontrado' });
      }
      // Verificar se o usuário é o autor do comentário ou admin
      if (comentario.autor_id !== req.user.id) {
        return res.status(403).json({ error: 'Não autorizado' });
      }
      await Comentario.delete(req.params.id);
      res.json({ message: 'Comentário deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ComentarioController;
