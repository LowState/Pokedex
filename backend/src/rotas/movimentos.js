const express = require('express');
const pool = require('../db');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

const router = express.Router();
const routerPokemonMovimentos = express.Router();

function idValido(id) {
    return Number.isInteger(id) && id > 0;
}

async function pokemonExiste(id) {
    const resultado = await pool.query(
        'SELECT id FROM pokemon WHERE id = $1',
        [id]
    );

    return resultado.rows.length > 0;
}

async function movimentoExiste(id) {
    const resultado = await pool.query(
        'SELECT id FROM movimentos WHERE id = $1',
        [id]
    );

    return resultado.rows.length > 0;
}

async function validarMovimento(dados) {
    const { nome, tipo_id, poder, precisao, pp, categoria } = dados;

    if (
        typeof nome !== 'string' ||
        nome.trim().length === 0 ||
        nome.length > 80 ||
        !idValido(tipo_id) ||
        !Number.isInteger(pp) ||
        pp <= 0 ||
        !['fisico', 'especial', 'status'].includes(categoria)
    ) {
        return 'Dados obrigatórios inválidos.';
    }

    if (poder != null && (!Number.isInteger(poder) || poder < 0)) {
        return 'O poder deve ser um número inteiro não negativo.';
    }

    if (
        precisao != null &&
        (!Number.isInteger(precisao) || precisao < 0 || precisao > 100)
    ) {
        return 'A precisão deve ser um número inteiro entre 0 e 100.';
    }

    const tipo = await pool.query(
        'SELECT id FROM tipos WHERE id = $1',
        [tipo_id]
    );

    if (tipo.rows.length === 0) {
        return 'O tipo informado não existe.';
    }

    return null;
}

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT
                m.*,
                t.nome AS tipo
             FROM movimentos m
             JOIN tipos t ON t.id = m.tipo_id
             ORDER BY m.id`
        );

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar movimentos:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível listar os movimentos.'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!idValido(id)) {
            return res.status(400).json({
                erro: 'ID do movimento inválido.'
            });
        }

        const resultado = await pool.query(
            `SELECT
                m.*,
                t.nome AS tipo
             FROM movimentos m
             JOIN tipos t ON t.id = m.tipo_id
             WHERE m.id = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Movimento não encontrado.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao consultar movimento:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível consultar o movimento.'
        });
    }
});

