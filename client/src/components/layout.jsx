import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

function Layout() {
  // useState(false) inizializza lo stato della variabile isLogged
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [appName,setAppName] = useState("CMSmall")
  const navigate = useNavigate();

  const theme = useTheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <div onClick={() => navigate("/")} style={{display: "inline-block"}}>
              <Typography variant="h5">
              {appName}
              </Typography>
            </div>
          </div>
          {isLogged ? (
            <>
              <Typography variant="h6">Username</Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} sx={{ color: "#FF2E2E" }}>
                  Logout
                </MenuItem>
                {isAdmin ? (
                  <MenuItem onClick={handleClose}>Settings</MenuItem>
                ) : (
                  <div></div>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Box sx={{ height: "calc(100vh - 192px)", padding: "32px" }}>
          <Outlet />
        </Box>
      </Container>
      <div
        style={{
          height: "64px",
          backgroundColor: theme.palette.primary.main,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">{appName}®2023</Typography>
      </div>
    </Box>
  );
}

export default Layout;