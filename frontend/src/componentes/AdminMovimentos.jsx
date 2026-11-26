import { useEffect, useState } from 'react';
import { requisicao } from '../servicos/api';
import tipos from '../servicos/tipos';

const formularioVazio = {
    nome: '',
    tipo_id: '',
    categoria: '',
    poder: '',
    precisao: '',
    pp: ''
};

function AdminMovimentos() {
    const [movimentos, setMovimentos] = useState([]);
    const [formulario, setFormulario] = useState(formularioVazio);
    const [idEditando, setIdEditando] = useState(null);
    const [pesquisa, setPesquisa] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarMovimentos() {
            try {
                setMovimentos(await requisicao('/movimentos'));
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarMovimentos();
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

    async function salvarMovimento(e) {
        e.preventDefault();
        setErro('');
        setMensagem('');
        setEnviando(true);

        const dadosMovimento = {
            nome: formulario.nome.trim(),
            tipo_id: Number(formulario.tipo_id),
            categoria: formulario.categoria,
            poder: formulario.poder === ''
                ? null
                : Number(formulario.poder),
            precisao: formulario.precisao === ''
                ? null
                : Number(formulario.precisao),
            pp: Number(formulario.pp)
        };

        try {
            const dados = await requisicao(
                idEditando !== null
                    ? `/movimentos/${idEditando}`
                    : '/movimentos',
                {
                    method: idEditando !== null ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosMovimento)
                }
            );

            setMensagem(dados.mensagem);
            limparFormulario();
            setMovimentos(await requisicao('/movimentos'));
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    function editarMovimento(movimento) {
        setErro('');
        setMensagem('');

        setFormulario({
            nome: movimento.nome,
            tipo_id: String(movimento.tipo_id),
            categoria: movimento.categoria,
            poder: movimento.poder ?? '',
            precisao: movimento.precisao ?? '',
            pp: movimento.pp
        });

        setIdEditando(movimento.id);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    async function excluirMovimento(movimento) {
        const confirmar = window.confirm(
            `Deseja excluir ${movimento.nome}? Ele também será removido dos Pokémon associados.`
        );

        if (!confirmar) {
            return;
        }

        setErro('');
        setMensagem('');
        setEnviando(true);

        try {
            const dados = await requisicao(
                `/movimentos/${movimento.id}`,
                {
                    method: 'DELETE'
                }
            );

            if (idEditando === movimento.id) {
                limparFormulario();
            }

            setMensagem(dados.mensagem);
            setMovimentos(await requisicao('/movimentos'));
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    const termo = pesquisa.toLowerCase().trim();

    const movimentosFiltrados = movimentos.filter(m =>
        m.nome.toLowerCase().includes(termo) ||
        m.tipo.toLowerCase().includes(termo) ||
        m.categoria.toLowerCase().includes(termo)
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
                        ? 'Editar movimento'
                        : 'Cadastrar movimento'}
                </h2>

                <form onSubmit={salvarMovimento}>
                    <fieldset
                        className="formulario-admin"
                        disabled={enviando}
                    >
                        <label>
                            Nome
                            <input
                                type="text"
                                name="nome"
                                maxLength={80}
                                value={formulario.nome}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <label>
                            Tipo
                            <select
                                name="tipo_id"
                                value={formulario.tipo_id}
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
                            Categoria
                            <select
                                name="categoria"
                                value={formulario.categoria}
                                onChange={alterarCampo}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="fisico">Físico</option>
                                <option value="especial">Especial</option>
                                <option value="status">Status</option>
                            </select>
                        </label>

                        <label>
                            Poder (opcional)
                            <input
                                type="number"
                                name="poder"
                                min="0"
                                step="1"
                                value={formulario.poder}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            Precisão (opcional)
                            <input
                                type="number"
                                name="precisao"
                                min="0"
                                max="100"
                                step="1"
                                value={formulario.precisao}
                                onChange={alterarCampo}
                            />
                        </label>

                        <label>
                            PP
                            <input
                                type="number"
                                name="pp"
                                min="1"
                                step="1"
                                value={formulario.pp}
                                onChange={alterarCampo}
                                required
                            />
                        </label>

                        <div className="acoes-admin campo-completo">
                            <button type="submit">
                                {enviando
                                    ? 'Aguarde...'
                                    : idEditando !== null
                                        ? 'Salvar alterações'
                                        : 'Cadastrar movimento'}
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
                <h2>Movimentos cadastrados</h2>

                <input
                    className="pesquisa-pokemon"
                    type="search"
                    placeholder="Pesquise por nome, tipo ou categoria..."
                    value={pesquisa}
                    onChange={e => setPesquisa(e.target.value)}
                />

                <p className="total-pokemon">
                    Movimentos encontrados: {movimentosFiltrados.length}
                </p>

                {carregando ? (
                    <p>Carregando movimentos...</p>
                ) : (
                    <div className="tabela-admin-container">
                        <table className="tabela-admin">
                            <thead>
                                <tr>
                                    <th>ID</th>
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
                                {movimentosFiltrados.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.id}</td>
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
                                                    onClick={() => editarMovimento(m)}
                                                    disabled={enviando}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="botao-excluir"
                                                    onClick={() => excluirMovimento(m)}
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

                        {movimentosFiltrados.length === 0 && (
                            <p>Nenhum movimento encontrado.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminMovimentos;