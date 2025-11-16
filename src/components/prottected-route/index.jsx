import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../loading";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loading />
    </div>;
  }

  return children;
};

export default RequireAuth;