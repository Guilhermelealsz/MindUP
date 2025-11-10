import { Router } from 'express';
import * as adminRepository from '../Repository/AdminRepository.js';

const endpoints = Router();

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

export const verificarAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.' });
  }
  next();
};

endpoints.get('/admin/usuarios', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuarios = await adminRepository.buscarTodosUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

endpoints.get('/admin/estatisticas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const stats = await adminRepository.buscarEstatisticas();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
  }
});

endpoints.post('/admin/banir/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    if (!motivo || motivo.trim() === '') {
      return res.status(400).json({ erro: 'Motivo do banimento é obrigatório' });
    }

    const usuario = await adminRepository.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (usuario.role === 'admin') {
      return res.status(400).json({ erro: 'Não é possível banir um administrador' });
    }

    await adminRepository.banirUsuario(id, motivo, req.usuarioId);

    // Log the action
    await adminRepository.logAdminAction(req.usuarioId, 'ban_user', id, `Usuário banido. Motivo: ${motivo}`, req.ip, req.get('User-Agent'));

    res.json({ mensagem: 'Usuário banido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao banir usuário' });
  }
});

endpoints.post('/admin/desbanir/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await adminRepository.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await adminRepository.desbanirUsuario(id);

    // Log the action
    await adminRepository.logAdminAction(req.usuarioId, 'unban_user', id, 'Usuário desbanido', req.ip, req.get('User-Agent'));

    res.json({ mensagem: 'Usuário desbanido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao desbanir usuário' });
  }
});

endpoints.get('/admin/logs', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const logs = await adminRepository.buscarLogsAdmin();
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar logs' });
  }
});

export default endpoints;
