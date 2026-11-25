import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requisicao, urlImagem } from '../servicos/api';
import BotaoFavorito from '../componentes/BotaoFavorito';

function PokemonIndividual({ usuario }) {
    const { id } = useParams();

    const [pokemon, setPokemon] = useState(null);
    const [movimentos, setMovimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarDetalhes() {
            setCarregando(true);
            setErro('');

            try {
                const dadosPokemon = await requisicao(`/pokemon/${id}`);
                const dadosMovimentos = await requisicao(`/pokemon/${id}/movimentos`);

                setPokemon(dadosPokemon);
                setMovimentos(dadosMovimentos);
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarDetalhes();
    }, [id]);

    if (carregando) {
        return <p>Carregando Pokémon...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    if (!pokemon) {
        return <p>Pokémon não encontrado.</p>;
    }

    const atributos = [
        { nome: 'HP', valor: pokemon.hp_base },
        { nome: 'Ataque', valor: pokemon.ataque_base },
        { nome: 'Defesa', valor: pokemon.defesa_base },
        { nome: 'Ataque especial', valor: pokemon.ataque_especial_base },
        { nome: 'Defesa especial', valor: pokemon.defesa_especial_base },
        { nome: 'Velocidade', valor: pokemon.velocidade_base }
    ];

    return (
        <section>
            <Link to="/" className="botao-voltar">
                Voltar para a Pokédex
            </Link>

            <div className="detalhes-pokemon">
                <div className="apresentacao-pokemon">
                    <span className="numero-pokemon">
                        #{String(pokemon.id).padStart(3, '0')}
                    </span>

                    <h1>{pokemon.nome}</h1>

                    <img
                        src={urlImagem(pokemon.foto)}
                        alt={pokemon.nome}
                    />

                    <div className="tipos-pokemon">
                        {pokemon.tipos?.map((tipo, index) => (
                            <span key={index} className="tipo-pokemon">
                                {typeof tipo === 'string' ? tipo : tipo.nome}
                            </span>
                        ))}
                    </div>

                    <p>Altura: {pokemon.altura_m} m</p>
                    <p>Peso: {pokemon.peso_kg} kg</p>

                    {usuario ? (
                        <BotaoFavorito
                            key={`${usuario.id}-${pokemon.id}`}
                            pokemonId={pokemon.id}
                        />
                    ) : (
                        <Link to="/login" className="link-favorito">
                            Entre para adicionar aos favoritos
                        </Link>
                    )}
                </div>

                <div className="atributos-pokemon">
                    <h2>Atributos base</h2>

                    {atributos.map(atributo => (
                        <div className="atributo" key={atributo.nome}>
                            <div className="atributo-informacao">
                                <span>{atributo.nome}</span>
                                <strong>{atributo.valor}</strong>
                            </div>

                            <div className="barra-atributo">
                                <div
                                    className="barra-atributo-valor"
                                    style={{
                                        width: `${Math.min(atributo.valor / 255 * 100, 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="movimentos-pokemon">
                <h2>Movimentos</h2>

                {movimentos.length === 0 ? (
                    <p>Nenhum movimento cadastrado.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Poder</th>
                                <th>Precisão</th>
                                <th>PP</th>
                            </tr>
                        </thead>

                        <tbody>
                            {movimentos.map(movimento => (
                                <tr key={movimento.id}>
                                    <td>{movimento.nome}</td>
                                    <td>{movimento.categoria}</td>
                                    <td>{movimento.poder ?? '-'}</td>
                                    <td>{movimento.precisao ?? '-'}</td>
                                    <td>{movimento.pp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}

export default PokemonIndividual;