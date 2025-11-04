import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { verificarToken } from './usuarioController.js';
import * as postRepository from '../Repository/postRepository.js';
import * as notificacaoRepository from '../Repository/notificacaoRepository.js';

const endpoints = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Apenas imagens são permitidas'));
  }
});

endpoints.get('/posts', async (req, res) => {
  try {
    const { categoria_id } = req.query;
    let posts;
    if (categoria_id) {
      posts = await postRepository.buscarPorCategoria(categoria_id);
    } else {
      posts = await postRepository.listarTodos();
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar posts' });
  }
});

endpoints.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postRepository.buscarPorId(id);
    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar post' });
  }
});

endpoints.post('/posts', verificarToken, upload.single('imagem'), async (req, res) => {
  try {
    const { titulo, conteudo, categoria_id } = req.body;
    
    if (!titulo || !conteudo) {
      return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios' });
    }

    const novoPost = {
      titulo,
      conteudo,
      categoria_id: categoria_id || null,
      autor_id: req.usuarioId,
      imagem: req.file ? req.file.filename : null
    };

    const resultado = await postRepository.inserir(novoPost);
    res.status(201).json({ id: resultado.insertId, mensagem: 'Post criado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar post' });
  }
});

endpoints.put('/posts/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo, categoria_id } = req.body;
    
    const post = await postRepository.buscarPorId(id);
    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado' });
    }
    if (post.autor_id !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode editar este post' });
    }

    const dadosAtualizados = {
      titulo: titulo || post.titulo,
      conteudo: conteudo || post.conteudo,
      categoria_id: categoria_id !== undefined ? categoria_id : post.categoria_id
    };

    await postRepository.atualizar(id, dadosAtualizados);
    res.json({ mensagem: 'Post atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar post' });
  }
});

endpoints.delete('/posts/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postRepository.buscarPorId(id);
    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado' });
    }
    if (post.autor_id !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode deletar este post' });
    }
    await postRepository.deletar(id);
    res.json({ mensagem: 'Post deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar post' });
  }
});

endpoints.post('/posts/:id/curtir', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await postRepository.curtir(id, req.usuarioId);

    // Criar notificação para o autor do post
    const post = await postRepository.buscarPorId(id);
    if (post && post.autor_id !== req.usuarioId) {
      await notificacaoRepository.criarNotificacao({
        usuario_id: post.autor_id,
        tipo: 'curtida_post',
        ator_id: req.usuarioId,
        post_id: id
      });
    }

    res.json({ mensagem: 'Post curtido com sucesso' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ erro: 'Você já curtiu este post' });
    }
    console.error(error);
    res.status(500).json({ erro: 'Erro ao curtir post' });
  }
});

endpoints.delete('/posts/:id/curtir', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await postRepository.removerCurtida(id, req.usuarioId);
    res.json({ mensagem: 'Curtida removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao remover curtida' });
  }
});

endpoints.get('/posts/:id/curtidas', async (req, res) => {
  try {
    const { id } = req.params;
    const curtidas = await postRepository.contarCurtidas(id);
    res.json({ total: curtidas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar curtidas' });
  }
});

// Buscar posts de um usuário
endpoints.get('/usuarios/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await postRepository.buscarPorAutor(id);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar posts do usuário' });
  }
});

export default endpoints;
