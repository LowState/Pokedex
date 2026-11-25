import { Navigate } from 'react-router-dom';

function RotaProtegida({ usuario, administrador = false, children }) {
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (administrador && !usuario.administrador) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RotaProtegida;