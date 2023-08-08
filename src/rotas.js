const express = require('express'); //importação express
const { login } = require('./controladores/login');
const { cadastrar, listar } = require('./controladores/usuario');
const { validarAutenticacao } = require('./intermediarios/autenticacao')

const rotas = express();

rotas.post('/usuario', cadastrar);
rotas.post('/login', login);

rotas.use(validarAutenticacao)

rotas.get('./usuarios', listar);


module.exports = rotas