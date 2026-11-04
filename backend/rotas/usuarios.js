
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

router.post('/cadastro', async (req, res) => {
    try {
        const { nome, login, senha } = req.body;

        if (!nome || !login || !senha) {
            return res.status(400).json({
                erro: 'Nome, login e senha são obrigatórios.'
            });
        }

        const resultado = await pool.query(
            'SELECT id FROM treinadores WHERE login = $1',
            [login]
        );

        if (resultado.rows.length > 0) {
            return res.status(409).json({
                erro: 'Este login já está cadastrado.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            `INSERT INTO treinadores (nome, login, senha_hash)
             VALUES ($1, $2, $3)
             RETURNING id, nome, login, administrador`,
            [nome, login, senhaHash]
        );

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: novoUsuario.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao cadastrar usuário:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível cadastrar o usuário.'
        });
    }
});

module.exports = router;
