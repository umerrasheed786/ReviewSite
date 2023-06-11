import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  postHttpRequest
} from "../../../axios/index";

const ProtectedRoute = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("accessToken"); // Get the accessToken from localStorage

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        try {
          const response = await postHttpRequest("v1/admin/auth/verify-token", { token });
          if (response?.success) {
            setIsTokenValid(true);
          } else {
            setIsTokenValid(false);
            localStorage.removeItem("accessToken");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          setIsTokenValid(false);
          localStorage.removeItem("accessToken");
        }
      } else {
        setIsTokenValid(false);
      }
      setIsLoading(false);
    };

    checkTokenValidity();
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator while checking the token validity
  }

  if (!isTokenValid) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
