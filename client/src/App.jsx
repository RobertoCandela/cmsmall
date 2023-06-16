import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import ModifyPage from "./pages/modify-page/modify-page";
import Page from "./pages/page/page";
import Settings from "./pages/settings/settings";
import NoMatch from "./pages/nomatch/nomatch";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B8C7FB",
    },
    secondary: {
      main: "#F7DA42",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/modifyPage/:id" element={<ModifyPage/>} />
            <Route path="/page/:id" element={<Page/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path = "*" element={<NoMatch/>}></Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
