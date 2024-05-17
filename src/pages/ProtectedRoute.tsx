import { Navigate } from "react-router-dom";
import { User } from "../types/types";

interface ProtectedRouteProps {
  notLoggedIn?: boolean;
  user: User | null;
  children: any;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  children,
  notLoggedIn = false,
}) => {
  if (notLoggedIn && user) {
    return <Navigate to="/" replace />;
  } else if (!notLoggedIn && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
