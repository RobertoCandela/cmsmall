import {
  AddCircleOutlineRounded,
  HighlightOffRounded,
} from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

export function Image({ item, discardItem, handleSelectedImage }) {
  const [onHoverComponent, setOnHoverComponent] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const images = [
    { title: "Sea Turtle", path: "/assets/images/sea_turtle.jpg" },
    { title: "Forest", path: "/assets/images/forest.jpg" },
    { title: "Mountains", path: "/assets/images/mountains.jpg" },
    { title: "Milky Way", path: "/assets/images/milky_way.jpg" },
  ];

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      style={{ position: "relative", padding: "16px" }}
      onMouseEnter={() => setOnHoverComponent(true)}
      onMouseLeave={() => setOnHoverComponent(false)}
    >
      {onHoverComponent && (
        <div style={{ position: "absolute", right: "-16px", top: "-16px" }}>
          <IconButton
            color="primary"
            onClick={(e) => {
              handleMenu(e);
            }}
          >
            <AddCircleOutlineRounded />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              discardItem(item.id);
            }}
          >
            <HighlightOffRounded />
          </IconButton>
        </div>
      )}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {images.map((img) => (
          <MenuItem
            onClick={() => {
              handleClose();
              handleSelectedImage(img.path);
            }}
          >
            {img.title}
          </MenuItem>
        ))}
      </Menu>
      {item.content.length != 0 ? (
        <div
          style={{
            width: "350px",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          <img
            src={item.content}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ) : (
        <Typography>Please select an image from add button</Typography>
      )}
    </div>
  );
}
