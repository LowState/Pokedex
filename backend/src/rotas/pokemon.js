const express = require('express');
const pool = require('../db');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

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

router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const {
            id,
            nome,
            foto,
            altura_m,
            peso_kg,
            hp_base,
            ataque_base,
            defesa_base,
            ataque_especial_base,
            defesa_especial_base,
            velocidade_base,
            tipos
        } = req.body;

        if (
            id == null ||
            !nome ||
            altura_m == null ||
            peso_kg == null ||
            hp_base == null ||
            ataque_base == null ||
            defesa_base == null ||
            ataque_especial_base == null ||
            defesa_especial_base == null ||
            velocidade_base == null ||
            !Array.isArray(tipos) ||
            tipos.length === 0
        ) {
            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios e informe pelo menos um tipo.'
            });
        }

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'O ID deve ser um número inteiro positivo.'
            });
        }

        if (
            typeof altura_m !== 'number' ||
            typeof peso_kg !== 'number' ||
            !Number.isFinite(altura_m) ||
            !Number.isFinite(peso_kg) ||
            altura_m <= 0 ||
            peso_kg <= 0
        ) {
            return res.status(400).json({
                erro: 'Altura e peso devem ser números positivos.'
            });
        }

        const atributos = [
            hp_base,
            ataque_base,
            defesa_base,
            ataque_especial_base,
            defesa_especial_base,
            velocidade_base
        ];

        for (const atributo of atributos) {
            if (!Number.isInteger(atributo) || atributo < 0) {
                return res.status(400).json({
                    erro: 'Os atributos base devem ser números inteiros não negativos.'
                });
            }
        }

        if (tipos.length > 2) {
            return res.status(400).json({
                erro: 'Um Pokémon pode ter no máximo dois tipos.'
            });
        }

        for (const tipo of tipos) {
            if (!Number.isInteger(tipo) || tipo <= 0) {
                return res.status(400).json({
                    erro: 'Os IDs dos tipos devem ser números inteiros positivos.'
                });
            }
        }

        if (new Set(tipos).size !== tipos.length) {
            return res.status(400).json({
                erro: 'Não é permitido repetir o mesmo tipo.'
            });
        }

        const pokemonExistente = await pool.query(
            'SELECT id FROM pokemon WHERE id = $1',
            [id]
        );

        if (pokemonExistente.rows.length > 0) {
            return res.status(409).json({
                erro: 'Já existe um Pokémon com esse ID.'
            });
        }

        for (const tipo of tipos) {
            const resultadoTipo = await pool.query(
                'SELECT id FROM tipos WHERE id = $1',
                [tipo]
            );

            if (resultadoTipo.rows.length === 0) {
                return res.status(400).json({
                    erro: `O tipo com ID ${tipo} não existe.`
                });
            }
        }

        const cliente = await pool.connect();

        try {
            await cliente.query('BEGIN');

            const novoPokemon = await cliente.query(
                `INSERT INTO pokemon (
                id, nome, foto, altura_m, peso_kg,
                hp_base, ataque_base, defesa_base,
                ataque_especial_base, defesa_especial_base,
                velocidade_base
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [
                    id,
                    nome,
                    foto || null,
                    altura_m,
                    peso_kg,
                    hp_base,
                    ataque_base,
                    defesa_base,
                    ataque_especial_base,
                    defesa_especial_base,
                    velocidade_base
                ]
            );

            for (let i = 0; i < tipos.length; i++) {
                await cliente.query(
                    `INSERT INTO pokemon_tipo (pokemon_id, tipo_id, posicao)
                    VALUES ($1, $2, $3)`,
                    [id, tipos[i], i + 1]
                );
            }

            await cliente.query('COMMIT');

            res.status(201).json({
                mensagem: 'Pokémon cadastrado com sucesso!',
                pokemon: {
                    ...novoPokemon.rows[0],
                    tipos: tipos
                }
            });

        } catch (erro) {
            await cliente.query('ROLLBACK');

            console.error('Erro na transação:', erro.message);

            res.status(500).json({
                erro: 'Não foi possível cadastrar o Pokémon.'
            });

        } finally {
            cliente.release();
        }

    } catch (erro) {
        console.error('Erro ao cadastrar Pokémon:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível cadastrar o Pokémon.'
        });
    }
});

module.exports = router;