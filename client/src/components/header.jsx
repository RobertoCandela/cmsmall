import { HighlightOffRounded } from "@mui/icons-material";
import { IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";

export function Header({ item, discardItem, handleSelectedItem }) {
  const [onHoverComponent, setOnHoverComponent] = useState(false);

  return (
    <div
      style={{ position: "relative", padding: "16px" }}
      onMouseEnter={() => setOnHoverComponent(true)}
      onMouseLeave={() => setOnHoverComponent(false)}
    >
      {onHoverComponent && (
        <div style={{ position: "absolute", right: '-16px', top:'-16px' }}>
          <IconButton color="error" onClick={e=>{discardItem(item.id)}}>
            <HighlightOffRounded  />
          </IconButton>
        </div>
      )}
      <TextField
        variant="standard"
        multiline
        fullWidth
        placeholder="Header"
        value = {item.content}
        inputProps={{ style: { fontSize: "30px", fontWeight: "bold" } }}
        onChange={(e)=>handleSelectedItem(e.target.value)}
      ></TextField>
    </div>
  );
  //return <Typography variant="h3">fff</Typography>
}
