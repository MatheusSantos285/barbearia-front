import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Dashboard() {
    const [barbeiroId, setBarbeiroId] = useState("");
    const [agendamentos, setAgendamentos] = useState([]);
    const [buscou, setBuscou] = useState(false);

    const carregarAgenda = () => {
        if (!barbeiroId) return;

        api.get(`/agendamentos/barbeiro/${barbeiroId}`)
            .then((response) => {
                setAgendamentos(response.data);
                setBuscou(true);
            })
            .catch((error) => {
                console.error("Erro", error);
                alert("Erro ao buscar agenda.");
            });
    };

    // Função para formatar a data bonitinha (Ex: 25/12/2025 às 14:00)
    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString('pt-BR');
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
            <h1>✂️ Painel do Barbeiro</h1>
            
            <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <label>Digite seu ID de Barbeiro para ver a agenda:</label>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <input 
                        type="number" 
                        value={barbeiroId}
                        onChange={(e) => setBarbeiroId(e.target.value)}
                        placeholder="Ex: 1"
                        style={{ padding: "10px", flex: 1 }}
                    />
                    <button onClick={carregarAgenda} style={{ padding: "10px 20px", cursor: "pointer" }}>
                        Buscar Agenda
                    </button>
                </div>
            </div>

            {buscou && (
                <div>
                    <h2>Seus Agendamentos ({agendamentos.length})</h2>
                    
                    {agendamentos.length === 0 ? (
                        <p>Nenhum agendamento encontrado.</p>
                    ) : (
                        <div style={{ display: "grid", gap: "15px" }}>
                            {agendamentos.map((ag) => (
                                <div key={ag.id} style={{ 
                                    padding: "15px", 
                                    borderLeft: "5px solid #4CAF50", 
                                    backgroundColor: "#f9f9f9",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                }}>
                                    <strong>Cliente:</strong> {ag.clienteNome} <br />
                                    <strong>Serviço:</strong> {ag.servicoNome} ({ag.servicoPreco}) <br />
                                    <strong>Horário:</strong> {formatarData(ag.dataHoraInicio)} <br />
                                    <small>Status: {ag.status}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Link to="/">
                <button style={{ marginTop: "30px", padding: "10px" }}>⬅ Voltar para Home</button>
            </Link>
        </div>
    );
}

export default Dashboard;