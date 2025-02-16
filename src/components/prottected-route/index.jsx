import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firbase.config';
import Loading from "../loading";

const RequireAuth = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);  
      } else {
        setCurrentUser(null);
        navigate("/");  
      }
    });

    return () => unsubscribe(); 
  }, [navigate]);

  if (currentUser === null) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loading/>
    </div>; 
  }

  return children;  
};
export default RequireAuth