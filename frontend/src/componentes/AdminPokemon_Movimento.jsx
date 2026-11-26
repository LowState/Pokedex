import { useEffect, useState } from 'react';
import { requisicao, urlImagem } from '../servicos/api';

function AdminPokemon_Movimento() {
    const [pokemon, setPokemon] = useState([]);
    const [movimentos, setMovimentos] = useState([]);
    const [associados, setAssociados] = useState(null);
    const [pokemonId, setPokemonId] = useState('');
    const [movimentoId, setMovimentoId] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        async function carregarDados() {
            try {
                setPokemon(await requisicao('/pokemon'));
                setMovimentos(await requisicao('/movimentos'));
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, []);

    async function selecionarPokemon(e) {
        const id = e.target.value;

        setPokemonId(id);
        setMovimentoId('');
        setAssociados(null);
        setErro('');
        setMensagem('');

        if (!id) {
            return;
        }

        setEnviando(true);

        try {
            const dados = await requisicao(`/pokemon/${id}/movimentos`);

            setAssociados(dados);
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function associarMovimento(e) {
        e.preventDefault();
        setErro('');
        setMensagem('');
        setEnviando(true);

        try {
            const dados = await requisicao(
                `/pokemon/${pokemonId}/movimentos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        movimento_id: Number(movimentoId)
                    })
                }
            );

            const movimento = movimentos.find(
                m => m.id === Number(movimentoId)
            );

            setAssociados([...associados, movimento]);
            setMovimentoId('');
            setMensagem(dados.mensagem);
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function removerMovimento(movimento) {
        const confirmar = window.confirm(
            `Deseja remover ${movimento.nome} deste Pokémon?`
        );

        if (!confirmar) {
            return;
        }

        setErro('');
        setMensagem('');
        setEnviando(true);

        try {
            const dados = await requisicao(
                `/pokemon/${pokemonId}/movimentos/${movimento.id}`,
                {
                    method: 'DELETE'
                }
            );

            setAssociados(
                associados.filter(m => m.id !== movimento.id)
            );

            setMensagem(dados.mensagem);
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    const pokemonSelecionado = pokemon.find(
        p => p.id === Number(pokemonId)
    );

    const movimentosDisponiveis = movimentos.filter(m =>
        !associados?.some(a => a.id === m.id)
    );

    return (
        <section className="admin-pokemon">
            {erro && (
                <p className="mensagem-erro">{erro}</p>
            )}

            {mensagem && (
                <p className="mensagem-sucesso">{mensagem}</p>
            )}

            <div className="painel-admin">
                <h2>Selecionar Pokémon</h2>

                <div className="formulario-admin">
                    <label className="campo-completo">
                        Pokémon

                        <select
                            value={pokemonId}
                            onChange={selecionarPokemon}
                            disabled={carregando || enviando}
                        >
                            <option value="">
                                Selecione um Pokémon
                            </option>

                            {pokemon.map(p => (
                                <option key={p.id} value={p.id}>
                                    #{p.id} - {p.nome}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {pokemonSelecionado && (
                    <div className="pokemon-associacao">
                        <img
                            src={urlImagem(pokemonSelecionado.foto)}
                            alt={pokemonSelecionado.nome}
                        />

                        <div>
                            <h3>{pokemonSelecionado.nome}</h3>

                            <p>
                                #{String(pokemonSelecionado.id).padStart(3, '0')}
                            </p>

                            {associados !== null && (
                                <p>
                                    {associados.length} movimentos associados
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {pokemonId && associados === null && enviando && (
                <p>Carregando movimentos...</p>
            )}

            {pokemonSelecionado && associados !== null && (
                <>
                    <div className="painel-admin">
                        <h2>Associar movimento</h2>

                        <form onSubmit={associarMovimento}>
                            <fieldset
                                className="formulario-admin"
                                disabled={enviando}
                            >
                                <label className="campo-completo">
                                    Movimento

                                    <select
                                        value={movimentoId}
                                        onChange={e => setMovimentoId(e.target.value)}
                                        required
                                    >
                                        <option value="">
                                            Selecione um movimento
                                        </option>

                                        {movimentosDisponiveis.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.nome} - {m.tipo}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div className="acoes-admin campo-completo">
                                    <button
                                        type="submit"
                                        disabled={!movimentoId}
                                    >
                                        Associar movimento
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>

                    <div className="painel-admin">
                        <h2>
                            Movimentos de {pokemonSelecionado.nome}
                        </h2>

                        {associados.length === 0 ? (
                            <p>
                                Este Pokémon ainda não possui movimentos.
                            </p>
                        ) : (
                            <div className="tabela-admin-container">
                                <table className="tabela-admin">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th>Categoria</th>
                                            <th>Poder</th>
                                            <th>Precisão</th>
                                            <th>PP</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {associados.map(m => (
                                            <tr key={m.id}>
                                                <td>{m.nome}</td>
                                                <td>{m.tipo}</td>
                                                <td>{m.categoria}</td>
                                                <td>{m.poder ?? '-'}</td>

                                                <td>
                                                    {m.precisao != null
                                                        ? `${m.precisao}%`
                                                        : '-'}
                                                </td>

                                                <td>{m.pp}</td>

                                                <td>
                                                    <div className="acoes-admin">
                                                        <button
                                                            className="botao-excluir"
                                                            onClick={() => removerMovimento(m)}
                                                            disabled={enviando}
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
}

export default AdminPokemon_Movimento;