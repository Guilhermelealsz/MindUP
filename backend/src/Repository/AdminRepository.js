import pool from './db.js';

export async function buscarTodosUsuarios() {
  const sql = `
    SELECT id, nome, username, email, celular, bio, avatar, data_cadastro, role, banned, ban_reason, ban_date
    FROM usuarios
    ORDER BY data_cadastro DESC
  `;
  const [linhas] = await pool.query(sql);
  return linhas;
}

export async function buscarEstatisticas() {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM usuarios) as total_usuarios,
      (SELECT COUNT(*) FROM usuarios WHERE banned = true) as usuarios_banidos,
      (SELECT COUNT(*) FROM usuarios WHERE role = 'admin') as administradores,
      (SELECT COUNT(*) FROM posts) as total_posts,
      (SELECT COUNT(*) FROM comentarios) as total_comentarios,
      (SELECT COUNT(*) FROM curtidas) as total_curtidas,
      (SELECT COUNT(*) FROM chats) as total_chats,
      (SELECT COUNT(*) FROM mensagens) as total_mensagens
  `;
  const [linhas] = await pool.query(sql);
  return linhas[0];
}

export async function banirUsuario(id, motivo, adminId) {
  const sql = `
    UPDATE usuarios
    SET banned = true, ban_reason = ?, ban_date = NOW()
    WHERE id = ?
  `;
  await pool.query(sql, [motivo, id]);

  // Add to banned emails and phones
  const usuario = await buscarPorId(id);
  if (usuario.email) {
    await pool.query('INSERT INTO banned_emails (email, ban_reason, banned_by) VALUES (?, ?, ?)', [usuario.email, motivo, adminId]);
  }
  if (usuario.celular) {
    await pool.query('INSERT INTO banned_phones (phone, ban_reason, banned_by) VALUES (?, ?, ?)', [usuario.celular, motivo, adminId]);
  }
}

export async function desbanirUsuario(id) {
  const sql = `
    UPDATE usuarios
    SET banned = false, ban_reason = NULL, ban_date = NULL
    WHERE id = ?
  `;
  await pool.query(sql, [id]);

  // Remove from banned lists
  const usuario = await buscarPorId(id);
  if (usuario.email) {
    await pool.query('DELETE FROM banned_emails WHERE email = ?', [usuario.email]);
  }
  if (usuario.celular) {
    await pool.query('DELETE FROM banned_phones WHERE phone = ?', [usuario.celular]);
  }
}

export async function buscarLogsAdmin() {
  const sql = `
    SELECT
      l.id,
      l.action,
      l.details,
      l.ip_address,
      l.user_agent,
      l.data_log,
      a.nome as admin_nome,
      u.nome as target_nome
    FROM admin_logs l
    LEFT JOIN usuarios a ON l.admin_id = a.id
    LEFT JOIN usuarios u ON l.target_user_id = u.id
    ORDER BY l.data_log DESC
    LIMIT 1000
  `;
  const [linhas] = await pool.query(sql);
  return linhas;
}

export async function logAdminAction(adminId, action, targetUserId, details, ipAddress, userAgent) {
  const sql = `
    INSERT INTO admin_logs (admin_id, action, target_user_id, details, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await pool.query(sql, [adminId, action, targetUserId, details, ipAddress, userAgent]);
}

export async function buscarPorId(id) {
  const sql = 'SELECT id, nome, username, email, senha, bio, avatar, celular, data_nascimento, data_cadastro, role, banned, ban_reason, ban_date FROM usuarios WHERE id = ?';
  const [linhas] = await pool.query(sql, [id]);
  return linhas[0];
}
