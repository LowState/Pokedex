const API_URL = 'http://localhost:3000';

async function requisicao(rota, opcoes = {}) {
    const resposta = await fetch(`${API_URL}${rota}`, opcoes);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro na requisição.');
    }

    return dados;
}

export { requisicao };