import { Navigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

function ProtectedRoute({ children }) {
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;