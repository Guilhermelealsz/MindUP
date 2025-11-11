import pool from './db.js';

export async function inserir(usuario) {
  const sql = `
    INSERT INTO usuarios (nome, username, email, senha, celular, data_nascimento)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [resultado] = await pool.query(sql, [
    usuario.nome,
    usuario.username,
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

export async function buscarPorUsername(username) {
  const sql = 'SELECT * FROM usuarios WHERE username = ?';
  const [linhas] = await pool.query(sql, [username]);
  return linhas[0];
}

export async function buscarPorId(id) {
  const sql = 'SELECT id, nome, username, email, senha, bio, avatar, celular, data_nascimento, data_cadastro FROM usuarios WHERE id = ?';
  const [linhas] = await pool.query(sql, [id]);
  return linhas[0];
}

export async function atualizar(id, dados) {
  const campos = [];
  const valores = [];

  if (dados.nome !== undefined) {
    campos.push('nome = ?');
    valores.push(dados.nome);
  }
  if (dados.username !== undefined) {
    campos.push('username = ?');
    valores.push(dados.username);
  }
  if (dados.bio !== undefined) {
    campos.push('bio = ?');
    valores.push(dados.bio);
  }
  if (dados.avatar !== undefined) {
    campos.push('avatar = ?');
    valores.push(dados.avatar);
  }
  if (dados.celular !== undefined) {
    campos.push('celular = ?');
    valores.push(dados.celular);
  }
  if (dados.data_nascimento !== undefined) {
    campos.push('data_nascimento = ?');
    valores.push(dados.data_nascimento);
  }
  if (dados.email !== undefined) {
    campos.push('email = ?');
    valores.push(dados.email);
  }
  if (dados.senha !== undefined) {
    campos.push('senha = ?');
    valores.push(dados.senha);
  }


  if (campos.length === 0) {
    throw new Error('Nenhum campo para atualizar');
  }

  const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
  valores.push(id);

  const [resultado] = await pool.query(sql, valores);
  return resultado;
}

export async function listarTodos() {
  const sql = 'SELECT id, nome, email, bio, data_cadastro FROM usuarios';
  const [linhas] = await pool.query(sql);
  return linhas;
}

export async function buscarUsuariosPorNome(query, usuarioIdAtual) {
  const sql = `
    SELECT id, nome, username, avatar
    FROM usuarios
    WHERE (nome LIKE ? OR username LIKE ?) AND id != ?
    ORDER BY nome ASC
    LIMIT 20
  `;
  const [linhas] = await pool.query(sql, [`%${query}%`, `%${query}%`, usuarioIdAtual]);
  return linhas;
}


