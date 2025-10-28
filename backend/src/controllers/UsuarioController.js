import { gerarToken } from '../utils/jwt.js';
import * as db from '../repository/usuarioRepo.js';
import { Router } from "express";

const endpoints = Router();


endpoints.post('/usuario', async (req, resp) => {
  try {
    let pessoa = req.body;
    let id = await db.cadastrarUsuario(pessoa);

    resp.send({ novoId: id });
  }
  catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});


endpoints.post('/login', async (req, resp) => {
  try {
    let pessoa = req.body;
    let usuario = await db.validarUsuario(pessoa);

    if (!usuario) {
      return resp.status(401).send({ erro: "Usuário ou senha incorretos" });
    }

    let token = gerarToken(usuario);

    resp.send({
      usuario: {
    id: usuario.id_usuario,      
    email: usuario.email
      },
      token
    });
  }
  catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});

export default endpoints;