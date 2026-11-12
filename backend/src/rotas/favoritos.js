const express = require('express');
const pool = require('../db');
const verificarToken = require('../middlewares/verificarToken');

const router = express.Router();

router.use(verificarToken);

router.get('/', async (req, res) => {
    try {
        const treinadorId = req.usuario.id;

        const resultado = await pool.query(
            `SELECT p.*, f.pokemon_id
             FROM favoritos f
             JOIN pokemon p ON p.id = f.pokemon_id
             WHERE f.treinador_id = $1
             ORDER BY p.id`,
            [treinadorId]
        );

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar favoritos:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível listar os favoritos.'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const treinadorId = req.usuario.id;
        const { pokemon_id } = req.body;

        if (!Number.isInteger(pokemon_id) || pokemon_id <= 0) {
            return res.status(400).json({
                erro: 'Informe um ID de Pokémon válido.'
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
            `INSERT INTO favoritos (treinador_id, pokemon_id)
             VALUES ($1, $2)
             ON CONFLICT (treinador_id, pokemon_id) DO NOTHING
             RETURNING *`,
            [treinadorId, pokemon_id]
        );

        if (resultado.rows.length === 0) {
            return res.status(409).json({
                erro: 'Este Pokémon já está nos seus favoritos.'
            });
        }

        res.status(201).json({
            mensagem: 'Pokémon adicionado aos favoritos!',
            pokemon: pokemon.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao adicionar favorito:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível adicionar o favorito.'
        });
    }
});

router.delete('/:pokemonId', async (req, res) => {
    try {
        const treinadorId = req.usuario.id;
        const pokemonId = Number(req.params.pokemonId);

        if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
            return res.status(400).json({
                erro: 'ID do Pokémon inválido.'
            });
        }

        const resultado = await pool.query(
            `DELETE FROM favoritos
             WHERE treinador_id = $1 AND pokemon_id = $2
             RETURNING *`,
            [treinadorId, pokemonId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Pokémon não encontrado nos seus favoritos.'
            });
        }

        res.json({
            mensagem: 'Pokémon removido dos favoritos!',
            pokemon_id: pokemonId
        });
    } catch (erro) {
        console.error('Erro ao remover favorito:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível remover o favorito.'
        });
    }
});

module.exports = router;