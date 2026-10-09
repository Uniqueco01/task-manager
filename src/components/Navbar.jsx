import { NavLink, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const linkStyle = ({ isActive }) =>
  isActive
    ? "bg-white text-blue-600 rounded-full text-lg font-bold p-2"
    : "bg-blue-600 rounded-full text-lg font-bold p-2";

function Navbar() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-end gap-5 bg-slate-600 px-6 py-3">
      <NavLink to="/" end className={linkStyle}>Home</NavLink>

      {user ? (
        <>
          <NavLink to="/task" className={linkStyle}>Task</NavLink>
          <span className="text-white">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-full bg-red-600 p-2 text-lg font-bold text-white"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/signup" className={linkStyle}>Signup</NavLink>
          <NavLink to="/login" className={linkStyle}>Login</NavLink>
        </>
      )}
    </nav>
  );
}

export default Navbar;