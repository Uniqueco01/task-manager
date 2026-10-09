import { NavLink, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const linkStyle = ({ isActive }) =>
  isActive
    ? "bg-white text-blue-600 rounded-full text-sm sm:text-lg font-bold px-3 py-1.5 sm:p-2"
    : "bg-blue-600 rounded-full text-sm sm:text-lg font-bold px-3 py-1.5 sm:p-2";

function Navbar() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 bg-slate-600 px-3 py-3 sm:px-6">
      {/* Left end: greeting */}
      <div className="max-w-[40%] truncate text-sm text-white sm:text-base">
        {user && <span>Hi, {user.name}</span>}
      </div>

      {/* Right end: links */}
      <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-5">
        <NavLink to="/" end className={linkStyle}>Home</NavLink>

        {user ? (
          <>
            <NavLink to="/task" className={linkStyle}>Task</NavLink>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-3 py-1.5 text-sm font-bold text-white sm:p-2 sm:text-lg"
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
      </div>
    </nav>
  );
}

export default Navbar;