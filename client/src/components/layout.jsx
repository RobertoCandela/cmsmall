import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import userContext from "../userContext";

function Layout({ isLogged, logout,appName }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const user = useContext(userContext);

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
            <div
              onClick={() => navigate("/")}
              style={{ display: "inline-block" }}
            >
              <Typography variant="h5">{appName}</Typography>
            </div>
          </div>
          {isLogged ? (
            <>
              <Typography variant="h6">{user.username}</Typography>
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
                <MenuItem
                  onClick={() => {
                    logout();
                    handleClose();
                  }}
                  sx={{ color: "#FF2E2E" }}
                >
                  Logout
                </MenuItem>
                {user.isAdmin ? (
                  <MenuItem onClick={()=>navigate("/settings")}>Settings</MenuItem>
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
      <div style={{ padding: "32px", marginBottom:"62px" }}>
        {/* <Container maxWidth="xl">
        <Box sx={{ height: "calc(100vh - 192px)", padding: "32px" }}> */}
        <Outlet />
        {/* </Box>
     </Container>   */}
      </div>

      <div
        style={{
          height: "64px",
          backgroundColor: theme.palette.primary.main,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          width: "100%",
          bottom: 0,
          marginTop: "auto",
        }}
      >
        <Typography variant="h6" color="primary.contrastText">
          {appName}®2023
        </Typography>
      </div>
    </Box>
  );
}

export default Layout;
