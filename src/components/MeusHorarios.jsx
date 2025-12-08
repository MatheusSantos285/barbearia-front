import { useState, useEffect } from "react";
import api from "../services/api";
import { getUsuarioDoToken } from "../utils/authUtils";

const DIAS_SEMANA = [
    { id: 1, label: "Segunda" }, { id: 2, label: "Terça" }, { id: 3, label: "Quarta" },
    { id: 4, label: "Quinta" }, { id: 5, label: "Sexta" }, { id: 6, label: "Sábado" },
    { id: 0, label: "Domingo" },
];

function MeusHorarios() {
    const usuario = getUsuarioDoToken();
    const [configDias, setConfigDias] = useState([]); 
    const [loading, setLoading] = useState(true);

    // CORREÇÃO: Dependência fixa no ID
    useEffect(() => {
        if(usuario?.id) {
            carregarHorarios();
        }
    }, [usuario?.id]); 

    const carregarHorarios = async () => {
        try {
            const response = await api.get(`/barbeiros/${usuario.id}/horarios-trabalho`);
            const horariosBack = response.data;

            const diasMapeados = DIAS_SEMANA.map(diaBase => {
                const encontrado = horariosBack.find(h => h.diaSemana === diaBase.id);
                return {
                    ...diaBase,
                    ativo: !!encontrado,
                    horaInicio: encontrado ? encontrado.horaInicio.substring(0, 5) : "09:00",
                    horaFim: encontrado ? encontrado.horaFim.substring(0, 5) : "18:00"
                };
            });
            setConfigDias(diasMapeados);
        } catch (error) {
            console.error("Erro ao buscar horarios", error);
            // Se der erro, preenche com padrão desmarcado
            setConfigDias(DIAS_SEMANA.map(d => ({ ...d, ativo: false, horaInicio: "09:00", horaFim: "18:00" })));
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarHorarios = async () => {
        if (!usuario?.id) return alert("Erro de autenticação");

        try {
            const horariosParaEnviar = configDias
                .filter(d => d.ativo)
                .map(d => ({
                    diaSemana: d.id,
                    horaInicio: d.horaInicio + ":00",
                    horaFim: d.horaFim + ":00"
                }));

            await api.put(`/barbeiros/${usuario.id}/horarios-trabalho`, { horarios: horariosParaEnviar });
            alert("Horários atualizados!");
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar horários.");
        }
    };

    const handleCheck = (diaId) => {
        setConfigDias(prev => prev.map(d => d.id === diaId ? { ...d, ativo: !d.ativo } : d));
    };

    const handleChangeHora = (diaId, campo, valor) => {
        setConfigDias(prev => prev.map(d => d.id === diaId ? { ...d, [campo]: valor } : d));
    };

    if (loading) return <p>Carregando horários...</p>;

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
            <h3>⏰ Meus Horários</h3>
            <div style={{ display: "grid", gap: "10px" }}>
                {configDias.map(dia => (
                    <div key={dia.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input type="checkbox" checked={dia.ativo} onChange={() => handleCheck(dia.id)} />
                        <span style={{ width: "80px" }}>{dia.label}</span>
                        {dia.ativo && (
                            <>
                                <input type="time" value={dia.horaInicio} onChange={e => handleChangeHora(dia.id, 'horaInicio', e.target.value)} />
                                <span>até</span>
                                <input type="time" value={dia.horaFim} onChange={e => handleChangeHora(dia.id, 'horaFim', e.target.value)} />
                            </>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={handleSalvarHorarios} style={{ marginTop: "20px", background: "#007bff", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}>
                Salvar Horários
            </button>
        </div>
    );
}
export default MeusHorarios;