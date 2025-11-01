import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usuarioRepository from '../Repository/usuarioRepository.js';

const endpoints = Router();

// Middleware de autenticação
export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

// Cadastrar usuário
endpoints.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, celular, data_nascimento } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }

    const usuarioExiste = await usuarioRepository.buscarPorEmail(email);
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
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

// Login
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

// Buscar perfil
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

// Atualizar perfil
endpoints.put('/usuarios/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode editar este perfil' });
    }

    const { nome, bio, celular, data_nascimento } = req.body;

    const dadosAtualizados = {
      nome,
      bio,
      celular,
      data_nascimento
    };

    await usuarioRepository.atualizar(id, dadosAtualizados);
    
    res.json({ mensagem: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

export default endpoints;