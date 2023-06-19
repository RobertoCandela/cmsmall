import { HighlightOffRounded } from "@mui/icons-material";
import { IconButton, TextField, TextareaAutosize } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export function Paragraph({ item, discardItem,handleSelectedItem }) {
  const [onHoverComponent, setOnHoverComponent] = useState(false);

  return (
    <div
      style={{ position: "relative", padding: "16px" }}
      onMouseEnter={() => setOnHoverComponent(true)}
      onMouseLeave={() => setOnHoverComponent(false)}
    >
      {onHoverComponent && (
        <div style={{ position: "absolute", right: "-16px", top: "-16px" }}>
          <IconButton
            onClick={(e) => {
              discardItem(item.id);
            }}
            color="error"
          >
            <HighlightOffRounded />
          </IconButton>
        </div>
      )}
      <TextField
        variant="standard"
        multiline
        fullWidth
        placeholder="Paragraph"
        onChange={(e)=>handleSelectedItem(e.target.value)}
      ></TextField>
    </div>
  );
}
