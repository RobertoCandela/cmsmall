import { Button, ButtonGroup, TextField } from "@mui/material";
import { Canvas } from "../../components/canvas";

import { useContext, useState } from "react";
import Modal from "../../components/modal";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate } from "react-router-dom";
import { createPage } from "../../service/page-service";
import { useSnackbar } from "notistack";
import userContext from "../../userContext";
import ComboBox from "../../components/combobox";

export function NewPage() {
  const [pageName, setPageName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [open, setOpen] = useState(false);
  const [canvasItem, setCanvasItem] = useState([]);
  const [assignedUser,setAssignedUser] = useState(undefined)
  const { enqueueSnackbar } = useSnackbar();
  const user = useContext(userContext);

  const history = useNavigate();

  const handleDiscard = () => {
    setCanvasItem([]);
    setPageName("");
    setPublishDate("");
  };

  function savePage() {
    //INSERT INTO blocks (id, name, type, contents, page_blocks, item_order)

    console.log("userFromContext");
    console.log(user);

    const page = {
      title: pageName,
      author: user.id,
      created_at: new Date().toISOString(),
      publication_date: publishDate,
      blocks: canvasItem,
    };

    createPage(page)
      .then((resp) => {
        if (resp) {
          history("/");
        }
      })
      .catch((err) => {
        const errorMessage = Array.from(err.errors.errors);
        errorMessage.forEach((err) => {
          console.log(err);
          enqueueSnackbar(err.msg, { variant: "error" });
        });
      });
  }

  console.log(assignedUser)
  console.log(user)
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
          paddingBottom: "20px",
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
          sx={{ marginLeft: "10px",marginRight:"10px" }}
        />
        {user.isAdmin===1&&<ComboBox assignedUser={assignedUser} setAssignedUser={setAssignedUser}/>}
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
