import Notificacao from '../models/notificacao.js';

class NotificacaoController {
  static async getByUsuario(req, res) {
    try {
      const notificacoes = await Notificacao.findByUsuarioId(req.params.usuarioId);
      res.json(notificacoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { usuario_id, mensagem } = req.body;
      const id = await Notificacao.create({ usuario_id, mensagem });
      res.status(201).json({ message: 'Notificação criada com sucesso', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      await Notificacao.markAsRead(req.params.id);
      res.json({ message: 'Notificação marcada como lida' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await Notificacao.delete(req.params.id);
      res.json({ message: 'Notificação deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default NotificacaoController;
