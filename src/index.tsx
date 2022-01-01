import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/authProvider";
import Admin from "./page/admin/admin";
import Home from "./page/home/home";
import Login from "./page/login/login";
import ResetPassword from "./page/login/resetPassword";
import Logout from "./page/logout/logout";
import SimpleSidebar from "./page/menu/sidebar";
import Profil from "./page/profil/profil";
import Timesheet from "./page/timesheet/timesheet";


const PrivateRoute = () => {
  const { loading, isLoggedIn } = React.useContext(AuthContext);
  return !loading && isLoggedIn ? <Outlet /> : <Navigate to="/connexion" />;
};

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <SimpleSidebar>
            <Box>
              <Routes>
                <Route path="/connexion" element={<Login />} />
                <Route path="/deconnexion" element={<Logout />} />
                <Route path="/reinitialiser" element={<ResetPassword />} />
                <Route path="/" element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/saisie" element={<Timesheet />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/profile" element={<Profil />} />
                </Route>
              </Routes>
            </Box>
          </SimpleSidebar>
        </ChakraProvider>
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);

