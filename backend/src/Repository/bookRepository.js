import pool from './db.js';

// Função auxiliar para mapear os nomes das colunas do DB (snake_case)
// para o padrão do Front-end (camelCase).
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
        // Mantém data_upload se for necessário no frontend, mas com nome padronizado
        dataUpload: book.data_upload 
    };
};

const mapBooksToFrontend = (rows) => {
    if (!rows || rows.length === 0) return [];
    return rows.map(mapBookToFrontend);
};

export const listarTodos = async () => {
    const [rows] = await pool.query('SELECT * FROM livros ORDER BY data_upload DESC');
    return mapBooksToFrontend(rows); // ⬅️ Aplicado o mapeamento
};

export const buscarPorId = async (id) => {
    const [rows] = await pool.query('SELECT * FROM livros WHERE id = ?', [id]);
    // Retorna o objeto mapeado, ou null se não for encontrado
    return rows.length > 0 ? mapBookToFrontend(rows[0]) : null; // ⬅️ Aplicado o mapeamento
};

export const buscarPorCategoria = async (categoria) => {
    const [rows] = await pool.query('SELECT * FROM livros WHERE categoria = ? ORDER BY data_upload DESC', [categoria]);
    return mapBooksToFrontend(rows); // ⬅️ Aplicado o mapeamento
};

// As funções de escrita (inserir, atualizar, deletar) não precisam de mapeamento
// de saída, pois apenas manipulam os dados no formato do DB.

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