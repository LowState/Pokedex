
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('funciona');
});

app.get('/teste-banco', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT NOW() AS horario'
        );

        res.json({
            mensagem: 'Conexão com PostgreSQL funcionando!',
            horario: resultado.rows[0].horario
        });
    } catch (erro) {
        console.error('Erro ao conectar ao banco:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível conectar ao banco de dados.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
