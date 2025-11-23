import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Agendamento from "../pages/Agendamento";
import Dashboard from "../pages/Dashboard";

function AppRoutes() {
    return (
        <Routes>
            {/* Rota Raiz */}
            <Route path="/" element={<Home />} />
            
            {/* Rota de Agendamento */}
            <Route path="/agendar" element={<Agendamento />} />

            {/* Rota do Dashboard do Barbeiro */}
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default AppRoutes;