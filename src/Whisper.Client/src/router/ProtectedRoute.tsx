import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthTokenFromDB } from "../api/db";
import { isTokenExpired } from "../helpers/authHelper";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const token = await getAuthTokenFromDB();
      const isValid = token !== null && !isTokenExpired(token);
      setIsAuth(isValid);
    };
    verify();
  }, [location.pathname]);

  if (isAuth === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;