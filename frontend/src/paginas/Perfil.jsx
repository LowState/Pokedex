import { useEffect, useState } from 'react';
import { requisicao, urlImagem } from '../servicos/api';

function Perfil({ onAtualizarUsuario }) {
    const [perfil, setPerfil] = useState(null);
    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [foto, setFoto] = useState(null);
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        async function carregarPerfil() {
            try {
                const dados = await requisicao('/perfil');

                setPerfil(dados);
                setNome(dados.nome);
                setLogin(dados.login);
            } catch (erro) {
                setErro(erro.message);
            }
        }

        carregarPerfil();
    }, []);

    function limparMensagens() {
        setErro('');
        setMensagem('');
    }

    async function salvarDados(e) {
        e.preventDefault();
        limparMensagens();
        setEnviando(true);

        try {
            const dados = await requisicao('/perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    login: login.trim()
                })
            });

            setPerfil(dados.usuario);
            setNome(dados.usuario.nome);
            setLogin(dados.usuario.login);
            onAtualizarUsuario(dados.usuario);
            setMensagem(dados.mensagem);
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function alterarSenha(e) {
        e.preventDefault();
        limparMensagens();

        if (novaSenha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setEnviando(true);

        try {
            const dados = await requisicao('/perfil/senha', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senha_atual: senhaAtual,
                    nova_senha: novaSenha
                })
            });

            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            setMensagem(dados.mensagem);
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function enviarFoto(e) {
        e.preventDefault();
        limparMensagens();

        if (!foto) {
            setErro('Selecione uma imagem.');
            return;
        }

        if (foto.size > 5 * 1024 * 1024) {
            setErro('A imagem deve ter no máximo 5 MB.');
            return;
        }

        const formulario = e.currentTarget;
        const formData = new FormData();

        formData.append('foto', foto);

        setEnviando(true);

        try {
            const dados = await requisicao('/perfil/foto', {
                method: 'POST',
                body: formData
            });

            const perfilAtualizado = {
                ...perfil,
                foto_perfil: dados.foto_perfil
            };

            setPerfil(perfilAtualizado);
            onAtualizarUsuario(perfilAtualizado);
            setFoto(null);
            formulario.reset();
            setMensagem(dados.mensagem);
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function removerFoto() {
        limparMensagens();
        setEnviando(true);

        try {
            const dados = await requisicao('/perfil/foto', {
                method: 'DELETE'
            });

            const perfilAtualizado = {
                ...perfil,
                foto_perfil: null
            };

            setPerfil(perfilAtualizado);
            onAtualizarUsuario(perfilAtualizado);
            setMensagem(dados.mensagem);
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    if (!perfil) {
        return <p>{erro || 'Carregando perfil...'}</p>;
    }

    return (
        <section>
            <h1>Meu perfil</h1>
            <p>Gerencie sua conta de treinador Pokémon.</p>

            {erro && (
                <p className="mensagem-erro">{erro}</p>
            )}

            {mensagem && (
                <p className="mensagem-sucesso">{mensagem}</p>
            )}

            <div className="pagina-perfil">
                <div className="painel-perfil painel-foto">
                    {perfil.foto_perfil ? (
                        <img
                            className="foto-perfil"
                            src={urlImagem(perfil.foto_perfil)}
                            alt="Foto de perfil"
                        />
                    ) : (
                        <div className="foto-perfil foto-padrao">
                            {perfil.nome.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <h2>{perfil.nome}</h2>

                    <p>@{perfil.login}</p>

                    <span className="tipo-conta">
                        {perfil.administrador
                            ? 'Administrador'
                            : 'Treinador'}
                    </span>

                    <form
                        className="formulario-perfil"
                        onSubmit={enviarFoto}
                    >
                        <label htmlFor="foto">Foto de perfil</label>

                        <input
                            id="foto"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={e => setFoto(e.target.files[0] || null)}
                            required
                        />

                        <small>JPG, PNG ou WEBP. Até 5 MB.</small>

                        <button type="submit" disabled={enviando}>
                            Enviar foto
                        </button>
                    </form>

                    {perfil.foto_perfil && (
                        <button
                            className="botao-remover-foto"
                            onClick={removerFoto}
                            disabled={enviando}
                        >
                            Remover foto
                        </button>
                    )}
                </div>

                <div className="painel-perfil">
                    <h2>Dados pessoais</h2>

                    <form
                        className="formulario-perfil"
                        onSubmit={salvarDados}
                    >
                        <label htmlFor="nome">Nome</label>

                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            maxLength={100}
                            onChange={e => setNome(e.target.value)}
                            required
                        />

                        <label htmlFor="login">Login</label>

                        <input
                            id="login"
                            type="text"
                            value={login}
                            maxLength={50}
                            onChange={e => setLogin(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={enviando}>
                            Salvar alterações
                        </button>
                    </form>
                </div>

                <div className="painel-perfil">
                    <h2>Alterar senha</h2>

                    <form
                        className="formulario-perfil"
                        onSubmit={alterarSenha}
                    >
                        <label htmlFor="senhaAtual">Senha atual</label>

                        <input
                            id="senhaAtual"
                            type="password"
                            value={senhaAtual}
                            autoComplete="current-password"
                            onChange={e => setSenhaAtual(e.target.value)}
                            required
                        />

                        <label htmlFor="novaSenha">Nova senha</label>

                        <input
                            id="novaSenha"
                            type="password"
                            value={novaSenha}
                            minLength={8}
                            autoComplete="new-password"
                            onChange={e => setNovaSenha(e.target.value)}
                            required
                        />

                        <label htmlFor="confirmarSenha">
                            Confirmar nova senha
                        </label>

                        <input
                            id="confirmarSenha"
                            type="password"
                            value={confirmarSenha}
                            minLength={8}
                            autoComplete="new-password"
                            onChange={e => setConfirmarSenha(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={enviando}>
                            Alterar senha
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Perfil;