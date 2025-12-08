import { createContext, useState, useEffect } from "react";
import api from "../services/api";

// Cria o contexto (o canal de comunicação)
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Guarda os dados do usuário (se tiver)
    const [token, setToken] = useState(null); // Guarda o token JWT
    const [loading, setLoading] = useState(true); // Para não mostrar a tela antes de carregar o token

    useEffect(() => {
        // Ao abrir a aplicação, verifica se já tem token salvo no navegador
        const storagedToken = localStorage.getItem("@Barbearia:token");
        
        if (storagedToken) {
            setToken(storagedToken);
            // Configura o Axios para usar esse token em todas as chamadas futuras
            api.defaults.headers.common["Authorization"] = `Bearer ${storagedToken}`;
        }
        setLoading(false);
    }, []);

    // Função de Login (Recebe email e senha, chama o back, salva o token)
    const login = async (email, senha, tipoUser = "cliente") => {
        try {
            // Define a rota baseada no tipo (cliente ou barbeiro)
            const rota = tipoUser === "cliente" ? "/auth/cliente/login" : "/auth/barbeiro/login";
            
            const response = await api.post(rota, { email, senha });

            const { token } = response.data;

            // 1. Salva no estado
            setToken(token);
            
            // 2. Salva no armazenamento do navegador (para não deslogar ao dar F5)
            localStorage.setItem("@Barbearia:token", token);
            localStorage.setItem("@Barbearia:tipo", tipoUser); // Opcional: saber quem está logado

            // 3. Cola o token no Axios
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return true; // Sucesso
        } catch (error) {
            console.error("Erro no login", error);
            return false; // Falha
        }
    };

    // Função de Logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("@Barbearia:token");
        localStorage.removeItem("@Barbearia:tipo");
        // Remove o token do Axios
        delete api.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ 
            authenticated: !!token, // Se tem token, é true. Se null, é false.
            user, 
            login, 
            logout,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
}