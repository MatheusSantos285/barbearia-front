import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    // O BrowserRouter deve envolver toda a aplicação para as rotas funcionarem
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;