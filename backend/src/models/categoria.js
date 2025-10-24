import pool from '../config/db.js';

class Categoria {
  static async create({ nome, descricao }) {
    const [result] = await pool.execute(
      'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
      [nome, descricao]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM categorias');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM categorias WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { nome, descricao }) {
    await pool.execute(
      'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
      [nome, descricao, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM categorias WHERE id = ?', [id]);
  }
}

export default Categoria;
