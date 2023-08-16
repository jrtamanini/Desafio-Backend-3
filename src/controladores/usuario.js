const { query } = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");

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
      "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email",
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
}; // FEITO E TESTADO

const atualizarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuarioId = req.usuarioId;
    const novoEmail = email;
    const consultaEmail = "select * from usuarios where email = $1";
    const atualizaCadastro = "update usuarios set email = $1 where id = $2";

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

    let data = await query(consultaEmail, [novoEmail]);
    if (data.rowCount > 0) {
      return res.status(400).json({
        mensagem: "O email informado já está cadastrado",
      });
    }
    let dataInsert = await query(
      "update usuarios set email = $1 where id = $2",
      [novoEmail, usuarioId]
    );

    return res.status(201).json(dataInsert.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}; // FEITO E TESTADO

const listarCategoriasUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const consulta = "select * from categorias where usuario.id = $1";

    let data = await query(consulta, usuarioId);

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
}; // FEITO E TESTADO

const detalharCategoriasUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = "select descricao from categorias where id = $1";

    let data = await query(consulta, [id]);

    if (data.rowCount == 0) {
      return res.status(400).json({
        mensagem: "Categoria não encontrada! ",
      });
    }
    return res.status(200).json(data.rows);
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
}; //FEITO E TESTADO

const cadastrarCategoriaUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const consulta =
      "insert into categorias (usuarios_id, descricao) values ($1, $2) returning id, descricao";

    if (!req.body) {
      res.status(400).json({
        mensagem: "A descrição da categoria deve ser informada.",
      });
    }

    let data = await query(consulta, [usuarioId, req.body]);

    return res.status(201).json({});
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}; // FEITO E TESTADO

module.exports = {
  cadastrar,
  listarUsuario,
  listarCategoriasUsuario,
  detalharCategoriasUsuario,
  cadastrarCategoriaUsuario,
  atualizarUsuario,
};
