import { useState, useEffect } from "react";
import api from "../services/api";
import { getUsuarioDoToken } from "../utils/authUtils"; 

function MeusServicos() {
    const [servicos, setServicos] = useState([]);
    const [novoServico, setNovoServico] = useState({
        nomeServico: "",
        duracaoMinutos: 30,
        preco: 0
    });

    // Pega o usuário apenas uma vez por render, mas o objeto recriado causava o loop
    const usuario = getUsuarioDoToken(); 

    useEffect(() => {
        if (usuario?.id) {
            carregarServicos();
        }
    }, [usuario?.id]); 

    const carregarServicos = async () => {
        try {
            console.log("Buscando serviços para o ID:", usuario.id); // Debug
            const response = await api.get(`/barbeiros/${usuario.id}/servicos`);
            setServicos(response.data);
        } catch (error) {
            console.error("Erro ao listar serviços", error);
        }
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        
        // Validação extra antes de enviar
        if (!novoServico.preco || novoServico.preco <= 0) {
            alert("Por favor, insira um preço válido maior que zero.");
            return;
        }

        try {
            await api.post(`/barbeiros/${usuario.id}/servicos`, novoServico);
            alert("Serviço cadastrado!");
            setNovoServico({ nomeServico: "", duracaoMinutos: 30, preco: 0 }); // Reseta
            carregarServicos();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar serviço. Verifique se todos os campos estão preenchidos.");
        }
    };

    const handleDeletar = async (idServico) => {
        if(!confirm("Tem certeza que deseja excluir?")) return;
        try {
            await api.delete(`/barbeiros/${usuario.id}/servicos/${idServico}`);
            carregarServicos();
        } catch (error) {
            alert("Erro ao deletar");
        }
    }

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px", background: "#fff" }}>
            <h3>✂️ Meus Serviços</h3>
            
            <form onSubmit={handleSalvar} style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <input 
                    placeholder="Nome (ex: Corte Degradê)" 
                    value={novoServico.nomeServico}
                    onChange={e => setNovoServico({...novoServico, nomeServico: e.target.value})}
                    required
                    style={{ padding: "8px", flex: 1 }}
                />
                <input 
                    type="number" placeholder="Minutos" 
                    value={novoServico.duracaoMinutos}
                    onChange={e => setNovoServico({...novoServico, duracaoMinutos: parseInt(e.target.value)})}
                    required
                    style={{ padding: "8px", width: "80px" }}
                />
                <input 
                    type="number" 
                    placeholder="Preço" 
                    value={novoServico.preco}
                    onChange={e => {
                        const valor = e.target.value;
                        // Se estiver vazio, define como string vazia (para permitir apagar). 
                        // Se tiver numero, converte.
                        setNovoServico({
                            ...novoServico, 
                            preco: valor === "" ? "" : parseFloat(valor)
                        })
                    }}
                    required
                    style={{ padding: "8px", width: "80px" }}
                />
                <button type="submit" style={{ background: "#28a745", color: "white", border: "none", padding: "8px 15px", cursor: "pointer" }}>
                    + Adicionar
                </button>
            </form>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {servicos.map(s => (
                    <li key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
                        <span>
                            <strong>{s.nomeServico}</strong> - {s.duracaoMinutos} min - R$ {s.preco}
                        </span>
                        <button onClick={() => handleDeletar(s.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MeusServicos;