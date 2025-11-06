import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import usuarioEndpoints from './controllers/usuarioController.js';
import postEndpoints from './controllers/postController.js';
import comentarioEndpoints from './controllers/comentarioController.js';
import categoriaEndpoints from './controllers/categoriaController.js';
import seguidorEndpoints from './controllers/seguidoresController.js';
import notificacaoEndpoints from './controllers/notificacaoController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(usuarioEndpoints);
app.use(postEndpoints);
app.use(comentarioEndpoints);
app.use(categoriaEndpoints);
app.use(seguidorEndpoints);
app.use(notificacaoEndpoints);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API MindUp funcionando!' });
});

app.listen(process.env.PORT, () => {
  console.log(` API rodando na porta ${process.env.PORT}`);
});

export default app;