import pool from './db.js';

export async function inserir(usuario) {
  const sql = `
    INSERT INTO usuarios (nome, email, senha, celular, data_nascimento)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const [resultado] = await pool.query(sql, [
    usuario.nome,
    usuario.email,
    usuario.senha,
    usuario.celular,
    usuario.data_nascimento
  ]);
  
  return resultado;
}

export async function buscarPorEmail(email) {
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  const [linhas] = await pool.query(sql, [email]);
  return linhas[0];
}

export async function buscarPorId(id) {
  const sql = 'SELECT id, nome, email, bio, celular, data_nascimento, data_cadastro FROM usuarios WHERE id = ?';
  const [linhas] = await pool.query(sql, [id]);
  return linhas[0];
}

export async function atualizar(id, dados) {
  const sql = `
    UPDATE usuarios 
    SET nome = ?, bio = ?, celular = ?, data_nascimento = ?
    WHERE id = ?
  `;
  
  const [resultado] = await pool.query(sql, [
    dados.nome,
    dados.bio,
    dados.celular,
    dados.data_nascimento,
    id
  ]);
  
  return resultado;
}

export async function listarTodos() {
  const sql = 'SELECT id, nome, email, bio, data_cadastro FROM usuarios';
  const [linhas] = await pool.query(sql);
  return linhas;
}