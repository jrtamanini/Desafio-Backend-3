const express = require("express"); //importação express
const { login } = require("./controladores/login");
const {
  cadastrar,
  listarUsuario,
  listarCategorias,
  atualizarUsuario,
} = require("./controladores/usuario");
const { validarAutenticacao } = require("./intermediarios/autenticacao");

const rotas = express();

rotas.post("/usuario", cadastrar);
rotas.post("/login", login);

rotas.use(validarAutenticacao);

rotas.get("/usuarios", listarUsuario);
rotas.get("/categoria", listarCategorias);
rotas.put("/usuarios", atualizarUsuario);

module.exports = rotas;
