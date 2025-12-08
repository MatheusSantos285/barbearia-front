import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar"; // <--- 1. Importe a Navbar

function App() {
  return (
    <div> 
        <Navbar /> {/* <--- 3. Coloque ela aqui, ANTES das rotas */}
        <AppRoutes />
    </div>
  );
}

export default App;