import { Router } from 'express';
import { verificarToken } from './usuarioController.js';
import * as notificacaoRepository from '../Repository/notificacaoRepository.js';

const endpoints = Router();

endpoints.get('/notificacoes', verificarToken, async (req, res) => {
  try {
    const notificacoes = await notificacaoRepository.listarNotificacoesUsuario(req.usuarioId);
    res.json(notificacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar notificações' });
  }
});

endpoints.get('/notificacoes/nao-lidas', verificarToken, async (req, res) => {
  try {
    const total = await notificacaoRepository.contarNotificacoesNaoLidas(req.usuarioId);
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao contar notificações não lidas' });
  }
});

endpoints.put('/notificacoes/:id/lida', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await notificacaoRepository.marcarComoLida(id, req.usuarioId);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Notificação não encontrada' });
    }
    res.json({ mensagem: 'Notificação marcada como lida' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao marcar notificação como lida' });
  }
});

endpoints.put('/notificacoes/marcar-todas-lidas', verificarToken, async (req, res) => {
  try {
    await notificacaoRepository.marcarTodasComoLidas(req.usuarioId);
    res.json({ mensagem: 'Todas as notificações foram marcadas como lidas' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao marcar notificações como lidas' });
  }
});

endpoints.delete('/notificacoes/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await notificacaoRepository.deletarNotificacao(id, req.usuarioId);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Notificação não encontrada' });
    }
    res.json({ mensagem: 'Notificação deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar notificação' });
  }
});

endpoints.delete('/notificacoes', verificarToken, async (req, res) => {
  try {
    await notificacaoRepository.deletarTodasNotificacoes(req.usuarioId);
    res.json({ mensagem: 'Todas as notificações foram deletadas com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar notificações' });
  }
});

export default endpoints;
