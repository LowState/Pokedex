import { Link } from 'react-router-dom';
import { urlImagem } from '../servicos/api';

function CardPokemon({ pokemon }) {
    return (
        <Link to={`/pokemon/${pokemon.id}`} className="card-pokemon">
            <span className="numero-pokemon">
                #{String(pokemon.id).padStart(3, '0')}
            </span>

            <img
                src={urlImagem(pokemon.foto)}
                alt={pokemon.nome}
                loading="lazy"
            />

            <h2>{pokemon.nome}</h2>

            <div className="tipos-pokemon">
                {pokemon.tipos?.map(tipo => (
                    <span key={tipo} className="tipo-pokemon">
                        {tipo}
                    </span>
                ))}
            </div>
        </Link>
    );
}

export default CardPokemon;