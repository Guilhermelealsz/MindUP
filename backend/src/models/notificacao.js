import pool from '../config/db.js';

class Notificacao {
  static async create({ usuario_id, mensagem }) {
    const [result] = await pool.execute(
      'INSERT INTO notificacoes (usuario_id, mensagem, lida, data) VALUES (?, ?, false, NOW())',
      [usuario_id, mensagem]
    );
    return result.insertId;
  }

  static async findByUsuarioId(usuario_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY data DESC',
      [usuario_id]
    );
    return rows;
  }

  static async markAsRead(id) {
    await pool.execute('UPDATE notificacoes SET lida = true WHERE id = ?', [id]);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM notificacoes WHERE id = ?', [id]);
  }
}

export default Notificacao;
