const jwt = require('jsonwebtoken');
const pool = require('../db');

async function verificarToken(req, res, next) {
    try {
        const cabecalho = req.headers.authorization;

        if (!cabecalho) {
            return res.status(403).json({
                erro: 'Token não informado.'
            });
        }

        const token = cabecalho.split(' ')[1];

        if (!token) {
            return res.status(403).json({
                erro: 'Token não informado.'
            });
        }

        const dadosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const resultado = await pool.query(
            `SELECT id, nome, login, administrador
             FROM treinadores
             WHERE id = $1`,
            [dadosToken.data]
        );

        if (resultado.rows.length === 0) {
            return res.status(403).json({
                erro: 'Usuário não encontrado.'
            });
        }

        req.usuario = resultado.rows[0];

        next();

    } catch (erro) {
        return res.status(403).json({
            erro: 'Token inválido ou expirado.'
        });
    }
}

module.exports = verificarToken;