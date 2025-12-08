import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Cadastro() {
    const navigate = useNavigate();
    
    // Estado para os campos do formulário
    const [tipo, setTipo] = useState("cliente"); // 'cliente' ou 'barbeiro'
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Define a rota baseada na escolha
        // ATENÇÃO: Verifique se suas rotas no Backend são essas mesmo (/clientes ou /barbeiros)
        const rota = tipo === "cliente" ? "/clientes" : "/barbeiros";

        try {
            await api.post(rota, formData);
            alert("Cadastro realizado com sucesso! Faça login para entrar.");
            navigate("/login");
        } catch (error) {
            console.error("Erro no cadastro", error);
            // Tratamento simples de erro
            const msg = error.response?.data?.message || "Erro ao cadastrar. Verifique os dados.";
            alert("Erro: " + msg);
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
            <h2 style={{ textAlign: "center", color: "#274a70", marginBottom: "30px" }}>📝 Crie sua conta</h2>
            
            <form onSubmit={handleSubmit}>
                
                {/* Escolha do Tipo de Conta */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontWeight: "500" }}>Quero ser:</label>
                    <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="cliente" 
                                checked={tipo === "cliente"} 
                                onChange={(e) => setTipo(e.target.value)}
                            /> Cliente
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="tipo" 
                                value="barbeiro" 
                                checked={tipo === "barbeiro"} 
                                onChange={(e) => setTipo(e.target.value)} 
                            /> Barbeiro
                        </label>
                    </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontWeight: "500" }}>Nome Completo:</label>
                    <input 
                        type="text" name="nome" required
                        value={formData.nome} onChange={handleChange}
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
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontWeight: "500" }}>Telefone:</label>
                    <input 
                        type="text" name="telefone" required
                        placeholder="(XX) 9XXXX-XXXX"
                        value={formData.telefone} onChange={handleChange}
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
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontWeight: "500" }}>E-mail:</label>
                    <input 
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
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
                        type="password" name="senha" required
                        value={formData.senha} onChange={handleChange}
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
                    Cadastrar
                </button>
            </form>

            <p style={{ marginTop: "20px", textAlign: "center" }}>
                Já tem conta? <Link to="/login">Faça Login</Link>
            </p>
        </div>
    );
}

export default Cadastro;