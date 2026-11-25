const API_URL = 'http://localhost:3000';

async function requisicao(rota, opcoes = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...opcoes.headers };

    if (token && rota !== '/usuarios/login' && rota !== '/usuarios/cadastro') {
        headers.Authorization = `Bearer ${token}`;
    }

    const resposta = await fetch(`${API_URL}${rota}`, {
        ...opcoes,
        headers
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || dados.mensagem || 'Erro na requisição.');
    }

    return dados;
}

function urlImagem(caminho) {
    if (!caminho) {
        return undefined;
    }

    if (caminho.startsWith('/')) {
        return `${API_URL}${caminho}`;
    }

    return caminho;
}

export { requisicao, urlImagem };