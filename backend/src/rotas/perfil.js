const express = require('express');
const pool = require('../db');
const verificarToken = require('../middlewares/verificarToken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const router = express.Router();
const pastaUploads = path.join(__dirname, '../../uploads');

fs.mkdirSync(pastaUploads, { recursive: true });

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const extensoes = ['.jpg', '.jpeg', '.png', '.webp'];
        const tipos = ['image/jpeg', 'image/png', 'image/webp'];
        const extensao = path.extname(file.originalname).toLowerCase();

        if (!extensoes.includes(extensao) || !tipos.includes(file.mimetype)) {
            return cb(new Error('Envie uma imagem JPG, PNG ou WEBP.'));
        }

        cb(null, true);
    }
});

function excluirArquivo(caminho) {
    if (!caminho || !caminho.startsWith('/uploads/')) {
        return;
    }

    const nome = path.basename(caminho);
    const arquivo = path.join(pastaUploads, nome);

    if (fs.existsSync(arquivo)) {
        fs.unlinkSync(arquivo);
    }
}

router.use(verificarToken);

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, nome, login, foto_perfil, administrador
             FROM treinadores
             WHERE id = $1`,
            [req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Treinador não encontrado.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao consultar perfil:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível consultar o perfil.'
        });
    }
});

router.put('/', async (req, res) => {
    try {
        const { nome, login } = req.body;

        if (
            typeof nome !== 'string' ||
            nome.trim().length === 0 ||
            nome.trim().length > 100 ||
            typeof login !== 'string' ||
            login.trim().length === 0 ||
            login.trim().length > 50
        ) {
            return res.status(400).json({
                erro: 'Informe um nome e um login válidos.'
            });
        }

        const resultado = await pool.query(
            `UPDATE treinadores
             SET nome = $1, login = $2
             WHERE id = $3
             RETURNING id, nome, login, foto_perfil, administrador`,
            [nome.trim(), login.trim(), req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Treinador não encontrado.'
            });
        }

        res.json({
            mensagem: 'Perfil atualizado com sucesso!',
            usuario: resultado.rows[0]
        });
    } catch (erro) {
        if (erro.code === '23505') {
            return res.status(409).json({
                erro: 'Este login já está em uso.'
            });
        }

        console.error('Erro ao atualizar perfil:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível atualizar o perfil.'
        });
    }
});

router.put('/senha', async (req, res) => {
    try {
        const { senha_atual, nova_senha } = req.body;

        if (
            typeof senha_atual !== 'string' ||
            typeof nova_senha !== 'string' ||
            nova_senha.length < 8 ||
            Buffer.byteLength(nova_senha, 'utf8') > 72
        ) {
            return res.status(400).json({
                erro: 'A nova senha deve ter pelo menos 8 caracteres e no máximo 72 bytes.'
            });
        }

        const resultado = await pool.query(
            'SELECT senha_hash FROM treinadores WHERE id = $1',
            [req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Treinador não encontrado.'
            });
        }

        const senhaCorreta = await bcrypt.compare(
            senha_atual,
            resultado.rows[0].senha_hash
        );

        if (!senhaCorreta) {
            return res.status(403).json({
                erro: 'Senha atual incorreta.'
            });
        }

        const senhaHash = await bcrypt.hash(nova_senha, 10);

        await pool.query(
            'UPDATE treinadores SET senha_hash = $1 WHERE id = $2',
            [senhaHash, req.usuario.id]
        );

        res.json({
            mensagem: 'Senha alterada com sucesso!'
        });
    } catch (erro) {
        console.error('Erro ao alterar senha:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível alterar a senha.'
        });
    }
});

router.post('/foto', upload.single('foto'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            erro: 'Envie uma imagem no campo foto.'
        });
    }

    let novoCaminho = null;

    try {
        const resultado = await pool.query(
            'SELECT foto_perfil FROM treinadores WHERE id = $1',
            [req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Treinador não encontrado.'
            });
        }

        const fotoAntiga = resultado.rows[0].foto_perfil;
        const extensao = path.extname(req.file.originalname).toLowerCase();
        const nomeArquivo = crypto.randomUUID() + extensao;

        novoCaminho = '/uploads/' + nomeArquivo;

        const caminhoCompleto = path.join(pastaUploads, nomeArquivo);

        fs.writeFileSync(caminhoCompleto, req.file.buffer);

        await pool.query(
            'UPDATE treinadores SET foto_perfil = $1 WHERE id = $2',
            [novoCaminho, req.usuario.id]
        );

        try {
            excluirArquivo(fotoAntiga);
        } catch (erro) {
            console.error('Não foi possível apagar a foto antiga:', erro.message);
        }

        res.json({
            mensagem: 'Foto de perfil atualizada!',
            foto_perfil: novoCaminho
        });
    } catch (erro) {
        if (novoCaminho) {
            try {
                excluirArquivo(novoCaminho);
            } catch (erroArquivo) {
                console.error('Erro ao limpar arquivo:', erroArquivo.message);
            }
        }

        console.error('Erro ao enviar foto:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível atualizar a foto.'
        });
    }
});

router.delete('/foto', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT foto_perfil FROM treinadores WHERE id = $1',
            [req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Treinador não encontrado.'
            });
        }

        const fotoAntiga = resultado.rows[0].foto_perfil;

        await pool.query(
            'UPDATE treinadores SET foto_perfil = NULL WHERE id = $1',
            [req.usuario.id]
        );

        try {
            excluirArquivo(fotoAntiga);
        } catch (erro) {
            console.error('Não foi possível apagar o arquivo da foto:', erro.message);
        }

        res.json({
            mensagem: 'Foto de perfil removida!'
        });
    } catch (erro) {
        console.error('Erro ao remover foto:', erro.message);

        res.status(500).json({
            erro: 'Não foi possível remover a foto.'
        });
    }
});

router.use((erro, req, res, next) => {
    if (erro.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            erro: 'Arquivo muito grande. O tamanho máximo é 5 MB.'
        });
    }

    res.status(400).json({
        erro: erro.message
    });
});

module.exports = router;