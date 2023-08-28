const { query } = require("../bancodedados/conexao");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
  try {
    let { nome, email, senha } = req.body;

    const emailUsuario = [email];
    const consultarEmail = "select * from usuarios where email = $1";

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

    const consultarEmailValido = await query(consultarEmail, [emailUsuario]);

    if (consultarEmailValido.rowCount > 0) {
      return res.status(400).json({
        mensagem: "O email informado ja esta cadastrado",
      });
    }

    let senhaCriptografada = await bcrypt.hash(senha, 10);

    const cadastrarUsuario = await query(
      "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email",
      [nome, email, senhaCriptografada]
    );

    if (!cadastrarUsuario) {
      return res.status(400).json({
        mensagem: "Não foi possivel cadastrar o usuario, verifique os dados",
      });
    }

    return res.status(201).json(cadastrarUsuario.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const detalharUsuario = async (req, res) => {
  try {
    const { usuarioId } = req;
    const detalharUsuario = "select * from usuarios where id = $1";

    const detalharUsuarioSelecionado = await query(detalharUsuario, [
      usuarioId,
    ]);

    if (!detalharUsuarioSelecionado.rowCount) {
      return res.status(400).json({
        mensagem: "Não existe usuário cadastrado",
      });
    }

    return res.status(200).json(detalharUsuarioSelecionado.rows);
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
};

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

    const consultaEmailUsuario = await query(consultaEmail, [novoEmail]);
    if (consultaEmailUsuario.rowCount > 0) {
      return res.status(400).json({
        mensagem: "O email informado já está cadastrado",
      });
    }
    const atualizarEmailUsuario = await query(
      "update usuarios set email = $1 where id = $2",
      [novoEmail, usuarioId]
    );

    return res.status(201).json(atualizarEmailUsuario.rows[0]);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const listarCategoriasUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const consulta = "select * from categorias where usuarios_id = $1";

    const listarCategoriasUsuario = await query(consulta, [usuarioId]);

    if ((listarCategoriasUsuario.rowCount = 0)) {
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
};

const detalharCategoriasUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const detalharCategoria = "select descricao from categorias where id = $1";

    const detalharCategoriasUsuario = await query(detalharCategoria, [id]);

    if (!detalharCategoriasUsuario.rowCount) {
      return res.status(400).json({
        mensagem: "Categoria não encontrada! ",
      });
    }
    return res.status(200).json(detalharCategoriasUsuario.rows);
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
};

const cadastrarCategoriaUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const cadastrarCategoria =
      "insert into categorias (usuarios_id, descricao) values ($1, $2) returning id, descricao";

    if (!req.body) {
      res.status(400).json({
        mensagem: "A descrição da categoria deve ser informada.",
      });
    }

    const cadastradarCategoriaUsuario = await query(cadastrarCategoria, [
      usuarioId,
      req.body,
    ]);

    return res.status(201).json({ cadastradarCategoriaUsuario });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const atualizarCategoriasUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req;
    const { descricao } = req.body;
    const existeCategoria = "select id from categorias where id = $1";
    const buscarCategoria =
      "select usuarios_id from categorias where id = $1 and usuarios_id = $2";
    const atualizarCategoria =
      "update categorias set descricao = $1 where id = $2 and usuarios_id = $3";

    if (!descricao) {
      return res.status(400).json({
        mensagem: "O campo descricao é obrigatório.",
      });
    }
    const categoria = await query(existeCategoria, [id]);

    if (!categoria.rowCount) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada.",
      });
    }

    const categoriaUsuario = await query(buscarCategoria, [id, usuarioId]);

    if (!categoriaUsuario.rowCount) {
      return res.status(400).json({
        mensagem: "O usuário não possui a categoria informada!",
      });
    }

    const categoriaAtualizada = await query(atualizarCategoria, [
      descricao,
      id,
      usuarioId,
    ]);

    return res.status(200).json({
      categoriaAtualizada,
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
};

const excluirCategoriaUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req;
    const existeCategoria = "select id from categorias where id = $1";
    const buscarCategoria =
      "select usuarios_id from categorias where id = $1 and usuarios_id = $2";
    const existeTransacao = "select categoria_id from transacoes where id = $1";
    const excluirCategoria =
      "delete from categorias where id = $1 and usuarios_id = $2";

    const categoria = await query(existeCategoria, [id]);

    if (!categoria.rowCount) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada.",
      });
    }

    const categoriaUsuario = await query(buscarCategoria, [id, usuarioId]);

    if (!categoriaUsuario.rowCount) {
      return res.status(400).json({
        mensagem: "O usuário não possui a categoria informada!",
      });
    }

    const transacaoUsuario = await query(existeTransacao, [id]);

    if (transacaoUsuario.rowCount != 0) {
      return res.status(400).json({
        mensagem: "Não é possivel excluir categorias que possuem transações.",
      });
    }

    const excluirCategoriaUsuario = await query(excluirCategoria, [
      id,
      usuarioId,
    ]);

    return res.status(200).json({ excluirCategoriaUsuario });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

