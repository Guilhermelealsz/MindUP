import Curtida from '../models/curtida.js';
import Notificacao from '../models/notificacao.js';
import Post from '../models/post.js';

class CurtidaController {
  static async like(req, res) {
    try {
      const { post_id } = req.body;
      const usuario_id = req.user.id;

      const existingLike = await Curtida.findByUsuarioAndPost(usuario_id, post_id);
      if (existingLike) {
        return res.status(400).json({ error: 'Já curtiu este post' });
      }

      const id = await Curtida.create({ usuario_id, post_id });

      // Criar notificação para o autor do post
      const post = await Post.findById(post_id);
      if (post.autor_id !== usuario_id) {
        await Notificacao.create({
          usuario_id: post.autor_id,
          mensagem: `Seu post "${post.titulo}" recebeu uma curtida`
        });
      }

      res.status(201).json({ message: 'Curtida adicionada com sucesso', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async unlike(req, res) {
    try {
      const post_id = req.params.id;
      const usuario_id = req.user.id;

      await Curtida.delete(usuario_id, post_id);
      res.json({ message: 'Curtida removida com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLikes(req, res) {
    try {
      const total = await Curtida.findByPostId(req.params.id);
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CurtidaController;
