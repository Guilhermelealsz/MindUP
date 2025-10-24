import pool from '../config/db.js';
import bcrypt from 'bcrypt';

class Usuario {
  static async create({ nome, email, senha, bio }) {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, bio, data_cadastro) VALUES (?, ?, ?, ?, NOW())',
      [nome, email, hashedSenha, bio]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT id, nome, email, bio, data_cadastro FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { nome, email, bio }) {
    await pool.execute(
      'UPDATE usuarios SET nome = ?, email = ?, bio = ? WHERE id = ?',
      [nome, email, bio, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  }

  static async getFollowers(userId) {
    const [rows] = await pool.execute(`
      SELECT u.id, u.nome, u.email, u.bio, u.data_cadastro
      FROM usuarios u
      JOIN follows f ON u.id = f.user_id
      WHERE f.following_id = ?
    `, [userId]);
    return rows;
  }

  static async getFollowing(userId) {
    const [rows] = await pool.execute(`
      SELECT u.id, u.nome, u.email, u.bio, u.data_cadastro
      FROM usuarios u
      JOIN follows f ON u.id = f.following_id
      WHERE f.user_id = ?
    `, [userId]);
    return rows;
  }

  static async getFollowersCount(userId) {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM follows WHERE following_id = ?', [userId]);
    return rows[0].count;
  }

  static async getFollowingCount(userId) {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM follows WHERE user_id = ?', [userId]);
    return rows[0].count;
  }
}

export default Usuario;
