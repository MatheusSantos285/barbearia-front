
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// Esse componente recebe "children" (a página que queremos renderizar)
// e "roleRequired" (quem pode acessar: 'cliente', 'barbeiro' ou null para ambos)
export function PrivateRoute({ children, roleRequired }) {
    const { authenticated, loading } = useContext(AuthContext);
    
    // Recupera o tipo do usuário salvo no localStorage (ou do Contexto se você tivesse salvo lá)
    const userType = localStorage.getItem("@Barbearia:tipo"); 

    // 1. Enquanto carrega o token do localStorage, exibe algo simples
    if (loading) {
        return <div>Carregando...</div>;
    }

    // 2. Se não estiver logado, redireciona para o Login
    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    // 3. Se a rota exige um perfil específico (ex: Barbeiro) e o usuário não tem
    if (roleRequired && userType !== roleRequired) {
        alert("Acesso não autorizado para seu perfil.");
        // Redireciona para a página correta baseada no perfil dele
        return userType === "cliente" ? <Navigate to="/agendar" /> : <Navigate to="/dashboard" />;
    }

    // 4. Se passou por tudo, renderiza a página
    return children;
}