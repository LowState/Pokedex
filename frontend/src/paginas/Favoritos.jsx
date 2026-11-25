import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requisicao } from '../servicos/api';
import CardPokemon from '../componentes/CardPokemon';

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [removendo, setRemovendo] = useState(null);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarFavoritos() {
            try {
                const dados = await requisicao('/favoritos');

                setFavoritos(dados);
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarFavoritos();
    }, []);

    async function removerFavorito(id) {
        setErro('');
        setRemovendo(id);

        try {
            await requisicao(`/favoritos/${id}`, {
                method: 'DELETE'
            });

            setFavoritos(anteriores =>
                anteriores.filter(p => p.id !== id)
            );
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setRemovendo(null);
        }
    }

    return (
        <section>
            <h1>Meus favoritos</h1>

            <p>Confira seus Pokémon favoritos.</p>

            {carregando && <p>Carregando favoritos...</p>}

            {erro && <p className="mensagem-erro">{erro}</p>}

            {!carregando && (
                <>
                    <p className="total-pokemon">
                        Total de favoritos: {favoritos.length}
                    </p>

                    {!erro && favoritos.length === 0 && (
                        <div className="favoritos-vazios">
                            <h2>Nenhum Pokémon favoritado</h2>

                            <p>
                                Explore a Pokédex e adicione seus Pokémon favoritos.
                            </p>

                            <Link to="/" className="botao-voltar">
                                Explorar Pokédex
                            </Link>
                        </div>
                    )}

                    <div className="lista-pokemon">
                        {favoritos.map(pokemon => (
                            <div className="item-favorito" key={pokemon.id}>
                                <CardPokemon pokemon={pokemon} />

                                <button
                                    className="botao-remover-favorito"
                                    onClick={() => removerFavorito(pokemon.id)}
                                    disabled={removendo !== null}
                                >
                                    {removendo === pokemon.id
                                        ? 'Removendo...'
                                        : 'Remover dos favoritos'}
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default Favoritos;