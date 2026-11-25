import { Link, NavLink, useNavigate } from 'react-router-dom';

function Cabecalho({ usuario, onLogout }) {
    const navigate = useNavigate();

    function sair() {
        onLogout();
        navigate('/');
    }

    return (
        <header className="cabecalho">
            <Link to="/" className="logo">
                Pokédex
            </Link>

            <nav>
                <NavLink to="/" end>Pokédex</NavLink>

                {usuario ? (
                    <>
                        <NavLink to="/favoritos">Favoritos</NavLink>
                        <NavLink to="/equipe">Minha equipe</NavLink>
                        <NavLink to="/perfil">Perfil</NavLink>

                        {usuario.administrador && (
                            <NavLink to="/admin">Administração</NavLink>
                        )}

                        <span className="nome-treinador">
                            Olá, {usuario.nome}
                        </span>

                        <button className="botao-sair" onClick={sair}>
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Entrar</NavLink>
                        <NavLink to="/cadastro">Cadastrar</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Cabecalho;