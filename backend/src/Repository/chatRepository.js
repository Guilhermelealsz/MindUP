import pool from './db.js';

export async function criarChat(usuario1Id, usuario2Id) {
  // Garantir que usuario1_id seja sempre menor que usuario2_id para evitar duplicatas
  const [menorId, maiorId] = usuario1Id < usuario2Id ? [usuario1Id, usuario2Id] : [usuario2Id, usuario1Id];

  const comando = `
    INSERT IGNORE INTO chats (usuario1_id, usuario2_id)
    VALUES (?, ?)
  `;
  const [resultado] = await pool.query(comando, [menorId, maiorId]);
  return resultado.insertId;
}

export async function buscarChatEntreUsuarios(usuario1Id, usuario2Id) {
  const [menorId, maiorId] = usuario1Id < usuario2Id ? [usuario1Id, usuario2Id] : [usuario2Id, usuario1Id];

  const comando = `
    SELECT * FROM chats
    WHERE usuario1_id = ? AND usuario2_id = ?
  `;
  const [linhas] = await pool.query(comando, [menorId, maiorId]);
  return linhas[0];
}

export async function listarChatsUsuario(usuarioId) {
  const comando = `
    SELECT c.id, c.usuario1_id, c.usuario2_id, c.data_criacao,
           u2.nome as outro_usuario_nome,
           u2.avatar as outro_usuario_avatar,
           c.usuario2_id as outro_usuario_id,
           (SELECT COALESCE(texto, CASE WHEN post_id IS NOT NULL THEN 'Post compartilhado' ELSE NULL END) FROM mensagens WHERE chat_id = c.id ORDER BY data_envio DESC LIMIT 1) as ultima_mensagem,
           COALESCE((SELECT data_envio FROM mensagens WHERE chat_id = c.id ORDER BY data_envio DESC LIMIT 1), c.data_criacao) as data_ultima_mensagem,
           (SELECT COUNT(*) FROM mensagens WHERE chat_id = c.id AND destinatario_id = ? AND lida = FALSE) as nao_lidas
    FROM chats c
    LEFT JOIN usuarios u2 ON c.usuario2_id = u2.id
    WHERE c.usuario1_id = ?
    UNION
    SELECT c.id, c.usuario1_id, c.usuario2_id, c.data_criacao,
           u1.nome as outro_usuario_nome,
           u1.avatar as outro_usuario_avatar,
           c.usuario1_id as outro_usuario_id,
           (SELECT COALESCE(texto, CASE WHEN post_id IS NOT NULL THEN 'Post compartilhado' ELSE NULL END) FROM mensagens WHERE chat_id = c.id ORDER BY data_envio DESC LIMIT 1) as ultima_mensagem,
           COALESCE((SELECT data_envio FROM mensagens WHERE chat_id = c.id ORDER BY data_envio DESC LIMIT 1), c.data_criacao) as data_ultima_mensagem,
           (SELECT COUNT(*) FROM mensagens WHERE chat_id = c.id AND destinatario_id = ? AND lida = FALSE) as nao_lidas
    FROM chats c
    LEFT JOIN usuarios u1 ON c.usuario1_id = u1.id
    WHERE c.usuario2_id = ?
    ORDER BY data_ultima_mensagem DESC
  `;
  const [linhas] = await pool.query(comando, [usuarioId, usuarioId, usuarioId, usuarioId]);
  return linhas;
}

export async function enviarMensagem(chatId, remetenteId, destinatarioId, texto, postId = null) {
  const comando = `
    INSERT INTO mensagens (chat_id, remetente_id, destinatario_id, texto, post_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [resultado] = await pool.query(comando, [chatId, remetenteId, destinatarioId, texto, postId]);
  return resultado.insertId;
}

export async function listarMensagensChat(chatId, usuarioId) {
  // Marcar mensagens como lidas quando o usuário as visualiza
  await pool.query(`
    UPDATE mensagens
    SET lida = TRUE
    WHERE chat_id = ? AND destinatario_id = ? AND lida = FALSE
  `, [chatId, usuarioId]);

  const comando = `
    SELECT m.*, u.nome as remetente_nome, u.avatar as remetente_avatar,
           p.titulo as post_titulo, p.conteudo as post_conteudo, p.imagem as post_imagem, p.video as post_video
    FROM mensagens m
    LEFT JOIN usuarios u ON m.remetente_id = u.id
    LEFT JOIN posts p ON m.post_id = p.id
    WHERE m.chat_id = ?
    ORDER BY m.data_envio ASC
  `;
  const [linhas] = await pool.query(comando, [chatId]);
  return linhas;
}

export async function contarMensagensNaoLidasUsuario(usuarioId) {
  const comando = `
    SELECT COUNT(*) as total
    FROM mensagens
    WHERE destinatario_id = ? AND lida = FALSE
  `;
  const [linhas] = await pool.query(comando, [usuarioId]);
  return linhas[0].total;
}

export async function marcarMensagensComoLidas(chatId, usuarioId) {
  const comando = `
    UPDATE mensagens
    SET lida = TRUE
    WHERE chat_id = ? AND destinatario_id = ? AND lida = FALSE
  `;
  const [resultado] = await pool.query(comando, [chatId, usuarioId]);
  return resultado.affectedRows;
}
