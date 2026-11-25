import { useEffect, useState } from 'react';
import { requisicao, urlImagem } from '../servicos/api';
import tipos from '../servicos/tipos';

const formularioVazio = {
    id: '',
    nome: '',
    foto: '',
    altura_m: '',
    peso_kg: '',
    hp_base: '',
    ataque_base: '',
    defesa_base: '',
    ataque_especial_base: '',
    defesa_especial_base: '',
    velocidade_base: '',
    tipo1: '',
    tipo2: ''
};

const atributos = [
    { campo: 'hp_base', nome: 'HP' },
    { campo: 'ataque_base', nome: 'Ataque' },
    { campo: 'defesa_base', nome: 'Defesa' },
    { campo: 'ataque_especial_base', nome: 'Ataque especial' },
    { campo: 'defesa_especial_base', nome: 'Defesa especial' },
    { campo: 'velocidade_base', nome: 'Velocidade' }
];

function AdminPokemon() {
    const [pokemon, setPokemon] = useState([]);
    const [formulario, setFormulario] = useState(formularioVazio);
    const [idEditando, setIdEditando] = useState(null);
    const [pesquisa, setPesquisa] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarPokemon() {
            try {
                setPokemon(await requisicao('/pokemon'));
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarPokemon();
    }, []);

    function alterarCampo(e) {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    }

    function limparFormulario() {
        setFormulario(formularioVazio);
        setIdEditando(null);
    }

    async function salvarPokemon(e) {
        e.preventDefault();
        setErro('');
        setMensagem('');

        if (formulario.tipo1 === formulario.tipo2) {
            setErro('Os tipos não podem ser iguais.');
            return;
        }

        const tiposSelecionados = [
            Number(formulario.tipo1)
        ];

        if (formulario.tipo2) {
            tiposSelecionados.push(Number(formulario.tipo2));
        }

        const dadosPokemon = {
            nome: formulario.nome.trim(),
            foto: formulario.foto.trim() || null,
            altura_m: Number(formulario.altura_m),
            peso_kg: Number(formulario.peso_kg),
            hp_base: Number(formulario.hp_base),
            ataque_base: Number(formulario.ataque_base),
            defesa_base: Number(formulario.defesa_base),
            ataque_especial_base: Number(formulario.ataque_especial_base),
            defesa_especial_base: Number(formulario.defesa_especial_base),
            velocidade_base: Number(formulario.velocidade_base),
            tipos: tiposSelecionados
        };

        if (idEditando === null) {
            dadosPokemon.id = Number(formulario.id);
        }

        setEnviando(true);

        try {
            const dados = await requisicao(
                idEditando !== null
                    ? `/pokemon/${idEditando}`
                    : '/pokemon',
                {
                    method: idEditando !== null ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosPokemon)
                }
            );

            setMensagem(dados.mensagem || 'Pokémon salvo com sucesso!');
            limparFormulario();
            setPokemon(await requisicao('/pokemon'));
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function editarPokemon(id) {
        setErro('');
        setMensagem('');
        setEnviando(true);

        try {
            const dados = await requisicao(`/pokemon/${id}`);

            const tiposPokemon = dados.tipos.map(tipo => {
                const nome = typeof tipo === 'string'
                    ? tipo
                    : tipo.nome;

                const tipoEncontrado = tipos.find(t =>
                    t.nome === nome ||
                    t.id === Number(tipo?.id ?? tipo?.tipo_id)
                );

                return tipoEncontrado
                    ? String(tipoEncontrado.id)
                    : '';
            });

            if (!tiposPokemon[0] || tiposPokemon.some(tipo => !tipo)) {
                throw new Error('Não foi possível identificar os tipos do Pokémon.');
            }

            setFormulario({
                ...dados,
                foto: dados.foto || '',
                tipo1: tiposPokemon[0],
                tipo2: tiposPokemon[1] || ''
            });

            setIdEditando(id);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function excluirPokemon(p) {
        const confirmar = window.confirm(
            `Deseja realmente excluir ${p.nome}? Seus relacionamentos também poderão ser removidos.`
        );

        if (!confirmar) {
            return;
        }

        setErro('');
        setMensagem('');
        setEnviando(true);

        try {
            const dados = await requisicao(`/pokemon/${p.id}`, {
                method: 'DELETE'
            });

            if (idEditando === p.id) {
                limparFormulario();
            }

            setMensagem(dados.mensagem || 'Pokémon excluído com sucesso!');
            setPokemon(await requisicao('/pokemon'));
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    const termo = pesquisa.toLowerCase().trim();

    const pokemonFiltrados = pokemon.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        String(p.id).includes(termo)
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
                <h2>
                    {idEditando !== null
                        ? 'Editar Pokémon'
                        : 'Cadastrar Pokémon'}
                </h2>

                <form onSubmit={salvarPokemon}>
                    <fieldset
                        className="formulario-admin"
                        disabled={enviando}
                    >
                        <label>
                            Número da Pokédex
                            <input
                                type="number"
                                name="id"
                                min="1"
                                value={formulario.id}
                                onChange={alterarCampo}
                                disabled={idEditando !== null}
                                required
                            />
                        </label>

                        <label>
                            Nome
                            <input
                                type="text"
                                name="nome"
                                maxLength={50}
                                value={formulario.nome}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <label className="campo-completo">
                            Caminho da imagem
                            <input
                                type="text"
                                name="foto"
                                maxLength={255}
                                placeholder="/imagens/pokemon/001.png"
                                value={formulario.foto}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Altura (m)
                            <input
                                type="number"
                                name="altura_m"
                                min="0.01"
                                max="99.99"
                                step="0.01"
                                value={formulario.altura_m}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <label>
                            Peso (kg)
                            <input
                                type="number"
                                name="peso_kg"
                                min="0.01"
                                max="9999.99"
                                step="0.01"
                                value={formulario.peso_kg}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        {atributos.map(atributo => (
                            <label key={atributo.campo}>
                                {atributo.nome}

                                <input
                                    type="number"
                                    name={atributo.campo}
                                    min="1"
                                    step="1"
                                    value={formulario[atributo.campo]}
                                    onChange={alterarCampo}
                                    required
                                />
                            </label>
                        ))}

                        <label>
                            Tipo principal

                            <select
                                name="tipo1"
                                value={formulario.tipo1}
                                onChange={alterarCampo}
                                required
                            >
                                <option value="">Selecione</option>

                                {tipos.map(tipo => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Tipo secundário

                            <select
                                name="tipo2"
                                value={formulario.tipo2}
                                onChange={alterarCampo}
                            >
                                <option value="">Nenhum</option>

                                {tipos.map(tipo => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="acoes-admin campo-completo">
                            <button type="submit">
                                {enviando
                                    ? 'Aguarde...'
                                    : idEditando !== null
                                        ? 'Salvar alterações'
                                        : 'Cadastrar Pokémon'}
                            </button>

                            <button
                                type="button"
                                className="botao-secundario"
                                onClick={limparFormulario}
                            >
                                {idEditando !== null
                                    ? 'Cancelar edição'
                                    : 'Limpar formulário'}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>

            <div className="painel-admin">
                <h2>Pokémon cadastrados</h2>

                <input
                    className="pesquisa-pokemon"
                    type="search"
                    placeholder="Pesquise por nome ou número..."
                    value={pesquisa}
                    onChange={e => setPesquisa(e.target.value)}
                />

                <p className="total-pokemon">
                    Pokémon encontrados: {pokemonFiltrados.length}
                </p>

                {carregando ? (
                    <p>Carregando Pokémon...</p>
                ) : (
                    <div className="tabela-admin-container">
                        <table className="tabela-admin">
                            <thead>
                                <tr>
                                    <th>Número</th>
                                    <th>Imagem</th>
                                    <th>Nome</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pokemonFiltrados.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            #{String(p.id).padStart(3, '0')}
                                        </td>

                                        <td>
                                            {p.foto ? (
                                                <img
                                                    src={urlImagem(p.foto)}
                                                    alt={p.nome}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                'Sem imagem'
                                            )}
                                        </td>

                                        <td>{p.nome}</td>

                                        <td>
                                            <div className="acoes-admin">
                                                <button
                                                    onClick={() => editarPokemon(p.id)}
                                                    disabled={enviando}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="botao-excluir"
                                                    onClick={() => excluirPokemon(p)}
                                                    disabled={enviando}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {pokemonFiltrados.length === 0 && (
                            <p>Nenhum Pokémon encontrado.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminPokemon;