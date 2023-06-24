import { Button, TextField } from "@mui/material";
import "./settings.css";
import { useEffect, useState } from "react";
import { updateSetting } from "../../service/settings-service";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function Settings({ handleAppName }) {
  const [newAppName, setNewAppName] = useState("");
  const history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  //   setNewAppName(newAppName);
  //   const settingId = 'appName'
  //   updateSetting({id:settingId,value:newAppName})

  async function updateAppName() {
    const settingId = "appName";
    console.log("updating page name with id: ");
    console.log({ id: settingId, value: newAppName });
    updateSetting({ id: settingId, value: newAppName });
  }

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
