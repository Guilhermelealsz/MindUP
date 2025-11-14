import pool from './db.js';

const mapBookToFrontend = (book) => {
    if (!book) return null;
    return {
        id: book.id,
        title: book.titulo,
        author: book.autor,
        category: book.categoria,
        description: book.descricao,
        pdfUrl: book.pdf_url,
        coverImage: book.capa_imagem,
        dataUpload: book.data_upload 
    };
};

const mapBooksToFrontend = (rows) => {
    if (!rows || rows.length === 0) return [];
    return rows.map(mapBookToFrontend);
};

export const listarTodos = async () => {
    const [rows] = await pool.query('SELECT * FROM livros ORDER BY data_upload DESC');
    return mapBooksToFrontend(rows);
};

export const buscarPorId = async (id) => {
    const [rows] = await pool.query('SELECT * FROM livros WHERE id = ?', [id]);
    return rows.length > 0 ? mapBookToFrontend(rows[0]) : null;
};

export const buscarPorCategoria = async (categoria) => {
    const [rows] = await pool.query('SELECT * FROM livros WHERE categoria = ? ORDER BY data_upload DESC', [categoria]);
    return mapBooksToFrontend(rows); 
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