import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>💈 Barbearia </h1>
            <p>O melhor estilo para você.</p>
            <br />
            {/* O Link funciona como um <a> do HTML, mas sem recarregar a página */}
            <Link to="/agendar">
            <button style={{ padding: "15px 30px", fontSize: "18px", cursor: "pointer", marginRight: "10px" }}>
                📅 Agendar Horário (Cliente)
            </button>
            </Link>

            <Link to="/dashboard">
                <button style={{ padding: "15px 30px", fontSize: "18px", cursor: "pointer", backgroundColor: "#333", color: "white" }}>
                    ✂️ Área do Barbeiro
                </button>
            </Link>
        </div>
    );
}

export default Home;