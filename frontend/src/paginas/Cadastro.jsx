import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requisicao } from '../servicos/api';

function Cadastro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function cadastrar(e) {
        e.preventDefault();
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setEnviando(true);

        try {
            await requisicao('/usuarios/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    login: login.trim(),
                    senha
                })
            });

            navigate('/login', {
                state: {
                    mensagem: 'Cadastro realizado com sucesso!'
                }
            });
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="pagina-autenticacao">
            <form className="formulario-autenticacao" onSubmit={cadastrar}>
                <h1>Criar conta</h1>

                <p>Cadastre-se para começar sua jornada Pokémon.</p>

                {erro && <p className="mensagem-erro">{erro}</p>}

                <label htmlFor="nome">Nome</label>
                <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    maxLength={100}
                    required
                />

                <label htmlFor="login">Login</label>
                <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    maxLength={50}
                    required
                />

                <label htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                />

                <label htmlFor="confirmarSenha">Confirmar senha</label>
                <input
                    id="confirmarSenha"
                    type="password"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    required
                />

                <button type="submit" disabled={enviando}>
                    {enviando ? 'Cadastrando...' : 'Cadastrar'}
                </button>

                <p className="link-autenticacao">
                    Já possui uma conta? <Link to="/login">Entrar</Link>
                </p>
            </form>
        </section>
    );
}

export default Cadastro;