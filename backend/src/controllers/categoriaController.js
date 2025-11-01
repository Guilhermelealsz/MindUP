import { Router } from 'express';
import { verificarToken } from './usuarioController.js';
import * as categoriaRepository from '../Repository/categoriaRepository.js';

const endpoints = Router();

endpoints.get('/categorias', async (req, res) => {
  try {
    const categorias = await categoriaRepository.listarTodas();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar categorias' });
  }
});

endpoints.post('/categorias', verificarToken, async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    if (!nome) {
      return res.status(400).json({ erro: 'Nome da categoria é obrigatório' });
    }

    const novaCategoria = { nome, descricao };
    const resultado = await categoriaRepository.inserir(novaCategoria);
    res.status(201).json({ id: resultado.insertId, mensagem: 'Categoria criada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar categoria' });
  }
});

export default endpoints;