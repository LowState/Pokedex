const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM pokemon ORDER BY id'
        );

        const resultadoTipos = await pool.query(
            `SELECT pt.pokemon_id, t.nome
            FROM pokemon_tipo pt
            JOIN tipos t ON pt.tipo_id = t.id
            ORDER BY pt.posicao`
        );

        const pokemons = resultado.rows;

        for (const pokemon of pokemons) {
            pokemon.tipos = [];

            for (const tipo of resultadoTipos.rows) {
                if (tipo.pokemon_id === pokemon.id) {
                    pokemon.tipos.push(tipo.nome);
                }
            }
        }

        res.json(pokemons);

    } catch (erro) {
        console.error('Erro ao listar Pokémon:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível listar os Pokémon.'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            'SELECT * FROM pokemon WHERE id = $1',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Pokémon não encontrado.'
            });
        }

        const resultadoTipos = await pool.query(
            `SELECT t.nome
            FROM pokemon_tipo pt
            JOIN tipos t ON pt.tipo_id = t.id
            WHERE pt.pokemon_id = $1
            ORDER BY pt.posicao`,
            [id]
        );

        const pokemon = resultado.rows[0];

        pokemon.tipos = resultadoTipos.rows.map(tipo => tipo.nome);

        res.json(pokemon);

    } catch (erro) {
        console.error('Erro ao buscar Pokémon:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível buscar o Pokémon.'
        });
    }
});

module.exports = router;