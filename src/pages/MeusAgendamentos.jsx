import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { getUsuarioDoToken } from "../utils/authUtils";

function MeusAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const usuario = getUsuarioDoToken();

    useEffect(() => {
        if(usuario?.id) {
            carregar();
        }
    }, [usuario?.id]);

    const carregar = async () => {
        try {
            const response = await api.get(`/agendamentos/cliente/${usuario.id}`);
            setAgendamentos(response.data);
        } catch (error) {
            console.error(error);
            alert("Erro ao buscar seus agendamentos.");
        }
    }

    const cancelarAgendamento = async (id) => {
        if(!confirm("Deseja realmente cancelar este agendamento?")) return;
        try {
            await api.patch(`/agendamentos/${id}/cancelar`);
            alert("Agendamento cancelado!");
            carregar(); // Recarrega a lista
        } catch (error) {
            console.error(error);
            alert("Erro ao cancelar. Verifique se a data já passou.");
        }
    }

    // ... (lógica igual)

return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
            <h1 style={{ color: "#274a70", margin: 0 }}>💇‍♂️ Meus Cortes</h1>
            <Link to="/agendar">
                <button style={{ padding: "12px 24px", background: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,123,255,0.2)" }}>
                    + Novo Agendamento
                </button>
            </Link>
        </div>

        {agendamentos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px", background: "#f8f9fa", borderRadius: "12px" }}>
                <p style={{ color: "#6c757d", fontSize: "18px" }}>Você ainda não tem agendamentos futuros.</p>
            </div>
        ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {agendamentos.map(ag => (
                    <div key={ag.id} style={{ 
                        padding: "20px", 
                        backgroundColor: "white",
                        border: "1px solid #eef0f2", 
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        borderLeft: `5px solid ${ag.status === 'MARCADO' ? '#28a745' : '#ccc'}`
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                            <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>{ag.servicoNome}</h3>
                            <span style={{ 
                                fontSize: "12px", 
                                padding: "4px 8px", 
                                borderRadius: "12px", 
                                fontWeight: "bold",
                                background: ag.status === 'MARCADO' ? '#e8f5e9' : '#f0f0f0',
                                color: ag.status === 'MARCADO' ? '#2e7d32' : '#666'
                            }}>
                                {ag.status}
                            </span>
                        </div>
                        
                        <div style={{ color: "#555", fontSize: "14px", lineHeight: "1.6" }}>
                            <p style={{ margin: 0 }}>👤 <strong>{ag.barbeiroNome}</strong></p>
                            <p style={{ margin: 0 }}>📅 {new Date(ag.dataHoraInicio).toLocaleDateString()}</p>
                            <p style={{ margin: 0 }}>🕒 {new Date(ag.dataHoraInicio).toLocaleTimeString().substring(0,5)}</p>
                            <p style={{ margin: 0, fontWeight: "bold", marginTop: "5px", color: "#274a70" }}>{ag.servicoPreco}</p>
                        </div>

                        {ag.status === 'MARCADO' && (
                            <button 
                                onClick={() => cancelarAgendamento(ag.id)}
                                style={{ 
                                    width: "100%",
                                    marginTop: "20px",
                                    color: "#dc3545", 
                                    background: "transparent", 
                                    border: "1px solid #dc3545", 
                                    padding: "8px", 
                                    borderRadius: "6px", 
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    transition: "all 0.2s"
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}
        <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link to="/" style={{ color: "#666", textDecoration: "none" }}>Voltar para Home</Link>
        </div>
    </div>
);
}

export default MeusAgendamentos;