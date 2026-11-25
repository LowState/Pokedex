import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cabecalho from './componentes/Cabecalho';
import Pokedex from './paginas/Pokedex';
import './App.css';
import PokemonIndividual from './paginas/PokemonIndividual';
import Cadastro from './paginas/Cadastro';
import Login from './paginas/Login';

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

                    <Route path="/pokemon/:id" element={<PokemonIndividual />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/cadastro" element={<Cadastro />} />

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