import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { requisicao } from '../servicos/api';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function entrar(e) {
        e.preventDefault();
        setErro('');
        setEnviando(true);

        try {
            const dados = await requisicao('/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: login.trim(),
                    senha
                })
            });

            if (!dados.token || !dados.usuario) {
                throw new Error('Resposta de login inválida.');
            }

            onLogin(dados.token, dados.usuario);

            navigate('/', { replace: true });
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="pagina-autenticacao">
            <form className="formulario-autenticacao" onSubmit={entrar}>
                <h1>Entrar</h1>

                <p>Acesse sua conta de treinador Pokémon.</p>

                {location.state?.mensagem && !erro && (
                    <p className="mensagem-sucesso">
                        {location.state.mensagem}
                    </p>
                )}

                {erro && (
                    <p className="mensagem-erro">{erro}</p>
                )}

                <label htmlFor="login">Login</label>
                <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    autoComplete="username"
                    required
                />

                <label htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    autoComplete="current-password"
                    required
                />

                <button type="submit" disabled={enviando}>
                    {enviando ? 'Entrando...' : 'Entrar'}
                </button>

                <p className="link-autenticacao">
                    Não possui uma conta? <Link to="/cadastro">Cadastrar</Link>
                </p>
            </form>
        </section>
    );
}

export default Login;