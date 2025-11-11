import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usuarioRepository from '../Repository/usuarioRepository.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import process from 'process';
import conexao from '../Repository/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  } catch {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};



endpoints.post('/usuarios', async (req, res) => {
  try {
    const { nome, username, email, senha, celular, data_nascimento } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }



    const usuarioExiste = await usuarioRepository.buscarPorEmail(email);
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    if (username) {
      const usernameExiste = await usuarioRepository.buscarPorUsername(username);
      if (usernameExiste) {
        return res.status(400).json({ erro: 'Username já cadastrado' });
      }
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
      username,
      email,
      senha: senhaHash,
      celular,
      data_nascimento
    };

    const resultado = await usuarioRepository.inserir(novoUsuario);

    res.status(201).json({
      id: resultado.insertId,
      mensagem: 'Usuário cadastrado com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

endpoints.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const usuario = await usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }



    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        bio: usuario.bio
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

endpoints.get('/usuarios/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioRepository.buscarPorId(id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    delete usuario.senha;
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
});

endpoints.put('/usuarios/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode editar este perfil' });
    }

    const { nome, username, bio, avatar, celular, data_nascimento, email, senha, senhaAtual } = req.body;

    // Verificar se campos sensíveis estão sendo alterados
    const camposSensíveis = ['email', 'celular', 'data_nascimento', 'senha'];
    const alterandoCamposSensíveis = camposSensíveis.some(campo => Object.prototype.hasOwnProperty.call(req.body, campo) && req.body[campo] !== undefined);

    if (alterandoCamposSensíveis) {
      // Verificar senha atual para confirmar alterações de campos sensíveis
      if (!senhaAtual || senhaAtual.trim() === '') {
        return res.status(400).json({ erro: 'Senha atual é obrigatória para confirmar alterações de dados sensíveis' });
      }

      // Buscar usuário para verificar senha atual
      const usuario = await usuarioRepository.buscarPorId(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      // Se o usuário não tem senha cadastrada, permitir alteração sem verificação
      if (usuario.senha) {
        const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
        if (!senhaValida) {
          return res.status(400).json({ erro: 'Senha atual incorreta' });
        }
      }
    }

    if (username) {
      const usuarioComUsername = await usuarioRepository.buscarPorUsername(username);
      if (usuarioComUsername && usuarioComUsername.id !== parseInt(id)) {
        return res.status(400).json({ erro: 'Username já está em uso' });
      }
    }

    if (email) {
      const usuarioComEmail = await usuarioRepository.buscarPorEmail(email);
      if (usuarioComEmail && usuarioComEmail.id !== parseInt(id)) {
        return res.status(400).json({ erro: 'Email já está em uso' });
      }
    }

    const dadosAtualizados = {};
    if (nome !== undefined) dadosAtualizados.nome = nome;
    if (username !== undefined) dadosAtualizados.username = username;
    if (bio !== undefined) dadosAtualizados.bio = bio;
    if (avatar !== undefined) dadosAtualizados.avatar = avatar;
    if (celular !== undefined) dadosAtualizados.celular = celular;
    if (data_nascimento !== undefined) dadosAtualizados.data_nascimento = data_nascimento;
    if (email !== undefined) dadosAtualizados.email = email;
    if (senha !== undefined) {
      if (senha.length < 6) {
        return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres' });
      }
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    await usuarioRepository.atualizar(id, dadosAtualizados);

    // Buscar o usuário atualizado para retornar os dados completos
    const usuarioAtualizado = await usuarioRepository.buscarPorId(id);
    delete usuarioAtualizado.senha;

    res.json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario: usuarioAtualizado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + req.usuarioId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'));
    }
  }
});

endpoints.post('/usuarios/:id/avatar', verificarToken, upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode fazer upload para este perfil' });
    }

    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await usuarioRepository.atualizar(id, { avatar: avatarUrl });

    res.json({
      mensagem: 'Avatar atualizado com sucesso',
      avatarUrl: avatarUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao fazer upload do avatar' });
  }
});

endpoints.put('/usuarios/:id/senha', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode alterar a senha deste perfil' });
    }

    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ erro: 'Senha atual e nova senha são obrigatórias' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    // Buscar usuário para verificar senha atual
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await usuarioRepository.atualizar(id, { senha: novaSenhaHash });

    res.json({
      mensagem: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao alterar senha' });
  }
});

endpoints.get('/usuarios', verificarToken, async (req, res) => {
  try {
    const { busca } = req.query;

    if (!busca || busca.trim().length < 2) {
      return res.status(400).json({ erro: 'Termo de busca deve ter pelo menos 2 caracteres' });
    }

    const usuarios = await usuarioRepository.buscarUsuariosPorNome(busca.trim(), req.usuarioId);
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

export async function buscarUsuariosPorNome(nome, usuarioId) {
  const [rows] = await conexao.query(
    `
      SELECT id, nome, username, avatar
      FROM usuarios
      WHERE nome LIKE ? AND id != ?
      ORDER BY nome ASC
      LIMIT 20
    `,
    [`%${nome}%`, usuarioId]
  );

  return rows;
}

export default endpoints;
