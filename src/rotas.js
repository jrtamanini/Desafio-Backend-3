const express = require("express"); //importação express
const { login } = require("./controladores/login");
const {
  cadastrar,
  listarUsuario,
  listarCategoriasUsuario,
  atualizarUsuario,
  cadastrarCategoriaUsuario,
  detalharCategoriasUsuario,
} = require("./controladores/usuario");
const { validarAutenticacao } = require("./intermediarios/autenticacao");

const rotas = express();

rotas.post("/usuario", cadastrar);
rotas.post("/login", login);

rotas.use(validarAutenticacao);

rotas.get("/usuarios", listarUsuario);
rotas.get("/categoria", listarCategoriasUsuario);
rotas.put("/usuarios", atualizarUsuario);
rotas.post("/categoria", cadastrarCategoriaUsuario);
rotas.get("/categoria/:id", detalharCategoriasUsuario);
module.exports = rotas;
