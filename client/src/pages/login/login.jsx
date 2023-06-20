import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../../service/auth-service";

function Login({login}) {
  const history = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const credentials = { username: username, password: password };
    login(credentials).then(()=>{

       
        history('/')

    }).catch((err)=>console.log(err))

  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login">
      <Card className="card">
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            align="center"
            className="title"
            fontWeight={"700"}
          >
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={handleUsernameChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  sx={{ width: "100%", flexDirection: "row" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} className="grid-center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!username || !password}
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={12} className="grid-center">
                <Typography>
                  Any account yet?{" "}
                  <Link onClick={() => history("/signup")} className="link">
                    Signup
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
