const express = require("express"); //importação express
const { login } = require("./controladores/login");
const {
  listarCategoriasUsuario,
  atualizarUsuario,
  cadastrarCategoriaUsuario,
  detalharCategoriasUsuario,
  atualizarCategoriasUsuario,
  excluirCategoriaUsuario,
  cadastrarTransacaoUsuario,
  listarTransacaoUsuario,
  excluirTransacaoUsuario,
  detalharUsuario,
  extratoTransacaoUsuario,
  cadastrarUsuario,
} = require("./controladores/usuario");
const { validarAutenticacao } = require("./intermediarios/autenticacao");

const rotas = express();

rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.use(validarAutenticacao);

rotas.get("/usuario", detalharUsuario);
rotas.get("/categoria", listarCategoriasUsuario);
rotas.put("/usuarios", atualizarUsuario);
rotas.post("/categoria", cadastrarCategoriaUsuario);
rotas.get("/categoria/:id", detalharCategoriasUsuario);
rotas.put("/categoria/:id", atualizarCategoriasUsuario);
rotas.delete("/categoria/:id", excluirCategoriaUsuario);
rotas.put("/transacao", cadastrarTransacaoUsuario);
rotas.get("/transacao", listarTransacaoUsuario);
rotas.delete("/transacao/:id", excluirTransacaoUsuario);
rotas.get("/transacao/extrato", extratoTransacaoUsuario);

module.exports = rotas;
