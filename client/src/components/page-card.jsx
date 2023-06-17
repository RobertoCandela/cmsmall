import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import { PageSVG } from "../assets/pageSVG";
import "./page-card.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EditPageSVG } from "../assets/editPageSVG";
import { deletePage } from "../service/page-service";
import Modal from "./modal";
//TODO: manage edit and delete based on user profiles
function PageCard({ data, getPages,style }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useNavigate();
  const handleDelete = async () => {
    const status = await deletePage(data.id);

    if (status) {
      getPages();
    }
  };
  return (
    <>
      <Link
        to={`/page/${data.id}`}
        className="card theme"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style = {style}
      >
        <div className="overlay"></div>
        <div className="circle">
          <PageSVG fill={"white"} width="40%" height="40%" />
        </div>
        <div className="container">
          <Typography className="typography strong">{data.title}</Typography>
          <Typography className="typography light">
            Author: {data.username}
          </Typography>
          <Typography className="typography light">
            Publication date: {data.publication_date}
          </Typography>
        </div>
        {hover && (
          <div style={{ position: "absolute", top: 5, right: 5, zIndex: 9999 }}>
            <IconButton
              aria-label="edit"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                history(`/modifyPage/${data.id}`);
              }}
            >
              <EditIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                setOpen(true)
              }}
            >
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
        )}
      </Link>
      <Modal
        title="Confirm Delete"
        content={`Do you want to delete Page ${data.title} ?`}
        setOpen={setOpen}
        open={open}
        onConfirm={handleDelete}
      ></Modal>
    </>
  );
}

export default PageCard;
