import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/home";
import Login from "./login/login";
import SimpleSidebar from "./menu/sidebar";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import Timesheet from "./timesheet/timesheet";

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <SimpleSidebar>
          <Box>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/saisie" element={<Timesheet />} />
              <Route path="/connexion" element={<Login />} />
            </Routes>
          </Box>
        </SimpleSidebar>
      </ChakraProvider>
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
