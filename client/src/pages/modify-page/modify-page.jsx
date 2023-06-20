import { Button, ButtonGroup, TextField } from "@mui/material";
import { Canvas } from "../../components/canvas";

import { useEffect, useState } from "react";
import Modal from "../../components/modal";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate, useParams } from "react-router-dom";
import { createPage, getPage, updatePage } from "../../service/page-service";

function ModifyPage() {
  const [pageName, setPageName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [open, setOpen] = useState(false);
  const [canvasItem, setCanvasItem] = useState([]);

  const history = useNavigate();

  const params = useParams();

  useEffect(() => {
    getPage(params.id)
      .then((resp) => {
        setPageName(resp.title);
        setPublishDate(resp.publication_date);
        setCanvasItem(resp.blocks.sort((a, b) => a.item_order - b.item_order));
      })
      .catch((err) => console.log(err));
  }, []);

  function savePage() {
    //INSERT INTO bloxcks (id, name, type, contents, page_blocks, item_order)

    const page = {
      id:params.id,
      title: pageName,
      publication_date: publishDate,
      blocks: canvasItem,
    };

    console.log("sending payload...");
    console.log(page);

    updatePage(page)
      .then((resp) => {
        console.log(resp)
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
      </ButtonGroup>
    </>
  );
}
export default ModifyPage;
