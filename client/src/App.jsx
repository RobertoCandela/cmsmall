import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import ModifyPage from "./pages/modify-page/modify-page";
import Page from "./pages/page/page";
import Settings from "./pages/settings/settings";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NoMatch from "./pages/nomatch/nomatch";
import { CssBaseline, IconButton } from "@mui/material";
import { NewPage } from "./pages/new-page/NewPage";
import {
  getCurrentSession,
  login,
  logout,
  signup,
} from "./service/auth-service";
import { SnackbarProvider, useSnackbar } from "notistack";
import UserContext from "./userContext";

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
function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <CloseRoundedIcon />
    </IconButton>
  );
}
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
      console.log("newUser value");
      console.log(newUser);
      if (newUser) {
        setUser(user);
        setLoggedIn(true);

        handleLogin({ username: newUser.username, password: newUser.password });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={(snackbarKey) => (
          <SnackbarCloseButton snackbarKey={snackbarKey} />
        )}
      >
        <UserContext.Provider value={user}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout isLogged={loggedIn} logout={handleLogout} />
              }
            >
              <Route index element={<Home loggedIn={loggedIn} />} />
              <Route
                path="/login"
                element={
                  !loggedIn ? (
                    <Login login={handleLogin} />
                  ) : (
                    <Navigate replace to="/" />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  !loggedIn ? (
                    <Signup signup={handleSignup} />
                  ) : (
                    <Navigate replace to="/" />
                  )
                }
              />
              <Route
                path="/modifyPage/:id"
                element={
                  loggedIn ? <ModifyPage /> : <Navigate replace to="/login" />
                }
              />
              <Route path="/page/:id" element={<Page />} />
              <Route
                path="/page/new"
                element={
                  loggedIn ? <NewPage /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/settings"
                element={
                  loggedIn && user.isAdmin ? (
                    <Settings />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route path="*" element={<NoMatch />}></Route>
            </Route>
          </Routes>
        </Router>
        </UserContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
