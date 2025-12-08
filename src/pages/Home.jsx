import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getUsuarioDoToken } from "../utils/authUtils";

function Home() {
    // Pegamos o estado de autenticação para mudar a tela dinamicamente
    const { authenticated } = useContext(AuthContext);
    const usuario = getUsuarioDoToken();

    return (
        <div style={{ fontFamily: "Arial", textAlign: "center", padding: "50px 20px" }}>
            
            {/* Cabeçalho / Hero Section */}
            <div style={{ marginBottom: "50px" }}>
                <h1 style={{ fontSize: "3rem", color: "#333", marginBottom: "10px" }}>
                    💈 Barbearia Top
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#666" }}>
                    O estilo que você procura, no horário que você precisa.
                </p>
            </div>

            {/* Área de Ação */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                
                {!authenticated ? (
                    // VISÃO PARA VISITANTE (Não logado)
                    <>
                        <div style={styles.card}>
                            <h3>Sou Cliente</h3>
                            <p>Quer agendar um corte?</p>
                            <Link to="/login">
                                <button style={styles.btnPrimary}>Agendar Agora</button>
                            </Link>
                            <br />
                            <small>
                                Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                            </small>
                        </div>

                        <div style={styles.card}>
                            <h3>Sou Barbeiro</h3>
                            <p>Gerencie sua agenda</p>
                            <Link to="/login">
                                <button style={styles.btnSecondary}>Acesso Profissional</button>
                            </Link>
                            <small>
                                Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                            </small>
                        </div>
                    </>
                ) : (
                    // VISÃO PARA LOGADO (Direciona para a área certa)
                    <div style={{ ...styles.card, maxWidth: "500px", width: "100%" }}>
                        <h3>Olá, {usuario?.nome || "Visitante"}! 👋</h3>
                        <p>Você já está conectado.</p>
                        
                        {usuario?.role === "CLIENTE" ? (
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
                                <Link to="/agendar">
                                    <button style={styles.btnPrimary}>✂️ Agendar Novo Corte</button>
                                </Link>
                                <Link to="/meus-agendamentos">
                                    <button style={styles.btnOutline}>📅 Meus Agendamentos</button>
                                </Link>
                            </div>
                        ) : (
                            <div style={{ marginTop: "20px" }}>
                                <Link to="/dashboard">
                                    <button style={styles.btnPrimary}>📊 Acessar Painel do Barbeiro</button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer simples */}
            <footer style={{ marginTop: "80px", color: "#999", fontSize: "0.9rem" }}>
                &copy; 2025 Barbearia Top - Sistema de Agendamento
            </footer>
        </div>
    );
}

// Estilos simples em objeto (CSS-in-JS básico)
const styles = {
    card: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "30px",
        width: "300px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        backgroundColor: "white"
    },
    btnPrimary: {
        padding: "12px 24px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        width: "100%",
        marginBottom: "10px"
    },
    btnSecondary: {
        padding: "12px 24px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        width: "100%"
    },
    btnOutline: {
        padding: "12px 24px",
        backgroundColor: "transparent",
        color: "#007bff",
        border: "1px solid #007bff",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        width: "100%",
        marginBottom: "10px"
    }
};

export default Home;