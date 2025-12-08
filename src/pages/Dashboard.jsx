import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { getUsuarioDoToken } from "../utils/authUtils"; 
import MeusServicos from "../components/MeusServicos";
import MeusHorarios from "../components/MeusHorarios";

function Dashboard() {
    const [agendamentos, setAgendamentos] = useState([]);
    
    // 1. Pega o usuário
    const usuario = getUsuarioDoToken();

    useEffect(() => {
        if (usuario?.id) {
            carregarAgenda();
        }
    }, [usuario?.id]); // <--- O segredo anti-loop está aqui

    const carregarAgenda = () => {
        api.get(`/agendamentos/barbeiro/${usuario.id}`)
            .then((response) => {
                setAgendamentos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar agenda", error);
            });
    };

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString('pt-BR');
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
            <div>
                <h1 style={{ color: "#274a70", margin: 0 }}>💈Painel do Barbeiro</h1>
                <p style={{ color: "#666", margin: "5px 0 0 0" }}>Bem-vindo, <strong>{usuario?.nome}</strong></p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={carregarAgenda} style={{ padding: "10px 20px", background: "#274a70", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>🔄 Atualizar</button>
                <Link to="/">
                    <button style={{ padding: "10px 20px", background: "#f8f9fa", color: "#333", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" }}>Sair</button>
                </Link>
            </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", alignItems: "start" }}>
        
        {/* Coluna da Esquerda: Configurações (Serviços e Horários) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <MeusServicos /> 
            {/* Dica: Aplique o estilo de "Card" branco dentro do MeusServicos.jsx também */}
            
            <MeusHorarios />
        </div>

        {/* Coluna da Direita: Agenda */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #eef0f2", minHeight: "500px" }}>
            <h2 style={{ color: "#274a70", marginTop: 0, marginBottom: "20px", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px" }}>
                📅 Próximos Agendamentos <span style={{fontSize: "0.6em", background: "#007bff", color: "white", padding: "2px 8px", borderRadius: "10px", verticalAlign: "middle"}}>{agendamentos.length}</span>
            </h2>
            
            {agendamentos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                    <p>Nenhum corte agendado.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {agendamentos.map((ag) => (
                        <div key={ag.id} style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "15px 20px", 
                            backgroundColor: "#fcfcfc",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            borderLeft: `4px solid ${ag.status === 'MARCADO' ? '#28a745' : '#ccc'}`
                        }}>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>{ag.clienteNome}</div>
                                <div style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>✂️ {ag.servicoNome} <span style={{color: "#274a70", fontWeight: "bold"}}>({ag.servicoPreco})</span></div>
                            </div>
                            
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#274a70" }}>
                                    {new Date(ag.dataHoraInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                                <div style={{ fontSize: "12px", color: "#888" }}>
                                    {new Date(ag.dataHoraInicio).toLocaleDateString()}
                                </div>
                                <small style={{ 
                                    display: "inline-block", 
                                    marginTop: "5px",
                                    fontWeight: "bold",
                                    color: ag.status === 'MARCADO' ? '#28a745' : '#999'
                                }}>
                                    {ag.status}
                                </small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}

export default Dashboard;