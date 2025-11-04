import pool from './db.js';

export async function seguir(seguidorId, seguindoId) {
  const sql = 'INSERT INTO seguidores (seguidor_id, seguindo_id) VALUES (?, ?)';
  const [resultado] = await pool.query(sql, [seguidorId, seguindoId]);
  return resultado;
}

export async function deixarDeSeguir(seguidorId, seguindoId) {
  const sql = 'DELETE FROM seguidores WHERE seguidor_id = ? AND seguindo_id = ?';
  const [resultado] = await pool.query(sql, [seguidorId, seguindoId]);
  return resultado;
}

export async function verificarSeguindo(seguidorId, seguindoId) {
  const sql = 'SELECT * FROM seguidores WHERE seguidor_id = ? AND seguindo_id = ?';
  const [linhas] = await pool.query(sql, [seguidorId, seguindoId]);
  return linhas.length > 0;
}

export async function listarSeguidores(usuarioId) {
  const sql = `
    SELECT
      u.id,
      u.nome,
      u.email,
      u.bio,
      s.data_seguimento
    FROM seguidores s
    INNER JOIN usuarios u ON s.seguidor_id = u.id
    WHERE s.seguindo_id = ?
    ORDER BY s.data_seguimento DESC
  `;
  const [linhas] = await pool.query(sql, [usuarioId]);
  return linhas;
}

export async function listarSeguindo(usuarioId) {
  const sql = `
    SELECT
      u.id,
      u.nome,
      u.email,
      u.bio,
      s.data_seguimento
    FROM seguidores s
    INNER JOIN usuarios u ON s.seguindo_id = u.id
    WHERE s.seguidor_id = ?
    ORDER BY s.data_seguimento DESC
  `;
  const [linhas] = await pool.query(sql, [usuarioId]);
  return linhas;
}

export async function contarSeguidores(usuarioId) {
  const sql = 'SELECT COUNT(*) as total FROM seguidores WHERE seguindo_id = ?';
  const [linhas] = await pool.query(sql, [usuarioId]);
  return linhas[0].total;
}

export async function contarSeguindo(usuarioId) {
  const sql = 'SELECT COUNT(*) as total FROM seguidores WHERE seguidor_id = ?';
  const [linhas] = await pool.query(sql, [usuarioId]);
  return linhas[0].total;
}