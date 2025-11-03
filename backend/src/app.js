import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import usuarioEndpoints from './controllers/usuarioController.js';
import postEndpoints from './controllers/postController.js';
import comentarioEndpoints from './controllers/comentarioController.js';
import categoriaEndpoints from './controllers/categoriaController.js';
import seguidorEndpoints from './controllers/seguidoresController.js'; 

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(usuarioEndpoints);
app.use(postEndpoints);
app.use(comentarioEndpoints);
app.use(categoriaEndpoints);
app.use(seguidorEndpoints); // NOVO

app.get('/', (req, res) => {
  res.json({ mensagem: 'API MindUp funcionando!' });
});

app.listen(process.env.PORT, () => {
  console.log(`✅ API rodando na porta ${process.env.PORT}`);
  console.log(`📡 http://localhost:${process.env.PORT}`);
});

export default app;