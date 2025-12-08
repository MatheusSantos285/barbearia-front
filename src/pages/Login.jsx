import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState("cliente"); // 'cliente' ou 'barbeiro'
    
    const { login } = useContext(AuthContext); // Pegamos a função login do contexto
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const sucesso = await login(email, senha, tipo);
        
        if (sucesso) {
            //alert("Logado com sucesso!");
            if (tipo === "cliente") {
                navigate("/agendar"); // Cliente vai para agendamento
            } else {
                navigate("/dashboard"); // Barbeiro vai para dashboard
            }
        } else {
            alert("Email ou senha inválidos!");
        }
    };

    return (
            <div style={{ 
                maxWidth: "450px", 
                margin: "80px auto", 
                padding: "40px", 
                backgroundColor: "white", 
                borderRadius: "16px", 
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)", 
                fontFamily: "'Segoe UI', sans-serif",
                border: "1px solid #f0f0f0"
            }}>            
            <h2 style={{ textAlign: "center", color: "#274a70", marginBottom: "30px" }}>
                🔐 Acesso ao Sistema
            </h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontWeight: "500" }}>Sou:</label>
                    <select 
                        value={tipo} 
                        onChange={e => setTipo(e.target.value)}
                        style={{ 
                            width: "100%", 
                            padding: "12px", 
                            borderRadius: "8px", 
                            border: "1px solid #ddd", 
                            fontSize: "16px",
                            backgroundColor: "#fafafa" 
                        }}
                    >
                        <option value="cliente">Cliente</option>
                        <option value="barbeiro">Barbeiro</option>
                    </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontWeight: "500" }}>E-mail:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ 
                            width: "100%", 
                            padding: "12px", 
                            borderRadius: "8px", 
                            border: "1px solid #ddd", 
                            fontSize: "16px",
                            backgroundColor: "#fafafa" 
                        }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontWeight: "500" }}>Senha:</label>
                    <input 
                        type="password" 
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                        style={{ 
                            width: "100%", 
                            padding: "12px", 
                            borderRadius: "8px", 
                            border: "1px solid #ddd", 
                            fontSize: "16px",
                            backgroundColor: "#fafafa" 
                        }}
                    />
                </div>

                <button type="submit" style={{ 
                    width: "100%", 
                    padding: "14px", 
                    backgroundColor: "#274a70", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    fontSize: "16px", 
                    fontWeight: "bold",
                    marginTop: "10px"
                }}>
                    Entrar
                </button>
            </form>

            <div style={{ marginTop: "25px", textAlign: "center", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                <p style={{ color: "#666" }}>Não tem conta? <Link to="/cadastro" style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}>Cadastre-se</Link></p>
                <Link to="/" style={{ display: "block", marginTop: "10px", color: "#999", textDecoration: "none", fontSize: "14px" }}>Voltar para Home</Link>
            </div>
        </div>
    );
}

export default Login;