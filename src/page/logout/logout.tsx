import { useToast } from "@chakra-ui/react";
import * as React from "react";
import { Navigate } from "react-router-dom";
import authService from "../../services/auth.service";

const Logout = () => {
  const toast = useToast();
  React.useEffect(() => {
    authService.signOut();
    toast({
      title: "Déconnexion",
      description: "Correctement réaliser",
      status: "success",
    });
  }, [toast]);
  return <Navigate to={"/connexion"} />;
};

export default Logout;