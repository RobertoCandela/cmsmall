import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function Settings({ handleAppName }) {
  const [newAppName, setNewAppName] = useState("");
  const history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onClickSubmit = () => {
    handleAppName(newAppName)
      .then(() => {
        history("/");
      })
      .catch((err) => {
        console.log("Error caught ");
        console.log(err);
        enqueueSnackbar(err.msg, { variant: "error" });
      });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TextField
        label="App Name"
        onChange={(e) => {
          setNewAppName(e.target.value);
        }}
      ></TextField>
      <Button
        variant="contained"
        onClick={() => onClickSubmit()}
        sx={{ marginLeft: "20px" }}
      >
        Submit
      </Button>
    </div>
  );
}
export default Settings;
