import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import usuarioRoutes from './routes/UsuarioRoutes.js';
import postRoutes from './routes/PostRoutes.js';
import categoriaRoutes from './routes/CategoriaRoutes.js';
import comentarioRoutes from './routes/comentarioRoutes.js';
import curtidaRoutes from './routes/CurtidaRoutes.js';
import notificacaoRoutes from './routes/NotificacaoRoutes.js';
import followRoutes from './routes/FollowRoutes.js';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas públicas
app.use('/api/usuarios', usuarioRoutes);

// Rotas protegidas
app.use('/api/posts', auth, postRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/comentarios', auth, comentarioRoutes);
app.use('/api/curtidas', auth, curtidaRoutes);
app.use('/api/notificacoes', auth, notificacaoRoutes);
app.use('/api/follows', auth, followRoutes);

// Rota para upload de imagem
app.post('/api/upload', upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }
  res.json({ imagem: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
