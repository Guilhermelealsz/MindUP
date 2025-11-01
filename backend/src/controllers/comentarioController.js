import { Router } from 'express';
import { verificarToken } from './usuarioController.js';
import * as comentarioRepository from '../Repository/comentarioRepository.js';

const endpoints = Router();

endpoints.get('/comentarios/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comentarios = await comentarioRepository.buscarPorPost(postId);
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar comentários' });
  }
});

endpoints.post('/comentarios', verificarToken, async (req, res) => {
  try {
    const { texto, post_id } = req.body;
    
    if (!texto || !post_id) {
      return res.status(400).json({ erro: 'Texto e ID do post são obrigatórios' });
    }

    const novoComentario = {
      texto,
      post_id,
      autor_id: req.usuarioId
    };

    const resultado = await comentarioRepository.inserir(novoComentario);
    res.status(201).json({ id: resultado.insertId, mensagem: 'Comentário adicionado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao adicionar comentário' });
  }
});

endpoints.delete('/comentarios/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = await comentarioRepository.buscarPorId(id);
    
    if (!comentario) {
      return res.status(404).json({ erro: 'Comentário não encontrado' });
    }
    if (comentario.autor_id !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode deletar este comentário' });
    }

    await comentarioRepository.deletar(id);
    res.json({ mensagem: 'Comentário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar comentário' });
  }
});

export default endpoints;