import pool from './db.js';

export const listarTodos = async () => {
  const [rows] = await pool.query('SELECT * FROM livros ORDER BY data_upload DESC');
  return rows;
};

export const buscarPorId = async (id) => {
  const [rows] = await pool.query('SELECT * FROM livros WHERE id = ?', [id]);
  return rows[0];
};

export const buscarPorCategoria = async (categoria) => {
  const [rows] = await pool.query('SELECT * FROM livros WHERE categoria = ? ORDER BY data_upload DESC', [categoria]);
  return rows;
};

export const inserir = async (livro) => {
  const { titulo, autor, categoria, descricao, pdf_url, capa_imagem } = livro;
  const [result] = await pool.query(
    'INSERT INTO livros (titulo, autor, categoria, descricao, pdf_url, capa_imagem) VALUES (?, ?, ?, ?, ?, ?)',
    [titulo, autor, categoria, descricao, pdf_url, capa_imagem]
  );
  return result;
};

export const atualizar = async (id, livro) => {
  const { titulo, autor, categoria, descricao, pdf_url, capa_imagem } = livro;
  await pool.query(
    'UPDATE livros SET titulo = ?, autor = ?, categoria = ?, descricao = ?, pdf_url = ?, capa_imagem = ? WHERE id = ?',
    [titulo, autor, categoria, descricao, pdf_url, capa_imagem, id]
  );
};

export const deletar = async (id) => {
  await pool.query('DELETE FROM livros WHERE id = ?', [id]);
};
