import { useEffect, useState } from "react";
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
import {
  getCurrentSession,
  login,
  logout,
  signup,
} from "./service/auth-service";

const theme = createTheme({
  palette: {
    primary: {
      main: "#27374D",
      contrastText: "#CFE0F2",
    },
    secondary: {
      main: "#D8D8D8",
      contrastText: "#1A2433",
    },
    background: {
      default: "#E8ECF0",
    },
    error: {
      main: "#AE0021",
    },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  const init = async () => {
    try {
      const user = await getCurrentSession();

      if (user) {
        setUser(user);
        setLoggedIn(true);
      }
    } catch (err) {
      setUser(undefined);
      setLoggedIn(false);
      console.log(err);
    }
  };
  useEffect(() => {
    init();
  }, []);

  const handleLogin = async (userCredentials) => {
    try {
      const user = await login(userCredentials);
      if (user) {
        setUser(user);
        setLoggedIn(true);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setUser(undefined);
  };

  const handleSignup = async (user) => {
    try {
      const newUser = await signup(user);
      if(newUser){
        handleLogin({username:newUser.username,password:newUser.password})
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout isLogged={loggedIn} user={user} logout={handleLogout} />
            }
          >
            <Route index element={<Home />} />
            <Route path="/login" element={<Login login={handleLogin} />} />
            <Route path="/signup" element={<Signup signup={handleSignup} />} />
            <Route path="/modifyPage/:id" element={<ModifyPage />} />
            <Route path="/page/:id" element={<Page />} />
            <Route path="/page/new" element={<NewPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NoMatch />}></Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
