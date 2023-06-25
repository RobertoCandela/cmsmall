import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getAllUsers } from "../service/user-service";
import { useEffect, useState } from "react";

export default function ComboBox({ assignedUser, setAssignedUser }) {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const users = await getAllUsers();

    const userOption = users.map((u) => {
      return { id: u.id, label: u.username };
    });

    setUsers(userOption);
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    users.length > 0 && (
      <Autocomplete
        disablePortal
        id="combo-box-user"
        value={assignedUser}
        options={users}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Assign to user" />
        )}
        onChange={(event, newValue) => {
          setAssignedUser(newValue);
        }}
      />
    )
  );
}
