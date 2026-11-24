import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cabecalho from './componentes/Cabecalho';
import Pokedex from './paginas/Pokedex';
import './App.css';

function PaginaTemporaria({ titulo }) {
    return <h1>{titulo}</h1>;
}

function App() {
    return (
        <BrowserRouter>
            <Cabecalho />

            <main className="conteudo">
                <Routes>
                    <Route path="/" element={<Pokedex />} />

                    <Route path="/pokemon/:id"
                        element={<PaginaTemporaria titulo="Detalhes do Pokémon" />} />

                    <Route path="/login"
                        element={<PaginaTemporaria titulo="Login" />} />

                    <Route path="/cadastro"
                        element={<PaginaTemporaria titulo="Cadastro" />} />

                    <Route path="/favoritos"
                        element={<PaginaTemporaria titulo="Favoritos" />} />

                    <Route path="/equipe"
                        element={<PaginaTemporaria titulo="Minha equipe" />} />

                    <Route path="/perfil"
                        element={<PaginaTemporaria titulo="Meu perfil" />} />

                    <Route path="/admin"
                        element={<PaginaTemporaria titulo="Administração" />} />

                    <Route path="*"
                        element={<PaginaTemporaria titulo="Página não encontrada" />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;