import pool from '../config/db.js';

class Comentario {
  static async create({ texto, autor_id, post_id }) {
    const [result] = await pool.execute(
      'INSERT INTO comentarios (texto, autor_id, post_id, data) VALUES (?, ?, ?, NOW())',
      [texto, autor_id, post_id]
    );
    return result.insertId;
  }

  static async findByPostId(post_id) {
    const [rows] = await pool.execute(`
      SELECT c.*, u.nome as autor_nome
      FROM comentarios c
      JOIN usuarios u ON c.autor_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.data DESC
    `, [post_id]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM comentarios WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    await pool.execute('DELETE FROM comentarios WHERE id = ?', [id]);
  }
}

export default Comentario;
