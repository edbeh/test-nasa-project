import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    window.location.href = "https://localhost:3001/auth/google";
  }, []);

  return null;
};

export default Login;
