import { useNavigate } from "react-router-dom";
import { useAuth } from "./TokenContext";
import Button from "@mui/material/Button";
import "./Logout.css"

export default function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout(); 
        navigate("/"); 
      };

  return (
    <div className="logout">
      <Button size="large" variant="contained" onClick={handleLogout}>Выйти</Button>
    </div>
  );
}
