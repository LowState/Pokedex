import { useState } from 'react';
import AdminPokemon from '../componentes/AdminPokemon';
import AdminMovimentos from '../componentes/AdminMovimentos';

function Admin() {
    const [aba, setAba] = useState('pokemon');

    return (
        <section>
            <h1>Painel administrativo</h1>

            <p>
                Gerencie os Pokémon, movimentos e informações da Pokédex.
            </p>

            <div className="abas-admin">
                <button
                    className={aba === 'pokemon' ? 'aba-ativa' : ''}
                    onClick={() => setAba('pokemon')}
                >
                    Pokémon
                </button>

                <button
                    className={aba === 'movimentos' ? 'aba-ativa' : ''}
                    onClick={() => setAba('movimentos')}
                >
                    Movimentos
                </button>
            </div>

            {aba === 'pokemon' && <AdminPokemon />}

            {aba === 'movimentos' && <AdminMovimentos />}
        </section>
    );
}

export default Admin;