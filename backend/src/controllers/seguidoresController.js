import { Router } from 'express';
import { verificarToken } from './usuarioController.js';
import * as seguidorRepository from '../Repository/seguidorRepository.js';

const endpoints = Router();

// Seguir um usuário
endpoints.post('/usuarios/:id/seguir', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.usuarioId) {
      return res.status(400).json({ erro: 'Você não pode seguir a si mesmo' });
    }

    await seguidorRepository.seguir(req.usuarioId, id);
    res.json({ mensagem: 'Usuário seguido com sucesso' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ erro: 'Você já segue este usuário' });
    }
    console.error(error);
    res.status(500).json({ erro: 'Erro ao seguir usuário' });
  }
});

// Deixar de seguir
endpoints.delete('/usuarios/:id/seguir', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await seguidorRepository.deixarDeSeguir(req.usuarioId, id);
    res.json({ mensagem: 'Deixou de seguir o usuário' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deixar de seguir' });
  }
});

// Verificar se está seguindo
endpoints.get('/usuarios/:id/seguindo', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const seguindo = await seguidorRepository.verificarSeguindo(req.usuarioId, id);
    res.json({ seguindo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao verificar' });
  }
});

// Listar seguidores
endpoints.get('/usuarios/:id/seguidores', async (req, res) => {
  try {
    const { id } = req.params;
    const seguidores = await seguidorRepository.listarSeguidores(id);
    res.json(seguidores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar seguidores' });
  }
});

// Listar seguindo
endpoints.get('/usuarios/:id/seguindo-lista', async (req, res) => {
  try {
    const { id } = req.params;
    const seguindo = await seguidorRepository.listarSeguindo(id);
    res.json(seguindo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar seguindo' });
  }
});

// Estatísticas de seguidores
endpoints.get('/usuarios/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const [seguidores, seguindo] = await Promise.all([
      seguidorRepository.contarSeguidores(id),
      seguidorRepository.contarSeguindo(id)
    ]);
    res.json({ seguidores, seguindo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
  }
});

export default endpoints;