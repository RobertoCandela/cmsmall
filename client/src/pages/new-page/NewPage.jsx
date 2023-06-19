import {
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Canvas } from "../../components/canvas";
import Layout from "../../components/layout";

import { useState } from "react";
import Modal from "../../components/modal";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { createPage } from "../../service/page-service";

export function NewPage() {
  const [pageName, setPageName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [open, setOpen] = useState(false);
  const [canvasItem, setCanvasItem] = useState([]);

  const history = useNavigate();

  const handleDiscard = () => {
    console.log(canvasItem);
    setCanvasItem([]);
    setPageName("");
    setPublishDate("");
  };

  function savePage() {
      //INSERT INTO blocks (id, name, type, contents, page_blocks, item_order)

    const page = {
      title: pageName,
      author: "ea148da9-1ed9-4e78-904e-462ab9c72e41",
      created_at: new Date().toISOString(),
      publication_date: publishDate,
      blocks : canvasItem
    };

    console.log("sending payload...");
    console.log(page);

    createPage(page)
      .then((resp) => {
        if (resp) {
          history("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <Button
        variant="contained"
        startIcon={<KeyboardBackspaceRoundedIcon />}
        onClick={(e) => {
          history("/");
        }}
      >
        Back
      </Button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: "60px",
        }}
      >
        <TextField
          variant="outlined"
          label="Page Title"
          value={pageName}
          onChange={(e) => {
            setPageName(e.target.value);
          }}
        ></TextField>
        <TextField
          id="date"
          variant="outlined"
          label="Publish Date"
          type="date"
          value={publishDate}
          onChange={(e) => {
            setPublishDate(e.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ marginLeft: "10px" }}
        />
      </div>
      <Canvas
        destinationItems={canvasItem}
        setDestinationItems={setCanvasItem}
      />
      <ButtonGroup
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          paddingBottom: "64px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            console.log("payload from create Page");
            console.log(canvasItem);
            savePage();
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={(e) => {
            setOpen(true);
          }}
        >
          Discard
        </Button>
      </ButtonGroup>
      <Modal
        title="Confirm Discard"
        content={"Do you want to discard all changes?"}
        setOpen={setOpen}
        open={open}
        onConfirm={handleDiscard}
      ></Modal>
    </>
  );
}
