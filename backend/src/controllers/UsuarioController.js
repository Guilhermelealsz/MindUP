import Usuario from '../models/usuario.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'your-secret-key'; // Replace with your actual secret or use dotenv to load from .env

class UsuarioController {
  static async register(req, res) {
    try {
      const { nome, email, senha, bio } = req.body;
      const existingUser = await Usuario.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      const id = await Usuario.create({ nome, email, senha, bio });
      res.status(201).json({ message: 'Usuário criado com sucesso', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await Usuario.findByEmail(email);
      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await Usuario.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { nome, email, bio } = req.body;
      await Usuario.update(req.params.id, { nome, email, bio });
      res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowers(req, res) {
    try {
      const followers = await Usuario.getFollowers(req.params.id);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowing(req, res) {
    try {
      const following = await Usuario.getFollowing(req.params.id);
      res.json(following);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowersCount(req, res) {
    try {
      const count = await Usuario.getFollowersCount(req.params.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowingCount(req, res) {
    try {
      const count = await Usuario.getFollowingCount(req.params.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UsuarioController;
