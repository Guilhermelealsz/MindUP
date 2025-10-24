import pool from '../config/db.js';

class Follow {
  static async create({ user_id, following_id }) {
    const [result] = await pool.execute(
      'INSERT INTO follows (user_id, following_id, data_follow) VALUES (?, ?, NOW())',
      [user_id, following_id]
    );
    return result.insertId;
  }

  static async delete(user_id, following_id) {
    await pool.execute('DELETE FROM follows WHERE user_id = ? AND following_id = ?', [user_id, following_id]);
  }

  static async exists(user_id, following_id) {
    const [rows] = await pool.execute('SELECT id FROM follows WHERE user_id = ? AND following_id = ?', [user_id, following_id]);
    return rows.length > 0;
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
}

export default Follow;
