import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Navbar() {
    const { authenticated, logout } = useContext(AuthContext);

    return (
        <nav style={{
            padding: "15px 30px",
            borderBottom: "2px solid #274a70ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
            <Link to="/" style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#484a4dff",
                textDecoration: "none"
            }}>💈 Barbearia Top</Link>
            
            <div>
                {authenticated ? (
                    <button onClick={logout} style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}>
                        Sair
                    </button>
                ) : (
                    <Link to="/login" style={{
                        color: "#175eaaff",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}>Login</Link>
                )}
            </div>
        </nav>
    );
}
export default Navbar;