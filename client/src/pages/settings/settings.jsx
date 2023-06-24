import { Button, TextField } from "@mui/material";
import "./settings.css";
import { useEffect, useState } from "react";
import { updateSetting } from "../../service/settings-service";

function Settings() {
  const [newAppName, setNewAppName] = useState("");

//   setNewAppName(newAppName);
//   const settingId = 'appName'
//   updateSetting({id:settingId,value:newAppName})

    async function updateAppName(){
        const settingId = 'appName';
        console.log("updating page name with id: ")
        console.log({id:settingId,value:newAppName})
        updateSetting({id:settingId,value:newAppName})
    }

  return (
    <>
      <TextField label="App Name" onChange={(e) => {setNewAppName(e.target.value)}}></TextField>
      <Button onClick={()=>updateAppName()}>Submit</Button>
    </>
  );
}
export default Settings;
