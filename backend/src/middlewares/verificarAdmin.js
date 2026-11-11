function verificarAdmin(req, res, next) {
    if (!req.usuario.administrador) {
        return res.status(403).json({
            erro: 'Acesso permitido apenas para administradores.'
        });
    }

    next();
}

module.exports = verificarAdmin;