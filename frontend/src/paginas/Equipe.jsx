import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requisicao, urlImagem } from '../servicos/api';

function Equipe() {
    const [equipe, setEquipe] = useState(null);
    const [pokemon, setPokemon] = useState([]);
    const [posicaoEditando, setPosicaoEditando] = useState(null);
    const [pokemonId, setPokemonId] = useState('');
    const [apelido, setApelido] = useState('');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        async function carregarDados() {
            try {
                const dadosEquipe = await requisicao('/equipes');
                const dadosPokemon = await requisicao('/pokemon');

                setEquipe(dadosEquipe);
                setPokemon(dadosPokemon);
            } catch (erro) {
                setErro(erro.message);
            }
        }

        carregarDados();
    }, []);

    function editarPosicao(posicao, integrante) {
        setErro('');
        setPosicaoEditando(posicao);
        setPokemonId(integrante ? String(integrante.id) : '');
        setApelido(integrante?.apelido || '');
    }

    function cancelar() {
        setPosicaoEditando(null);
        setPokemonId('');
        setApelido('');
    }

    async function salvarPokemon(e) {
        e.preventDefault();
        setErro('');
        setEnviando(true);

        try {
            const integrante = equipe.find(
                p => Number(p.posicao) === posicaoEditando
            );

            const rota = integrante
                ? `/equipes/${posicaoEditando}`
                : '/equipes';

            const metodo = integrante ? 'PUT' : 'POST';

            await requisicao(rota, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pokemon_id: Number(pokemonId),
                    posicao: posicaoEditando,
                    apelido: apelido.trim() || null
                })
            });

            cancelar();
            setEquipe(await requisicao('/equipes'));
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function removerPokemon(posicao) {
        setErro('');
        setEnviando(true);

        try {
            await requisicao(`/equipes/${posicao}`, {
                method: 'DELETE'
            });

            cancelar();
            setEquipe(await requisicao('/equipes'));
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    if (!equipe) {
        return <p>{erro || 'Carregando equipe...'}</p>;
    }

    const posicoes = [1, 2, 3, 4, 5, 6];

    const pokemonDisponiveis = pokemon.filter(p =>
        !equipe.some(integrante =>
            Number(integrante.id) === Number(p.id) &&
            Number(integrante.posicao) !== posicaoEditando
        )
    );

    return (
        <section>
            <h1>Minha equipe</h1>

            <p>Monte sua equipe com até seis Pokémon.</p>

            <p className="total-pokemon">
                {equipe.length} de 6 posições ocupadas
            </p>

            {erro && (
                <p className="mensagem-erro">{erro}</p>
            )}

            <div className="lista-equipe">
                {posicoes.map(posicao => {
                    const integrante = equipe.find(
                        p => Number(p.posicao) === posicao
                    );

                    return (
                        <div className="espaco-equipe" key={posicao}>
                            <h2>Posição {posicao}</h2>

                            {integrante ? (
                                <>
                                    <Link to={`/pokemon/${integrante.id}`}>
                                        <img
                                            src={urlImagem(integrante.foto)}
                                            alt={integrante.nome}
                                        />

                                        <h3>{integrante.nome}</h3>
                                    </Link>

                                    {integrante.apelido && (
                                        <p>Apelido: {integrante.apelido}</p>
                                    )}
                                </>
                            ) : (
                                <p className="posicao-vazia">
                                    Posição vazia
                                </p>
                            )}

                            {posicaoEditando === posicao ? (
                                <form
                                    className="formulario-equipe"
                                    onSubmit={salvarPokemon}
                                >
                                    <label>Pokémon</label>

                                    <select
                                        value={pokemonId}
                                        onChange={e => setPokemonId(e.target.value)}
                                        required
                                    >
                                        <option value="">
                                            Selecione um Pokémon
                                        </option>

                                        {pokemonDisponiveis.map(p => (
                                            <option key={p.id} value={p.id}>
                                                #{p.id} - {p.nome}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Apelido (opcional)</label>

                                    <input
                                        type="text"
                                        value={apelido}
                                        maxLength={50}
                                        onChange={e => setApelido(e.target.value)}
                                    />

                                    <button type="submit" disabled={enviando}>
                                        {enviando ? 'Salvando...' : 'Salvar'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={cancelar}
                                        disabled={enviando}
                                    >
                                        Cancelar
                                    </button>
                                </form>
                            ) : (
                                <div className="acoes-equipe">
                                    <button
                                        onClick={() => editarPosicao(posicao, integrante)}
                                        disabled={enviando}
                                    >
                                        {integrante ? 'Alterar' : 'Adicionar'}
                                    </button>

                                    {integrante && (
                                        <button
                                            onClick={() => removerPokemon(posicao)}
                                            disabled={enviando}
                                        >
                                            Remover
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Equipe;