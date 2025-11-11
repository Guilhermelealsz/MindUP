import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as bookRepository from '../Repository/bookRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const endpoints = Router();

// --- Configuração do Multer para Upload de Arquivos ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define o diretório de uploads
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Gera um nome de arquivo único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        // Permite PDF e tipos de imagem comuns
        const allowedTypes = /pdf|jpeg|jpg|png|gif/;
        const extname = path.extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype;

        if (allowedTypes.test(extname) && (mimetype === 'application/pdf' || mimetype.startsWith('image/'))) {
            return cb(null, true);
        }
        cb(new Error('Apenas PDFs e imagens (jpeg, png, gif) são permitidos.'));
    }
});
// -----------------------------------------------------

endpoints.get('/books', async (req, res) => {
    try {
        const { categoria } = req.query;
        let books;
        if (categoria) {
            books = await bookRepository.buscarPorCategoria(categoria);
        } else {
            books = await bookRepository.listarTodos();
        }
        // Retorna um array vazio se o repositório retornar null ou undefined
        res.json(books || []);
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        res.status(500).json({ erro: 'Erro ao listar livros' });
    }
});

endpoints.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await bookRepository.buscarPorId(id);
        if (!book) {
            return res.status(404).json({ erro: 'Livro não encontrado' });
        }
        res.json(book);
    } catch (error) {
        console.error('Erro ao buscar livro por ID:', error);
        res.status(500).json({ erro: 'Erro ao buscar livro' });
    }
});

/**
 * Endpoint POST para adicionar um novo livro.
 * Suporta o upload de PDF e/ou Capa (imagem).
 */
endpoints.post(
    '/books',
    upload.fields([
        { name: 'pdf', maxCount: 1 },
        { name: 'capa_imagem', maxCount: 1 } // ⬅️ Adicionado suporte para capa
    ]),
    async (req, res) => {
        try {
            const { titulo, autor, categoria, descricao } = req.body;

            if (!titulo || !autor) {
                return res.status(400).json({ erro: 'Título e autor são obrigatórios' });
            }

            let pdf_url = null;
            if (req.files && req.files.pdf && req.files.pdf[0]) {
                pdf_url = `/uploads/${req.files.pdf[0].filename}`;
            }

            // ⬅️ Obtém o caminho da imagem de capa, se houver
            let capa_imagem = null;
            if (req.files && req.files.capa_imagem && req.files.capa_imagem[0]) {
                capa_imagem = `/uploads/${req.files.capa_imagem[0].filename}`;
            }

            const novoLivro = {
                titulo,
                autor,
                categoria: categoria || null,
                descricao,
                pdf_url,
                capa_imagem // ⬅️ Incluído no objeto a ser inserido
            };

            const resultado = await bookRepository.inserir(novoLivro);
            res.status(201).json({ id: resultado.insertId, mensagem: 'Livro adicionado com sucesso' });
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
            res.status(500).json({ erro: 'Erro ao adicionar livro' });
        }
    }
);

endpoints.put('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body; // Usa o corpo inteiro da requisição

        const livroExistente = await bookRepository.buscarPorId(id);
        if (!livroExistente) {
            return res.status(404).json({ erro: 'Livro não encontrado' });
        }

        // 💡 Otimização: Atualiza apenas os campos fornecidos no corpo da requisição
        const livroParaAtualizar = {
            ...livroExistente, // Mantém os dados antigos
            ...dadosAtualizados // Sobrescreve com os dados novos
        };

        // Remove a propriedade 'id' para evitar problemas na atualização do DB
        delete livroParaAtualizar.id;
        
        await bookRepository.atualizar(id, livroParaAtualizar);
        res.json({ mensagem: 'Livro atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        res.status(500).json({ erro: 'Erro ao atualizar livro' });
    }
});

endpoints.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const livro = await bookRepository.buscarPorId(id);
        if (!livro) {
            return res.status(404).json({ erro: 'Livro não encontrado' });
        }
        await bookRepository.deletar(id);
        res.json({ mensagem: 'Livro deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        res.status(500).json({ erro: 'Erro ao deletar livro' });
    }
});

export default endpoints;