import { useEffect, useState } from 'react';
import { requisicao } from '../servicos/api';

function Pokedex() {
    const [pokemon, setPokemon] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarPokemon() {
            try {
                const dados = await requisicao('/pokemon');

                console.log('Resposta da API:', dados);

                if (!Array.isArray(dados)) {
                    throw new Error('Formato de resposta inesperado.');
                }

                setPokemon(dados);
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarPokemon();
    }, []);

    return (
        <section>
            <h1>Pokédex</h1>
            <p>Conheça os Pokémon da primeira geração.</p>

            {carregando && <p>Carregando Pokémon...</p>}

            {erro && <p>{erro}</p>}

            {!carregando && !erro && (
                <p>Total de Pokémon: {pokemon.length}</p>
            )}
        </section>
    );
}

export default Pokedex;