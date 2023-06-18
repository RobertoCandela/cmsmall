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
import { CssBaseline } from "@mui/material";
import { NewPage } from "./pages/new-page/NewPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#27374D",
      contrastText: "#CFE0F2"
    },
    secondary: {
      main: "#D8D8D8",
      contrastText: "#1A2433"
    },
    background : {
      default : "#E8ECF0"
    },
    error:{
      main: "#AE0021"
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/modifyPage/:id" element={<ModifyPage/>} />
            <Route path="/page/:id" element={<Page/>} />
            <Route path="/page/new" element = {<NewPage/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path = "*" element={<NoMatch/>}></Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
