import AdminPokemon from '../componentes/AdminPokemon';

function Admin() {
    return (
        <section>
            <h1>Painel administrativo</h1>

            <p>
                Gerencie os Pokémon, movimentos e informações da Pokédex.
            </p>

            <AdminPokemon />
        </section>
    );
}

export default Admin;