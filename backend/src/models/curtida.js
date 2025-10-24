import pool from '../config/db.js';

class Curtida {
  static async create({ usuario_id, post_id }) {
    const [result] = await pool.execute(
      'INSERT INTO curtidas (usuario_id, post_id) VALUES (?, ?)',
      [usuario_id, post_id]
    );
    return result.insertId;
  }

  static async delete(usuario_id, post_id) {
    await pool.execute(
      'DELETE FROM curtidas WHERE usuario_id = ? AND post_id = ?',
      [usuario_id, post_id]
    );
  }

  static async findByPostId(post_id) {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM curtidas WHERE post_id = ?', [post_id]);
    return rows[0].total;
  }

  static async findByUsuarioAndPost(usuario_id, post_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM curtidas WHERE usuario_id = ? AND post_id = ?',
      [usuario_id, post_id]
    );
    return rows[0];
  }
}

export default Curtida;
