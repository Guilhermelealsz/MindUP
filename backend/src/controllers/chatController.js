import { Router } from 'express';
import { verificarToken } from './usuarioController.js';
import * as chatRepository from '../Repository/chatRepository.js';
import * as notificacaoRepository from '../Repository/notificacaoRepository.js';

const endpoints = Router();

// Criar ou buscar chat entre dois usuários
endpoints.post('/chats', verificarToken, async (req, res) => {
  try {
    const { outroUsuarioId } = req.body;

    if (!outroUsuarioId) {
      return res.status(400).json({ erro: 'ID do outro usuário é obrigatório' });
    }

    let chat = await chatRepository.buscarChatEntreUsuarios(req.usuarioId, outroUsuarioId);

    if (!chat) {
      const chatId = await chatRepository.criarChat(req.usuarioId, outroUsuarioId);
      chat = { id: chatId };
    }

    res.json({ chatId: chat.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar/buscar chat' });
  }
});

// Buscar chat existente entre dois usuários
endpoints.get('/chats', verificarToken, async (req, res) => {
  try {
    const { outroUsuarioId } = req.query;

    if (!outroUsuarioId) {
      return res.status(400).json({ erro: 'ID do outro usuário é obrigatório' });
    }

    const chat = await chatRepository.buscarChatEntreUsuarios(req.usuarioId, outroUsuarioId);

    if (chat) {
      res.json({ chatId: chat.id });
    } else {
      res.json({ chatId: null });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar chat' });
  }
});

// Listar chats do usuário
endpoints.get('/chats', verificarToken, async (req, res) => {
  try {
    const chats = await chatRepository.listarChatsUsuario(req.usuarioId);
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar chats' });
  }
});

// Enviar mensagem
endpoints.post('/chats/:chatId/mensagens', verificarToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { texto, postId } = req.body;

    if (!texto && !postId) {
      return res.status(400).json({ erro: 'Mensagem ou post é obrigatório' });
    }

    // Verificar se o usuário faz parte do chat
    const chats = await chatRepository.listarChatsUsuario(req.usuarioId);
    const chat = chats.find(c => c.id == chatId);

    if (!chat) {
      return res.status(403).json({ erro: 'Acesso negado ao chat' });
    }

    const destinatarioId = chat.outro_usuario_id;

    const mensagemId = await chatRepository.enviarMensagem(chatId, req.usuarioId, destinatarioId, texto, postId);

    // Criar notificação para o destinatário
    await notificacaoRepository.criarNotificacao({
      usuario_id: destinatarioId,
      tipo: 'mensagem',
      ator_id: req.usuarioId
    });

    res.json({ mensagemId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao enviar mensagem' });
  }
});

// Listar mensagens de um chat
endpoints.get('/chats/:chatId/mensagens', verificarToken, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verificar se o usuário faz parte do chat
    const chats = await chatRepository.listarChatsUsuario(req.usuarioId);
    const chat = chats.find(c => c.id == chatId);

    if (!chat) {
      return res.status(403).json({ erro: 'Acesso negado ao chat' });
    }

    const mensagens = await chatRepository.listarMensagensChat(chatId, req.usuarioId);
    res.json(mensagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar mensagens' });
  }
});

// Contar mensagens não lidas
endpoints.get('/chats/mensagens-nao-lidas', verificarToken, async (req, res) => {
  try {
    const total = await chatRepository.contarMensagensNaoLidasUsuario(req.usuarioId);
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao contar mensagens não lidas' });
  }
});

// Marcar mensagens como lidas
endpoints.put('/chats/:chatId/mensagens/lidas', verificarToken, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verificar se o usuário faz parte do chat
    const chats = await chatRepository.listarChatsUsuario(req.usuarioId);
    const chat = chats.find(c => c.id == chatId);

    if (!chat) {
      return res.status(403).json({ erro: 'Acesso negado ao chat' });
    }

    await chatRepository.marcarMensagensComoLidas(chatId, req.usuarioId);
    res.json({ mensagem: 'Mensagens marcadas como lidas' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao marcar mensagens como lidas' });
  }
});

export default endpoints;
