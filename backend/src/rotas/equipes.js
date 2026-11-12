const express = require('express');
const pool = require('../db');
const verificarToken = require('../middlewares/verificarToken');

const router = express.Router();

router.use(verificarToken);

router.get('/', async (req, res) => {
    try {
        const treinadorId = req.usuario.id;

        const resultado = await pool.query(
            `SELECT
                e.posicao,
                e.apelido,
                p.*
             FROM equipe e
             LEFT JOIN pokemon p ON p.id = e.pokemon_id
             WHERE e.treinador_id = $1
             ORDER BY e.posicao`,
            [treinadorId]
        );

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar equipe:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível listar a equipe.'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const treinadorId = req.usuario.id;
        const { pokemon_id, posicao, apelido } = req.body;

        if (!Number.isInteger(pokemon_id) || pokemon_id <= 0) {
            return res.status(400).json({
                erro: 'Informe um ID de Pokémon válido.'
            });
        }

        if (!Number.isInteger(posicao) || posicao < 1 || posicao > 6) {
            return res.status(400).json({
                erro: 'A posição deve ser um número inteiro entre 1 e 6.'
            });
        }

        if (apelido != null && (typeof apelido !== 'string' || apelido.length > 50)) {
            return res.status(400).json({
                erro: 'O apelido deve ter no máximo 50 caracteres.'
            });
        }

        const pokemon = await pool.query(
            'SELECT id, nome FROM pokemon WHERE id = $1',
            [pokemon_id]
        );

        if (pokemon.rows.length === 0) {
            return res.status(404).json({
                erro: 'Pokémon não encontrado.'
            });
        }

        const resultado = await pool.query(
            `INSERT INTO equipe (treinador_id, pokemon_id, posicao, apelido)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (treinador_id, posicao) DO NOTHING
             RETURNING *`,
            [treinadorId, pokemon_id, posicao, apelido || null]
        );

        if (resultado.rows.length === 0) {
            return res.status(409).json({
                erro: 'Esta posição já está ocupada na equipe.'
            });
        }

        res.status(201).json({
            mensagem: 'Pokémon adicionado à equipe!',
            equipe: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao adicionar Pokémon à equipe:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível adicionar o Pokémon à equipe.'
        });
    }
});

router.put('/:posicao', async (req, res) => {
    try {
        const treinadorId = req.usuario.id;
        const posicao = Number(req.params.posicao);
        const { pokemon_id, apelido } = req.body;

        if (!Number.isInteger(posicao) || posicao < 1 || posicao > 6) {
            return res.status(400).json({
                erro: 'A posição deve ser um número inteiro entre 1 e 6.'
            });
        }

        if (!Number.isInteger(pokemon_id) || pokemon_id <= 0) {
            return res.status(400).json({
                erro: 'Informe um ID de Pokémon válido.'
            });
        }

        if (apelido != null && (typeof apelido !== 'string' || apelido.length > 50)) {
            return res.status(400).json({
                erro: 'O apelido deve ter no máximo 50 caracteres.'
            });
        }

        const pokemon = await pool.query(
            'SELECT id FROM pokemon WHERE id = $1',
            [pokemon_id]
        );

        if (pokemon.rows.length === 0) {
            return res.status(404).json({
                erro: 'Pokémon não encontrado.'
            });
        }

        const resultado = await pool.query(
            `UPDATE equipe
             SET pokemon_id = $1, apelido = $2
             WHERE treinador_id = $3 AND posicao = $4
             RETURNING *`,
            [pokemon_id, apelido || null, treinadorId, posicao]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Esta posição ainda não possui um Pokémon.'
            });
        }

        res.json({
            mensagem: 'Pokémon da equipe atualizado!',
            equipe: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao atualizar equipe:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível atualizar a equipe.'
        });
    }
});

router.delete('/:posicao', async (req, res) => {
    try {
        const treinadorId = req.usuario.id;
        const posicao = Number(req.params.posicao);

        if (!Number.isInteger(posicao) || posicao < 1 || posicao > 6) {
            return res.status(400).json({
                erro: 'A posição deve ser um número inteiro entre 1 e 6.'
            });
        }

        const resultado = await pool.query(
            `DELETE FROM equipe
             WHERE treinador_id = $1 AND posicao = $2
             RETURNING *`,
            [treinadorId, posicao]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Esta posição está vazia.'
            });
        }

        res.json({
            mensagem: 'Pokémon removido da equipe!',
            equipe: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao remover Pokémon da equipe:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível remover o Pokémon da equipe.'
        });
    }
});

module.exports = router;