import pool from '../config/db.js';

class Post {
  static async create({ titulo, conteudo, categoria_id, autor_id, imagem }) {
    const [result] = await pool.execute(
      'INSERT INTO posts (titulo, conteudo, categoria_id, autor_id, imagem, data_postagem) VALUES (?, ?, ?, ?, ?, NOW())',
      [titulo, conteudo, categoria_id, autor_id, imagem]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT p.*, u.nome as autor_nome, c.nome as categoria_nome
      FROM posts p
      JOIN usuarios u ON p.autor_id = u.id
      JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.data_postagem DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT p.*, u.nome as autor_nome, c.nome as categoria_nome
      FROM posts p
      JOIN usuarios u ON p.autor_id = u.id
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async update(id, { titulo, conteudo, categoria_id, imagem }) {
    await pool.execute(
      'UPDATE posts SET titulo = ?, conteudo = ?, categoria_id = ?, imagem = ? WHERE id = ?',
      [titulo, conteudo, categoria_id, imagem, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
  }

  static async findByCategoria(categoria_id) {
    const [rows] = await pool.execute(`
      SELECT p.*, u.nome as autor_nome, c.nome as categoria_nome
      FROM posts p
      JOIN usuarios u ON p.autor_id = u.id
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.categoria_id = ?
      ORDER BY p.data_postagem DESC
    `, [categoria_id]);
    return rows;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(`
      SELECT p.*, u.nome as autor_nome, c.nome as categoria_nome
      FROM posts p
      JOIN usuarios u ON p.autor_id = u.id
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.autor_id = ?
      ORDER BY p.data_postagem DESC
    `, [userId]);
    return rows;
  }
}

export default Post;
