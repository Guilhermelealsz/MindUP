import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as bookRepository from '../Repository/bookRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const endpoints = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB para PDFs e imagens
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png|gif/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (allowedTypes.test(extname) && (mimetype === 'application/pdf' || mimetype.startsWith('image/'))) {
      return cb(null, true);
    }
    cb(new Error('Apenas PDFs e imagens são permitidos'));
  }
});

endpoints.get('/books', async (req, res) => {
  try {
    const { categoria } = req.query;
    let books;
    if (categoria) {
      books = await bookRepository.buscarPorCategoria(categoria);
    } else {
      books = await bookRepository.listarTodos();
    }
    res.json(books);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar livro' });
  }
});

endpoints.post('/books', upload.fields([{ name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    const { titulo, autor, categoria, descricao } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({ erro: 'Título e autor são obrigatórios' });
    }

    let pdf_url = null;
    if (req.files && req.files.pdf && req.files.pdf[0]) {
      pdf_url = `/uploads/${req.files.pdf[0].filename}`;
    }

    const novoLivro = {
      titulo,
      autor,
      categoria: categoria || null,
      descricao,
      pdf_url,
      capa_imagem: null
    };

    const resultado = await bookRepository.inserir(novoLivro);
    res.status(201).json({ id: resultado.insertId, mensagem: 'Livro adicionado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao adicionar livro' });
  }
});

endpoints.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, categoria, descricao, pdf_url, capa_imagem } = req.body;

    const livro = await bookRepository.buscarPorId(id);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    const dadosAtualizados = {
      titulo: titulo || livro.titulo,
      autor: autor || livro.autor,
      categoria: categoria !== undefined ? categoria : livro.categoria,
      descricao: descricao || livro.descricao,
      pdf_url: pdf_url || livro.pdf_url,
      capa_imagem: capa_imagem || livro.capa_imagem
    };

    await bookRepository.atualizar(id, dadosAtualizados);
    res.json({ mensagem: 'Livro atualizado com sucesso' });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar livro' });
  }
});

export default endpoints;
