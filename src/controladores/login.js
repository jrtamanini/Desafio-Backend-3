const { query } = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senha_segura = require("../senha_segura");

const login = async (req, res) => {
  try {
    let { email, senha } = req.body;

    if (!email) {
      return res.status(400).json({
        mensagem: "O campo email é obrigatório",
      });
    }
    if (!senha) {
      return res.status(400).json({
        mensagem: "O campo senha é obrigatório",
      });
    }
    let data = await query("select * from usuarios where email = $1", [email]);

    if (data.rowCount == 0) {
      return res.status(400).json({
        mensagem: "E-mail não cadastrado em nosso sistema",
      });
    }

    let usuario = data.rows[0];

    if (!(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(400).json({
        mensagem: "usuario ou senha inválidos",
      });
    }

    let { senha: senhaUsuario, ...usuarioSemSenha } = usuario;

    const token = jwt.sign(
      {
        id: usuarioSemSenha.id,
      },
      senha_segura,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      usuario: usuarioSemSenha,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  login,
};
