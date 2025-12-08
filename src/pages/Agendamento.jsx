import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUsuarioDoToken } from "../utils/authUtils";

function Agendamento() {
    const [barbeiros, setBarbeiros] = useState([]);
    const [barbeiroSelecionado, setBarbeiroSelecionado] = useState("");
    
    const [servicos, setServicos] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState("");

    const [dataSelecionada, setDataSelecionada] = useState("");
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [horarioSelecionado, setHorarioSelecionado] = useState("");

    const [erro, setErro] = useState(null);
    const [aviso, setAviso] = useState(null);
    
    const navigate = useNavigate();
    const usuario = getUsuarioDoToken(); // <--- Pega o usuário logado

    // Validação de Segurança ao abrir a tela
    useEffect(() => {
        if (!usuario) {
            alert("Você precisa estar logado para agendar.");
            navigate("/login");
        } else if (usuario.role !== "CLIENTE") {
            alert("Apenas clientes podem fazer agendamentos.");
            navigate("/dashboard"); // Se for barbeiro, chuta pro dashboard
        }
    }, [usuario, navigate]);

    // 1. Carrega Barbeiros (Assume que existe GET /barbeiros público)
    useEffect(() => {
        api.get("/barbeiros")
            .then((res) => setBarbeiros(res.data))
            .catch(() => setErro("Erro ao carregar lista de barbeiros."));
    }, []);

    // 2. Carrega Serviços quando seleciona Barbeiro
    useEffect(() => {
        setServicos([]);
        setServicoSelecionado("");
        
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
            // Verifica se a data é hoje ou futuro
            const hoje = new Date().toISOString().split('T')[0];
            if(dataSelecionada < hoje) {
                setAviso("Selecione uma data futura.");
                return;
            }

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
                    setAviso("Agenda cheia ou barbeiro não trabalha neste dia.");
                }
            })
            .catch((error) => {
                console.error(error);
                setAviso("Não foi possível carregar os horários.");
            });
        }
    }, [dataSelecionada, servicoSelecionado, barbeiroSelecionado]);

    // --- ENVIAR AGENDAMENTO ---
    const handleAgendar = () => {
        if (!usuario?.id) {
            alert("Erro de autenticação. Faça login novamente.");
            return;
        }

        // --- CORREÇÃO AQUI ---
        // Verifica se o horário já tem segundos (ex: "13:30:00" tem 8 caracteres)
        // Se tiver apenas "13:30" (5 caracteres), nós adicionamos ":00"
        let horaFormatada = horarioSelecionado;
        
        if (horaFormatada.length === 5) {
            horaFormatada = horaFormatada + ":00";
        }
        
        // Monta a string final no padrão ISO 8601 estrito
        const dataHoraInicio = `${dataSelecionada}T${horaFormatada}`;
        // ---------------------

        const payload = {
            barbeiroId: Number(barbeiroSelecionado),
            clienteId: Number(usuario.id),
            servicoId: Number(servicoSelecionado),
            dataHoraInicio: dataHoraInicio
        };

        console.log("Payload Enviado:", payload); // Para conferir no console

        api.post("/agendamentos", payload)
            .then(() => {
                alert("✅ Agendamento realizado com sucesso!");
                navigate("/meus-agendamentos"); 
            })
            .catch((error) => {
                console.error("Erro completo:", error);
                let msg = "Erro desconhecido.";
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        msg = error.response.data.message || JSON.stringify(error.response.data);
                    } else {
                        msg = error.response.data;
                    }
                }
                alert("❌ Erro ao agendar: " + msg);
            });
    };

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "30px" }}>
                <h1 style={{ color: "#274a70", margin: 0 }}>📅 Novo Agendamento</h1>
                <Link to="/meus-agendamentos" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                    Ver meus horários &rarr;
                </Link>
            </div>

            {erro && <div style={styles.errorAlert}>{erro}</div>}

            {/* Container Principal */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* PASSO 1: BARBEIRO */}
                <div style={styles.card}>
                    <div style={styles.stepBadge}>1</div>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label}>Escolha o Profissional</label>
                        <select style={styles.input} value={barbeiroSelecionado} onChange={(e) => setBarbeiroSelecionado(e.target.value)}>
                            <option value="">Selecione um barbeiro...</option>
                            {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                        </select>
                    </div>
                </div>

                {/* PASSO 2: SERVIÇO */}
                {barbeiroSelecionado && (
                    <div style={styles.card}>
                        <div style={styles.stepBadge}>2</div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Escolha o Serviço</label>
                            <select style={styles.input} value={servicoSelecionado} onChange={(e) => setServicoSelecionado(e.target.value)}>
                                <option value="">Selecione o serviço...</option>
                                {servicos.map(s => <option key={s.id} value={s.id}>{s.nomeServico} - R$ {s.preco}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* PASSO 3: DATA */}
                {servicoSelecionado && (
                    <div style={styles.card}>
                        <div style={styles.stepBadge}>3</div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Escolha a Data</label>
                            <input type="date" style={styles.input} value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
                        </div>
                    </div>
                )}

                {/* PASSO 4: HORÁRIO */}
                {dataSelecionada && (
                    <div style={styles.card}>
                        <div style={styles.stepBadge}>4</div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Horários Disponíveis</label>
                            {aviso && <p style={{ color: "#d9534f", fontWeight: "bold", marginTop: 5 }}>⚠️ {aviso}</p>}
                            
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px", marginTop: "15px" }}>
                                {horariosDisponiveis.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setHorarioSelecionado(item.horario)}
                                        style={{
                                            ...styles.timeButton,
                                            backgroundColor: horarioSelecionado === item.horario ? "#274a70" : "#f0f2f5",
                                            color: horarioSelecionado === item.horario ? "white" : "#333",
                                            border: horarioSelecionado === item.horario ? "2px solid #274a70" : "1px solid #ddd",
                                        }}
                                    >
                                        {item.horario}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* PASSO 5: CONFIRMAÇÃO */}
                {horarioSelecionado && (
                    <div style={{ marginTop: 20 }}>
                        <button onClick={handleAgendar} style={styles.confirmButton}>
                            ✅ Confirmar Agendamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid #eef0f2",
        display: "flex",
        gap: "15px",
        alignItems: "flex-start"
    },
    stepBadge: {
        backgroundColor: "#274a70",
        color: "white",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "14px",
        flexShrink: 0
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#484a4d"
    },
    input: {
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ced4da",
        outline: "none",
        backgroundColor: "#fcfcfc"
    },
    timeButton: {
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.2s"
    },
    confirmButton: {
        width: "100%",
        padding: "18px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(40, 167, 69, 0.2)",
        transition: "background 0.2s"
    },
    errorAlert: {
        color: "white",
        background: "#dc3545",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px"
    }
};

export default Agendamento;