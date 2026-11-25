function obterUsuario() {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuario || !token) {
        return null;
    }

    try {
        return JSON.parse(usuario);
    } catch {
        return null;
    }
}

function salvarSessao(token, usuario) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

function encerrarSessao() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
}

export { obterUsuario, salvarSessao, encerrarSessao };