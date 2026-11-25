import { useEffect, useState } from 'react';
import { requisicao } from '../servicos/api';
import CardPokemon from '../componentes/CardPokemon';

function Pokedex() {
    const [pokemon, setPokemon] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarPokemon() {
            try {
                const dados = await requisicao('/pokemon');

                if (!Array.isArray(dados)) {
                    throw new Error('Formato de resposta inesperado.');
                }

                setPokemon(dados.map(p => ({
                    ...p,
                    tipos: Array.isArray(p.tipos)
                        ? p.tipos.map(tipo =>
                            typeof tipo === 'string' ? tipo : tipo?.nome
                        ).filter(Boolean)
                        : []
                })));
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarPokemon();
    }, []);

    const termo = pesquisa.toLowerCase().trim();

    const pokemonFiltrados = pokemon.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        String(p.id).includes(termo) ||
        p.tipos.some(tipo => tipo.toLowerCase().includes(termo))
    );

    return (
        <section>
            <h1>Pokédex</h1>

            <p>Conheça os Pokémon da primeira geração.</p>

            <input
                className="pesquisa-pokemon"
                type="search"
                placeholder="Pesquise por nome, número ou tipo..."
                value={pesquisa}
                onChange={e => setPesquisa(e.target.value)}
            />

            {carregando && <p>Carregando Pokémon...</p>}

            {erro && <p>{erro}</p>}

            {!carregando && !erro && (
                <>
                    <p className="total-pokemon">
                        Pokémon encontrados: {pokemonFiltrados.length}
                    </p>

                    <div className="lista-pokemon">
                        {pokemonFiltrados.map(p => (
                            <CardPokemon key={p.id} pokemon={p} />
                        ))}
                    </div>

                    {pokemonFiltrados.length === 0 && (
                        <p>Nenhum Pokémon encontrado.</p>
                    )}
                </>
            )}
        </section>
    );
}

export default Pokedex;