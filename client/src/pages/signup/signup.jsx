import {
  Alert,
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
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Signup.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Signup({signup}) {
  const history = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      surname: lastName,
      name: firstName,
      username: username,
      email: email,
      password: password,
    });

    const user = {
      surname: lastName,
      name: firstName,
      username: username,
      email: email,
      password: password,
      isAdmin:0
    };

    signup(user)
    .then(() => {
      history('/')
    })
    .catch((err) => {
      console.log("Error caught ");
      console.log(err);
      setErrorMessage(err.errorMessage);
      setShowAlert(true);
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="signup">
         <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => {
          setShowAlert(false);
          setErrorMessage("");
        }}
        anchorOrigin = {{vertical:'top',horizontal:'center'}}
        sx={{marginTop:'64px'}}
      >
        <Alert
          severity="error"
          onClose={() => {
            setShowAlert(false);
            setErrorMessage("");
          }}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Card className="card">
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            align="center"
            className="title"
            fontWeight={"700"}
          >
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  type="surname"
                  label="Surname"
                  variant="outlined"
                  value={lastName}
                  onChange={handleLastNameChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="name"
                  label="Name"
                  variant="outlined"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="username"
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={handleUsernameChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="email"
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    label="Password"
                    value={password}
                    onChange={handlePasswordChange}
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
              <Grid item xs={6}>
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel
                    htmlFor="confirm-password"
                    error={password !== confirmPassword}
                  >
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="confirm-password"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    error={password !== confirmPassword}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
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
                  disabled={
                    !email ||
                    !password ||
                    !lastName ||
                    !firstName ||
                    !username ||
                    !confirmPassword
                  }
                >
                  Signup
                </Button>
              </Grid>
              <Grid item xs={12} className="grid-center">
                <Typography>
                  Already have an account?{" "}
                  <Link onClick={() => history("/login")} className="link">
                    Login
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

export default Signup;
