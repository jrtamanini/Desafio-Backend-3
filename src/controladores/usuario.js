const { query } = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');


const cadastrar = async (req, res) => {
    try {
        let { nome, email, senha } = req.body;
        if (!nome) {
            return res.status(400).json({
                mensagem: 'O campo NOME é obrigatorio'
            })
        }
        if (!email) {
            return res.status(400).json({
                mensagem: 'O campo EMAIL é obrigatorio'
            })
        }
        if (!senha) {
            return res.status(400).json({
                mensagem: 'O campo SENHA é obrigatorio'
            })
        }

        let data = await query(
            'select * from usuarios where email = $1');

        if (data.rowCount > 0) {
            return res.status(400).json({
                mensagem: 'O email informado ja esta cadastrado'
            });
        }

        let senhaCriptografada = await bcrypt.hash(senha, 10);

        let dataInsert = await query(
            'insert into usuarios (nome, email, senha) values ($1, $2, #3) RETURNING id, nome, email',
            [nome, email, senhaCriptografada]
        );

        if (dataInsert.rowCount == 0) {
            return res.status(400).json({
                mensagem: 'Não foi possivel cadastrar o usuario, verifique os dados'
            })
        }


        return res.status(201).json(dataInsert.rows[0])
    } catch (error) {
        return res.status(400).json({
            mensagem: error
        })
    }
};



const listar = async (req, res) => {
    try {
        let data = await query('select * from usuarios')

        if (data.rowCount == 0) {
            return res.status(400).json({
                mensagem: 'Não existe usuário cadastrado'
            })
        }

        return res.status(200).json(data.rows)
    } catch (error) {
        return res.status(500).json({
            mensagem: error.message
        })
    }

};




module.exports = {
    cadastrar,
    listar
}