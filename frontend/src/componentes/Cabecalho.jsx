import { Link, NavLink } from 'react-router-dom';

function Cabecalho() {
    return (
        <header className="cabecalho">
            <Link to="/" className="logo">
                Pokédex
            </Link>

            <nav>
                <NavLink to="/" end>Pokédex</NavLink>
                <NavLink to="/favoritos">Favoritos</NavLink>
                <NavLink to="/equipe">Minha equipe</NavLink>
                <NavLink to="/perfil">Perfil</NavLink>
                <NavLink to="/login">Entrar</NavLink>
                <NavLink to="/cadastro">Cadastrar</NavLink>
            </nav>
        </header>
    );
}

export default Cabecalho;