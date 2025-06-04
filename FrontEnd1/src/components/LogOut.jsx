import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("auth");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow transition duration-200"
      >
        Logout
      </button>
    </div>
  );
}


export default LogoutButton;