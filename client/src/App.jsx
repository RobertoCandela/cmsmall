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
import AppContext from "./appContext";
import { getSettings, updateSetting } from "./service/settings-service";

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
  const [appName,setAppName] = useState("");

  async function getAppName() {
    const settings = await getSettings();
    settings.forEach((s) => {
      if (s.id === "appName") {
        setAppName(s.value);
      }
    });
  }

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
    getAppName();
  }, []);

  const handleAppName = async (appName) => {
    const settingId = "appName";
    updateSetting({ id: settingId, value: appName })
      .then((resp) => {
        setAppName(resp.value);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  const handleLogin = async (userCredentials) => {
    try {
      const user = await login(userCredentials);
      if (user) {
        setUser(user);
        setLoggedIn(true);
      }else{
        console.log("user is not valid")
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
      if (newUser) {
        setUser(newUser);
        setLoggedIn(true);
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
        <AppContext.Provider value={appName}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout isLogged={loggedIn} logout={handleLogout} appName={appName} />
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
                    <Settings handleAppName={handleAppName} />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route path="*" element={<NoMatch />}></Route>
            </Route>
          </Routes>
        </Router>
        </AppContext.Provider>
        </UserContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
