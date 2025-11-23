import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importamos useNavigate para redirecionar
import api from "../services/api";

function Agendamento() {
    // --- ESTADOS ---
    const [barbeiros, setBarbeiros] = useState([]);
    const [barbeiroSelecionado, setBarbeiroSelecionado] = useState("");
    
    const [servicos, setServicos] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState("");

    const [dataSelecionada, setDataSelecionada] = useState("");
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [horarioSelecionado, setHorarioSelecionado] = useState("");

    // ESTADO PROVISÓRIO PARA CLIENTE (Até termos login)
    const [clienteId, setClienteId] = useState("");

    const [erro, setErro] = useState(null);
    const [aviso, setAviso] = useState(null);
    const [sucesso, setSucesso] = useState(false);

    const navigate = useNavigate(); // Hook para navegar programaticamente

    // 1. Carrega Barbeiros
    useEffect(() => {
        api.get("/barbeiros")
            .then((res) => setBarbeiros(res.data))
            .catch(() => setErro("Erro ao carregar barbeiros."));
    }, []);

    // 2. Carrega Serviços
    useEffect(() => {
        setServicos([]);
        setServicoSelecionado("");
        // Não limpamos a data propositalmente para facilitar trocas
        
        if (barbeiroSelecionado) {
            api.get(`/barbeiros/${barbeiroSelecionado}/servicos`)
                .then((res) => setServicos(res.data))
                .catch((err) => console.error(err));
        }
    }, [barbeiroSelecionado]);

    // 3. Busca disponibilidade
    useEffect(() => {
        setHorariosDisponiveis([]);
        setHorarioSelecionado("");
        setAviso(null);

        if (barbeiroSelecionado && servicoSelecionado && dataSelecionada) {
            api.get("/agendamentos/disponibilidade", {
                params: {
                    barbeiroId: barbeiroSelecionado,
                    servicoId: servicoSelecionado,
                    data: dataSelecionada
                }
            })
            .then((response) => {
                setHorariosDisponiveis(response.data);
                if (response.data.length === 0) {
                    setAviso("Nenhum horário disponível para esta data.");
                }
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setAviso(error.response.data);
                } else {
                    setAviso("Erro ao verificar horários.");
                }
            });
        }
    }, [dataSelecionada, servicoSelecionado, barbeiroSelecionado]);

    // --- FUNÇÃO FINAL: ENVIAR AGENDAMENTO ---
    const handleAgendar = () => {
        if (!clienteId) {
            alert("Por favor, digite o ID do cliente.");
            return;
        }

        // Monta a data no formato ISO: "2025-10-20T14:30:00"
        const dataHoraInicio = `${dataSelecionada}T${horarioSelecionado}`;

        const payload = {
            barbeiroId: Number(barbeiroSelecionado),
            clienteId: Number(clienteId),
            servicoId: Number(servicoSelecionado),
            dataHoraInicio: dataHoraInicio
        };

        api.post("/agendamentos", payload)
            .then(() => {
                setSucesso(true);
                alert("✅ Agendamento realizado com sucesso!");
                navigate("/"); // Volta para a home
            })
            .catch((error) => {
                console.error("Erro ao agendar", error);
                // Tenta pegar a mensagem de erro da nossa RegraDeNegocioException
                const mensagem = error.response?.data || "Erro desconhecido ao agendar.";
                alert("❌ Erro: " + mensagem);
            });
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
            <h1>📅 Agendar Horário</h1>
            
            {erro && <div style={{ color: "white", background: "red", padding: "10px" }}>{erro}</div>}

            {/* PASSO 1: BARBEIRO */}
            <div style={styles.card}>
                <h3>1. Profissional</h3>
                <select style={styles.input} value={barbeiroSelecionado} onChange={(e) => setBarbeiroSelecionado(e.target.value)}>
                    <option value="">Selecione...</option>
                    {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                </select>
            </div>

            {/* PASSO 2: SERVIÇO */}
            {barbeiroSelecionado && (
                <div style={styles.card}>
                    <h3>2. Serviço</h3>
                    <select style={styles.input} value={servicoSelecionado} onChange={(e) => setServicoSelecionado(e.target.value)}>
                        <option value="">Selecione...</option>
                        {servicos.map(s => <option key={s.id} value={s.id}>{s.nomeServico} - R$ {s.preco}</option>)}
                    </select>
                </div>
            )}

            {/* PASSO 3: DATA */}
            {servicoSelecionado && (
                <div style={styles.card}>
                    <h3>3. Data</h3>
                    <input type="date" style={styles.input} value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
                </div>
            )}

            {/* PASSO 4: HORÁRIO */}
            {dataSelecionada && (
                <div style={styles.card}>
                    <h3>4. Horário</h3>
                    {aviso && <p style={{ color: "orange" }}>⚠️ {aviso}</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {horariosDisponiveis.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setHorarioSelecionado(item.horario)}
                                style={{
                                    padding: "10px",
                                    backgroundColor: horarioSelecionado === item.horario ? "#4CAF50" : "#f0f0f0",
                                    color: horarioSelecionado === item.horario ? "white" : "black",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                {item.horario}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* PASSO 5: IDENTIFICAÇÃO DO CLIENTE (Provisório) */}
            {horarioSelecionado && (
                <div style={{ ...styles.card, border: "2px solid #4CAF50" }}>
                    <h3>5. Seus Dados</h3>
                    <p>Digite seu ID de cliente (Use "1" para teste):</p>
                    <input 
                        type="number" 
                        placeholder="Ex: 1"
                        style={styles.input}
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                    />
                    
                    <button 
                        onClick={handleAgendar}
                        style={{
                            width: "100%",
                            padding: "15px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "18px",
                            marginTop: "15px",
                            cursor: "pointer"
                        }}
                    >
                        ✅ Confirmar Agendamento
                    </button>
                </div>
            )}

            <Link to="/"><button style={{marginTop: 20, padding: 10}}>⬅ Cancelar</button></Link>
        </div>
    );
}

const styles = {
    card: { marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" },
    input: { width: "100%", padding: "10px", fontSize: "16px", boxSizing: "border-box" }
};

export default Agendamento;