const cadastrarTransacaoUsuario = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { usuarioId } = req;
  const existeCategoria = "select id from categorias where id = $1";
  const buscarCategoria =
    "select usuarios_id from categorias where id = $1 and usuarios_id = $2";
  const cadastradarTransacao =
    "insert into transacao (descricao, valor, data, categoria_id, tipo) values ($1,$2,$3,$4,$5) ";
  const respostaUsuario =
    "select * from transacoes join categorias on transacoes.categoria_id = categoria.id";

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser informados.",
    });
  }

  const categoria = await query(existeCategoria, [categoria_id]);

  if (!categoria.rowCount) {
    return res.status(404).json({
      mensagem: "Categoria informada não existe.",
    });
  }

  const categoriaUsuario = await query(buscarCategoria, [
    categoria_id,
    usuarioId,
  ]);

  if (!categoriaUsuario.rowCount) {
    res.status(400).json({
      mensagem: "O usuário não possui a categoria informada.",
    });
  }

  if (tipo != "entrada" || tipo != "saída") {
    res.status(400).json({
      mensagem: "valor TIPO inválido.",
    });
  }

  const transacaoUsuario = await query(cadastradarTransacao, [
    descricao,
    valor,
    data,
    categoria_id,
    tipo,
  ]);

  return res.status(200).json({
    respostaUsuario,
  });
};

const listarTransacaoUsuario = async (req, res) => {
  try {
    const { usuarioId } = req;
    const { filtro } = req.query;
    const ListarTransacoes = "select * from transacoes where usuario_id = $1";
    const filtrarTransacaoCategoria =
      "select descricao from transacao where usuario_id = $1";

    const transacoes = await query(ListarTransacoes, [usuarioId]);

    if (filtro) {
      const filtrarTransacaoCategoriaUsuario = await query(
        filtrarTransacaoCategoria,
        [usuarioId]
      );
      return res.status(400).json({
        filtrarTransacaoCategoriaUsuario,
      });
    }

    if (!transacoes.rowCount) {
      return res.status(400).json({
        mensagem: "[]",
      });
    }

    res.status(200).json({
      transacoes,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
};

const excluirTransacaoUsuario = async (req, res) => {
  try {
    const { usuarioId } = req;
    const { id } = req.params;

    const existeTransacao = "select * from transacoes where id = $1";
    const buscarTransacao =
      "select usuario_id from transacoes where id = $1 and usuario_id = $2";
    const deletearTransacao =
      "delete from transacoes where id = $1 and usuario_id = $2";

    const transacao = await query(existeTransacao, [id]);

    if (!transacao.rowCount) {
      return res.status(400).json({
        mensagem: "Transacao não encontrada.",
      });
    }

    const transacaoUsuario = await query(buscarTransacao, [id, usuarioId]);

    if (!transacaoUsuario.rowCount) {
      return res.status(400).json({
        mensagem: "Usuario não possui a categoria informada.",
      });
    }

    const deletarTransacaoUsuario = await query(deletearTransacao, [
      id,
      usuarioId,
    ]);

    return res.status(200).json({ deletarTransacaoUsuario });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}

const extratoTransacaoUsuario = async (req, res) => {
  const { usuarioId } = req;
  const somandoEntrada =
    "select valor from transacoes where usuario_id = $1 and where tipo = $2";
  const tipoEntrada = "Entrada";
  const tipoSaida = "Saída";

  const somandoEntradaUsuario = await query(somandoEntrada, [
    usuarioId,
    tipoEntrada,
  ]);
  const somandoSaidaUsuario = await query(somandoEntrada, [
    usuarioId,
    tipoSaida,
  ]);

  if (somandoEntradaUsuario.rowCount > 0) {
  }
};

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  listarCategoriasUsuario,
  detalharCategoriasUsuario,
  cadastrarCategoriaUsuario,
  atualizarUsuario,
  atualizarCategoriasUsuario,
  excluirCategoriaUsuario,
  cadastrarTransacaoUsuario,
  listarTransacaoUsuario,
  excluirTransacaoUsuario,
  extratoTransacaoUsuario,
};
