const jwt = require('jsonwebtoken')
const senhaSegura = require('../senha_segura')

const validarAutenticacao = (req, res, next) => {

    try {
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(401).json({
                mensagem: 'O usuário não está autenticado'
            })
        }

        const token = authorization.split(' ')[1]
        const verificarToken = jwt.verify(token, senhaSegura)
        req.usuarioId = verificarToken.id

        next()
    } catch (error) {
        return res.status(500).json({
            mensagem: error.message
        })
    }

}


module.exports = {
    validarAutenticacao
}