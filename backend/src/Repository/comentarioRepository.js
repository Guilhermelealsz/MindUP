import pool from './db.js';

export async function buscarPorPost(postId) {
  const sql = `
    SELECT
      c.*,
      u.nome as autor_nome,
      u.avatar as autor_avatar,
      COUNT(cc.id) as curtidas
    FROM comentarios c
    LEFT JOIN usuarios u ON c.autor_id = u.id
    LEFT JOIN curtidas_comentarios cc ON c.id = cc.comentario_id
    WHERE c.post_id = ?
    GROUP BY c.id
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

export async function curtirComentario(comentarioId, usuarioId) {
  const sql = `
    INSERT INTO curtidas_comentarios (comentario_id, usuario_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE data_curtida = CURRENT_TIMESTAMP
  `;
  const [resultado] = await pool.query(sql, [comentarioId, usuarioId]);
  return resultado;
}

export async function descurtirComentario(comentarioId, usuarioId) {
  const sql = 'DELETE FROM curtidas_comentarios WHERE comentario_id = ? AND usuario_id = ?';
  const [resultado] = await pool.query(sql, [comentarioId, usuarioId]);
  return resultado;
}

export async function verificarCurtidaComentario(comentarioId, usuarioId) {
  const sql = 'SELECT id FROM curtidas_comentarios WHERE comentario_id = ? AND usuario_id = ?';
  const [linhas] = await pool.query(sql, [comentarioId, usuarioId]);
  return linhas.length > 0;
}

export async function contarCurtidasComentario(comentarioId) {
  const sql = 'SELECT COUNT(*) as total FROM curtidas_comentarios WHERE comentario_id = ?';
  const [linhas] = await pool.query(sql, [comentarioId]);
  return linhas[0].total;
}
