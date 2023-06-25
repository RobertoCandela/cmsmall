import { Button, ButtonGroup, TextField } from "@mui/material";
import { Canvas } from "../../components/canvas";

import { useContext, useEffect, useState } from "react";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate, useParams } from "react-router-dom";
import { getPage, updatePage } from "../../service/page-service";
import { enqueueSnackbar } from "notistack";
import ComboBox from "../../components/combobox";
import userContext from "../../userContext";

function ModifyPage() {
  const [pageName, setPageName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [assignedUser, setAssignedUser] = useState(undefined);
  const [pageAuthor, setPageAuthor] = useState("");
  const [canvasItem, setCanvasItem] = useState([]);
  const user = useContext(userContext);

  const history = useNavigate();

  const params = useParams();

  useEffect(() => {
    getPage(params.id)
      .then((resp) => {
        setPageName(resp.title);
        setPublishDate(resp.publication_date);
        setCanvasItem(resp.blocks.sort((a, b) => a.item_order - b.item_order));
        setPageAuthor(resp.username);
      })
      .catch((err) => console.log(err));
  }, []);

  function savePage() {
    const page = {
      id: params.id,
      title: pageName,
      publication_date: publishDate,
      blocks: canvasItem,
    };

    if (assignedUser) {
      page.author = assignedUser.id;
    }

    updatePage(page)
      .then((resp) => {
        console.log(resp);
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
          sx={{ marginLeft: "10px", marginRight: "10px" }}
        />
        {user.isAdmin === 1 && (
          <ComboBox
            assignedUser={assignedUser ? assignedUser : pageAuthor}
            setAssignedUser={setAssignedUser}
          />
        )}
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
      </ButtonGroup>
    </>
  );
}
export default ModifyPage;
