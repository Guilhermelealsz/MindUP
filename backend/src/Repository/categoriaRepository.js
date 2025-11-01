import pool from './db.js';

export async function listarTodas() {
  const sql = 'SELECT * FROM categorias ORDER BY nome';
  const [linhas] = await pool.query(sql);
  return linhas;
}

export async function buscarPorId(id) {
  const sql = 'SELECT * FROM categorias WHERE id = ?';
  const [linhas] = await pool.query(sql, [id]);
  return linhas[0];
}

export async function inserir(categoria) {
  const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)';
  const [resultado] = await pool.query(sql, [categoria.nome, categoria.descricao]);
  return resultado;
}