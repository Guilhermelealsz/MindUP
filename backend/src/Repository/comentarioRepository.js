import pool from './db.js';

export async function buscarPorPost(postId) {
  const sql = `
    SELECT 
      c.*,
      u.nome as autor_nome
    FROM comentarios c
    LEFT JOIN usuarios u ON c.autor_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.data DESC
  `;
  
  const [linhas] = await pool.query(sql, [postId]);
  return linhas;
}

export async function buscarPorId(id) {
  const sql = 'SELECT * FROM comentarios WHERE id = ?';
  const [linhas] = await pool.query(sql, [id]);
  return linhas[0];
}

export async function inserir(comentario) {
  const sql = `
    INSERT INTO comentarios (texto, autor_id, post_id)
    VALUES (?, ?, ?)
  `;
  
  const [resultado] = await pool.query(sql, [
    comentario.texto,
    comentario.autor_id,
    comentario.post_id
  ]);
  
  return resultado;
}

export async function deletar(id) {
  const sql = 'DELETE FROM comentarios WHERE id = ?';
  const [resultado] = await pool.query(sql, [id]);
  return resultado;
}