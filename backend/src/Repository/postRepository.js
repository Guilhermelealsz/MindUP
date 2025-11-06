import pool from './db.js';

export async function listarTodos() {
  const sql = `
    SELECT
      p.*,
      u.nome as autor_nome,
      u.avatar as autor_avatar,
      c.nome as categoria_nome,
      COUNT(DISTINCT cu.usuario_id) as total_curtidas,
      COUNT(DISTINCT co.id) as total_comentarios
    FROM posts p
    LEFT JOIN usuarios u ON p.autor_id = u.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN curtidas cu ON p.id = cu.post_id
    LEFT JOIN comentarios co ON p.id = co.post_id
    GROUP BY p.id
    ORDER BY p.data_postagem DESC
  `;

  const [linhas] = await pool.query(sql);
  return linhas;
}

export async function buscarPorId(id) {
  const sql = `
    SELECT
      p.*,
      u.nome as autor_nome,
      u.avatar as autor_avatar,
      c.nome as categoria_nome,
      COUNT(DISTINCT cu.usuario_id) as total_curtidas,
      COUNT(DISTINCT co.id) as total_comentarios
    FROM posts p
    LEFT JOIN usuarios u ON p.autor_id = u.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN curtidas cu ON p.id = cu.post_id
    LEFT JOIN comentarios co ON p.id = co.post_id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  const [linhas] = await pool.query(sql, [id]);
  return linhas[0];
}

export async function buscarPorCategoria(categoriaId) {
  const sql = `
    SELECT
      p.*,
      u.nome as autor_nome,
      u.avatar as autor_avatar,
      c.nome as categoria_nome,
      COUNT(DISTINCT cu.usuario_id) as total_curtidas,
      COUNT(DISTINCT co.id) as total_comentarios
    FROM posts p
    LEFT JOIN usuarios u ON p.autor_id = u.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN curtidas cu ON p.id = cu.post_id
    LEFT JOIN comentarios co ON p.id = co.post_id
    WHERE p.categoria_id = ?
    GROUP BY p.id
    ORDER BY p.data_postagem DESC
  `;

  const [linhas] = await pool.query(sql, [categoriaId]);
  return linhas;
}

export async function inserir(post) {
  const sql = `
    INSERT INTO posts (titulo, conteudo, imagem, video, categoria_id, autor_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [resultado] = await pool.query(sql, [
    post.titulo,
    post.conteudo,
    post.imagem,
    post.video,
    post.categoria_id,
    post.autor_id
  ]);

  return resultado;
}

export async function atualizar(id, dados) {
  const sql = `
    UPDATE posts 
    SET titulo = ?, conteudo = ?, categoria_id = ?
    WHERE id = ?
  `;
  
  const [resultado] = await pool.query(sql, [
    dados.titulo,
    dados.conteudo,
    dados.categoria_id,
    id
  ]);
  
  return resultado;
}

export async function deletar(id) {
  const sql = 'DELETE FROM posts WHERE id = ?';
  const [resultado] = await pool.query(sql, [id]);
  return resultado;
}

export async function curtir(postId, usuarioId) {
  const sql = 'INSERT INTO curtidas (post_id, usuario_id) VALUES (?, ?)';
  const [resultado] = await pool.query(sql, [postId, usuarioId]);
  return resultado;
}

export async function removerCurtida(postId, usuarioId) {
  const sql = 'DELETE FROM curtidas WHERE post_id = ? AND usuario_id = ?';
  const [resultado] = await pool.query(sql, [postId, usuarioId]);
  return resultado;
}

export async function contarCurtidas(postId) {
  const sql = 'SELECT COUNT(*) as total FROM curtidas WHERE post_id = ?';
  const [linhas] = await pool.query(sql, [postId]);
  return linhas[0].total;
}

export async function buscarPorAutor(autorId) {
  const sql = `
    SELECT
      p.*,
      u.nome as autor_nome,
      u.avatar as autor_avatar,
      c.nome as categoria_nome,
      COUNT(DISTINCT cu.usuario_id) as total_curtidas,
      COUNT(DISTINCT co.id) as total_comentarios
    FROM posts p
    LEFT JOIN usuarios u ON p.autor_id = u.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN curtidas cu ON p.id = cu.post_id
    LEFT JOIN comentarios co ON p.id = co.post_id
    WHERE p.autor_id = ?
    GROUP BY p.id
    ORDER BY p.data_postagem DESC
  `;

  const [linhas] = await pool.query(sql, [autorId]);
  return linhas;
}

export async function contarPostsUsuario(autorId) {
  const sql = 'SELECT COUNT(*) as total FROM posts WHERE autor_id = ?';
  const [linhas] = await pool.query(sql, [autorId]);
  return linhas[0].total;
}