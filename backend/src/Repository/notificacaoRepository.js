import pool from './db.js';

export async function criarNotificacao(notificacao) {
  const comando = `
    INSERT INTO notificacoes (usuario_id, tipo, ator_id, post_id, comentario_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [resultado] = await pool.query(comando, [
    notificacao.usuario_id,
    notificacao.tipo,
    notificacao.ator_id,
    notificacao.post_id || null,
    notificacao.comentario_id || null
  ]);
  return resultado;
}

export async function listarNotificacoesUsuario(usuarioId) {
  const comando = `
    SELECT n.*, u.nome as ator_nome, u.avatar as ator_avatar,
           p.titulo as post_titulo, c.texto as comentario_texto
    FROM notificacoes n
    LEFT JOIN usuarios u ON n.ator_id = u.id
    LEFT JOIN posts p ON n.post_id = p.id
    LEFT JOIN comentarios c ON n.comentario_id = c.id
    WHERE n.usuario_id = ?
    ORDER BY n.data_notificacao DESC
  `;
  const [linhas] = await pool.query(comando, [usuarioId]);
  return linhas;
}

export async function contarNotificacoesNaoLidas(usuarioId) {
  const comando = `
    SELECT COUNT(*) as total
    FROM notificacoes
    WHERE usuario_id = ? AND lida = FALSE
  `;
  const [linhas] = await pool.query(comando, [usuarioId]);
  return linhas[0].total;
}

export async function marcarComoLida(id, usuarioId) {
  const comando = `
    UPDATE notificacoes
    SET lida = TRUE
    WHERE id = ? AND usuario_id = ?
  `;
  const [resultado] = await pool.query(comando, [id, usuarioId]);
  return resultado.affectedRows > 0;
}

export async function marcarTodasComoLidas(usuarioId) {
  const comando = `
    UPDATE notificacoes
    SET lida = TRUE
    WHERE usuario_id = ? AND lida = FALSE
  `;
  const [resultado] = await pool.query(comando, [usuarioId]);
  return resultado;
}

export async function deletarNotificacao(id, usuarioId) {
  const comando = `
    DELETE FROM notificacoes
    WHERE id = ? AND usuario_id = ?
  `;
  const [resultado] = await pool.query(comando, [id, usuarioId]);
  return resultado.affectedRows > 0;
}

export async function deletarTodasNotificacoes(usuarioId) {
  const comando = `
    DELETE FROM notificacoes
    WHERE usuario_id = ?
  `;
  const [resultado] = await pool.query(comando, [usuarioId]);
  return resultado.affectedRows;
}
