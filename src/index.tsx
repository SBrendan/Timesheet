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
import Home from "./page/home/home";
import Login from "./page/login/login";
import ResetPassword from "./page/login/resetPassword";
import Logout from "./page/logout/logout";
import SimpleSidebar from "./page/menu/sidebar";
import Admin from "./page/profil/admin";
import Timesheet from "./page/timesheet/timesheet";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
