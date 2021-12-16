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
import { AuthContext } from "./context/authContext";
import { AuthProvider } from "./context/authProvider";
import Home from "./home/home";
import Login from "./login/login";
import ResetPassword from "./login/resetPassword";
import SimpleSidebar from "./menu/sidebar";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import Timesheet from "./timesheet/timesheet";

const PrivateRoute = () => {
  const user = React.useContext(AuthContext);
  return user ? <Outlet /> : <Navigate to="/connexion" />;
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
                <Route path="/reinitialiser" element={<ResetPassword />} />
                <Route path="/" element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                </Route>
                <Route path="/saisie" element={<PrivateRoute />}>
                  <Route path="/saisie" element={<Timesheet />} />
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
