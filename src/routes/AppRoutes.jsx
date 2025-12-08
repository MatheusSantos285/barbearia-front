import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Agendamento from "../pages/Agendamento";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import { PrivateRoute } from "../routes/PrivateRoute";
import MeusAgendamentos from "../pages/MeusAgendamentos";
import Cadastro from "../pages/Cadastro"; 

function AppRoutes() {
    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* Rotas de Cliente (Só quem logou e é 'cliente' entra) */}
            <Route path="/agendar" element={
                <PrivateRoute roleRequired="cliente">
                    <Agendamento />
                </PrivateRoute>
            } />

            {/* Rotas de Barbeiro (Só quem logou e é 'barbeiro' entra) */}
            <Route path="/dashboard" element={
                <PrivateRoute roleRequired="barbeiro">
                    <Dashboard />
                </PrivateRoute>
            } />

            {/* Rota Protegida para Clientes */}
            <Route path="/meus-agendamentos" element={
                <PrivateRoute roleRequired="cliente">
                    <MeusAgendamentos />
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default AppRoutes;