router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const erroValidacao = await validarMovimento(req.body);

        if (erroValidacao) {
            return res.status(400).json({
                erro: erroValidacao
            });
        }

        const { nome, tipo_id, poder, precisao, pp, categoria } = req.body;

        const resultado = await pool.query(
            `INSERT INTO movimentos
                (nome, tipo_id, poder, precisao, pp, categoria)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                nome.trim(),
                tipo_id,
                poder ?? null,
                precisao ?? null,
                pp,
                categoria
            ]
        );

        res.status(201).json({
            mensagem: 'Movimento cadastrado com sucesso!',
            movimento: resultado.rows[0]
        });
    } catch (erro) {
        if (erro.code === '23505') {
            return res.status(409).json({
                erro: 'Já existe um movimento com esse nome.'
            });
        }

        console.error('Erro ao cadastrar movimento:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível cadastrar o movimento.'
        });
    }
});

router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!idValido(id)) {
            return res.status(400).json({
                erro: 'ID do movimento inválido.'
            });
        }

        if (!(await movimentoExiste(id))) {
            return res.status(404).json({
                erro: 'Movimento não encontrado.'
            });
        }

        const erroValidacao = await validarMovimento(req.body);

        if (erroValidacao) {
            return res.status(400).json({
                erro: erroValidacao
            });
        }

        const { nome, tipo_id, poder, precisao, pp, categoria } = req.body;

        const resultado = await pool.query(
            `UPDATE movimentos
             SET nome = $1,
                 tipo_id = $2,
                 poder = $3,
                 precisao = $4,
                 pp = $5,
                 categoria = $6
             WHERE id = $7
             RETURNING *`,
            [
                nome.trim(),
                tipo_id,
                poder ?? null,
                precisao ?? null,
                pp,
                categoria,
                id
            ]
        );

        res.json({
            mensagem: 'Movimento atualizado com sucesso!',
            movimento: resultado.rows[0]
        });
    } catch (erro) {
        if (erro.code === '23505') {
            return res.status(409).json({
                erro: 'Já existe um movimento com esse nome.'
            });
        }

        console.error('Erro ao atualizar movimento:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível atualizar o movimento.'
        });
    }
});

router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    let cliente;

    try {
        const id = Number(req.params.id);

        if (!idValido(id)) {
            return res.status(400).json({
                erro: 'ID do movimento inválido.'
            });
        }

        cliente = await pool.connect();

        await cliente.query('BEGIN');

        const movimento = await cliente.query(
            'SELECT id, nome FROM movimentos WHERE id = $1 FOR UPDATE',
            [id]
        );

        if (movimento.rows.length === 0) {
            await cliente.query('ROLLBACK');

            return res.status(404).json({
                erro: 'Movimento não encontrado.'
            });
        }

        await cliente.query(
            'DELETE FROM pokemon_movimento WHERE movimento_id = $1',
            [id]
        );

        await cliente.query(
            'DELETE FROM movimentos WHERE id = $1',
            [id]
        );

        await cliente.query('COMMIT');

        res.json({
            mensagem: 'Movimento excluído com sucesso!',
            movimento: movimento.rows[0]
        });
    } catch (erro) {
        if (cliente) {
            await cliente.query('ROLLBACK');
        }

        console.error('Erro ao excluir movimento:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível excluir o movimento.'
        });
    } finally {
        if (cliente) {
            cliente.release();
        }
    }
});

routerPokemonMovimentos.get('/:id/movimentos', async (req, res) => {
    try {
        const pokemonId = Number(req.params.id);

        if (!idValido(pokemonId)) {
            return res.status(400).json({
                erro: 'ID do Pokémon inválido.'
            });
        }

        if (!(await pokemonExiste(pokemonId))) {
            return res.status(404).json({
                erro: 'Pokémon não encontrado.'
            });
        }

        const resultado = await pool.query(
            `SELECT
                m.*,
                t.nome AS tipo
             FROM pokemon_movimento pm
             JOIN movimentos m ON m.id = pm.movimento_id
             JOIN tipos t ON t.id = m.tipo_id
             WHERE pm.pokemon_id = $1
             ORDER BY m.nome`,
            [pokemonId]
        );

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar movimentos do Pokémon:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível listar os movimentos do Pokémon.'
        });
    }
});

routerPokemonMovimentos.post(
    '/:id/movimentos',
    verificarToken,
    verificarAdmin,
    async (req, res) => {
        try {
            const pokemonId = Number(req.params.id);
            const { movimento_id } = req.body;

            if (!idValido(pokemonId) || !idValido(movimento_id)) {
                return res.status(400).json({
                    erro: 'Informe IDs válidos para Pokémon e movimento.'
                });
            }

            if (!(await pokemonExiste(pokemonId))) {
                return res.status(404).json({
                    erro: 'Pokémon não encontrado.'
                });
            }

            if (!(await movimentoExiste(movimento_id))) {
                return res.status(404).json({
                    erro: 'Movimento não encontrado.'
                });
            }

            const resultado = await pool.query(
                `INSERT INTO pokemon_movimento (pokemon_id, movimento_id)
                 VALUES ($1, $2)
                 ON CONFLICT (pokemon_id, movimento_id) DO NOTHING
                 RETURNING *`,
                [pokemonId, movimento_id]
            );

            if (resultado.rows.length === 0) {
                return res.status(409).json({
                    erro: 'O Pokémon já possui esse movimento.'
                });
            }

            res.status(201).json({
                mensagem: 'Movimento associado ao Pokémon!',
                associacao: resultado.rows[0]
            });
        } catch (erro) {
            console.error('Erro ao associar movimento:', erro.message);

            res.status(500).json({
                erro: 'Não foi possível associar o movimento.'
            });
        }
    }
);

routerPokemonMovimentos.delete(
    '/:id/movimentos/:movimentoId',
    verificarToken,
    verificarAdmin,
    async (req, res) => {
        try {
            const pokemonId = Number(req.params.id);
            const movimentoId = Number(req.params.movimentoId);

            if (!idValido(pokemonId) || !idValido(movimentoId)) {
                return res.status(400).json({
                    erro: 'IDs inválidos.'
                });
            }

            const resultado = await pool.query(
                `DELETE FROM pokemon_movimento
                 WHERE pokemon_id = $1 AND movimento_id = $2
                 RETURNING *`,
                [pokemonId, movimentoId]
            );

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    erro: 'Associação não encontrada.'
                });
            }

            res.json({
                mensagem: 'Movimento removido do Pokémon!',
                associacao: resultado.rows[0]
            });
        } catch (erro) {
            console.error('Erro ao remover movimento:', erro.message);

            res.status(500).json({
                erro: 'Não foi possível remover o movimento do Pokémon.'
            });
        }
    }
);

module.exports = {
    router,
    routerPokemonMovimentos
};