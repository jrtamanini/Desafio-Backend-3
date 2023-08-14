const { query } = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");
const { senha_segura } = require("../senha_segura");

const cadastrar = async (req, res) => {
  try {
    let { nome, email, senha } = req.body;

    const emailUsuario = [email];
    const consultaEmail = "select * from usuarios where email = $1";

    if (!nome) {
      return res.status(400).json({
        mensagem: "O campo NOME é obrigatorio",
      });
    }
    if (!email) {
      return res.status(400).json({
        mensagem: "O campo EMAIL é obrigatorio",
      });
    }
    if (!senha) {
      return res.status(400).json({
        mensagem: "O campo SENHA é obrigatorio",
      });
    }

    let data = await query(consultaEmail, emailUsuario);

    if (data.rowCount > 0) {
      return res.status(400).json({
        mensagem: "O email informado ja esta cadastrado",
      });
    }

    let senhaCriptografada = await bcrypt.hash(senha, 10);

    let dataInsert = await query(
      "insert into usuarios (nome, email, senha) values ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senhaCriptografada]
    );

    if (dataInsert.rowCount == 0) {
      return res.status(400).json({
        mensagem: "Não foi possivel cadastrar o usuario, verifique os dados",
      });
    }

    return res.status(201).json(dataInsert.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}; // FEITO E TESTADO. (FAZER REFATORAÇÃO AO FINAL).

const listarUsuario = async (req, res) => {
  try {
    let data = await query("select * from usuarios");

    if (data.rowCount == 0) {
      return res.status(400).json({
        mensagem: "Não existe usuário cadastrado",
      });
    }

    return res.status(200).json(data.rows);
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
}; // FEITO , FALTA TESTAR

const listarCategorias = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const query = "select * from categorias where usuario.id = $1";

    let data = await query(query, usuarioId);

    if ((data.rowCount = 0)) {
      return res.status(400).json({
        mensagem: "Não existem categorias cadastradas.",
      });
    }
    return res.status(200).json(data.rows);
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
}; // FEITO,FALTA TESTAR .

const atualizarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuarioId = req.usuarioId;
    const novoEmail = email;
    const consultaEmail = "select * from usuarios where email = $1";

    if (!nome) {
      return res.status(400).json({
        mensagem: "O campo NOME é obrigatorio",
      });
    }
    if (!email) {
      return res.status(400).json({
        mensagem: "O campo EMAIL é obrigatorio",
      });
    }
    if (!senha) {
      return res.status(400).json({
        mensagem: "O campo SENHA é obrigatorio",
      });
    }

    let data = await query(consultaEmail, novoEmail);
    if (data.rowCount > 0) {
      return res.status(400).json({
        mensagem: "O email informado já está cadastrado",
      });
    }
    let dataInsert = await query(
      "uptade usuarios set email = $1 where id = $2",
      novoEmail,
      usuarioId
    );

    return res.status(201).json(dataInsert.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}; // FEITO, FALTA TESTAR

module.exports = {
  cadastrar,
  listarUsuario,
  listarCategorias,
  atualizarUsuario,
};
