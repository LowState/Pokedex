import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Cabecalho from './componentes/Cabecalho';
import RotaProtegida from './componentes/RotaProtegida';

import Pokedex from './paginas/Pokedex';
import PokemonIndividual from './paginas/PokemonIndividual';
import Cadastro from './paginas/Cadastro';
import Login from './paginas/Login';
import Favoritos from './paginas/Favoritos';
import Equipe from './paginas/Equipe';
import Perfil from './paginas/Perfil';

import { obterUsuario, salvarSessao, encerrarSessao } from './servicos/autenticacao';

import './App.css';

function PaginaTemporaria({ titulo }) {
    return <h1>{titulo}</h1>;
}

function App() {
    const [usuario, setUsuario] = useState(obterUsuario);

    function entrar(token, usuario) {
        salvarSessao(token, usuario);
        setUsuario(usuario);
    }

    function sair() {
        encerrarSessao();
        setUsuario(null);
    }

    function atualizarUsuario(dados) {
        const token = localStorage.getItem('token');

        entrar(token, {
            ...usuario,
            ...dados
        });
    }

    return (
        <BrowserRouter>
            <Cabecalho usuario={usuario} onLogout={sair} />

            <main className="conteudo">
                <Routes>
                    <Route path="/" element={<Pokedex />} />

                    <Route
                        path="/pokemon/:id"
                        element={<PokemonIndividual usuario={usuario} />}
                    />

                    <Route
                        path="/login"
                        element={usuario ? <Navigate to="/" replace /> : <Login onLogin={entrar} />}
                    />

                    <Route
                        path="/cadastro"
                        element={usuario ? <Navigate to="/" replace /> : <Cadastro />}
                    />

                    <Route
                        path="/favoritos"
                        element={
                            <RotaProtegida usuario={usuario}>
                                <Favoritos />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/equipe"
                        element={
                            <RotaProtegida usuario={usuario}>
                                <Equipe />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/perfil"
                        element={
                            <RotaProtegida usuario={usuario}>
                                <Perfil onAtualizarUsuario={atualizarUsuario} />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <RotaProtegida usuario={usuario} administrador>
                                <PaginaTemporaria titulo="Administração" />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="*"
                        element={<PaginaTemporaria titulo="Página não encontrada" />}
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;