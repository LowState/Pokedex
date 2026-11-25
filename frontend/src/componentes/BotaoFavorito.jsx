import { useEffect, useState } from 'react';
import { requisicao } from '../servicos/api';

function BotaoFavorito({ pokemonId }) {
    const [favorito, setFavorito] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function verificarFavorito() {
            try {
                const dados = await requisicao('/favoritos');

                setFavorito(dados.some(p =>
                    Number(p.pokemon_id ?? p.id) === Number(pokemonId)
                ));
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        verificarFavorito();
    }, [pokemonId]);

    async function alternarFavorito() {
        setErro('');
        setEnviando(true);

        try {
            if (favorito) {
                await requisicao(`/favoritos/${pokemonId}`, {
                    method: 'DELETE'
                });

                setFavorito(false);
            } else {
                await requisicao('/favoritos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pokemon_id: Number(pokemonId)
                    })
                });

                setFavorito(true);
            }
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="area-favorito">
            <button
                className={`botao-favorito ${favorito ? 'favoritado' : ''}`}
                onClick={alternarFavorito}
                disabled={carregando || enviando}
                aria-pressed={favorito}
            >
                {carregando || enviando
                    ? 'Aguarde...'
                    : favorito
                        ? '♥ Remover dos favoritos'
                        : '♡ Adicionar aos favoritos'}
            </button>

            {erro && <p className="mensagem-erro">{erro}</p>}
        </div>
    );
}

export default BotaoFavorito;