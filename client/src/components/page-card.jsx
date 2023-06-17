import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import { PageSVG } from "../assets/pageSVG";
import "./page-card.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EditPageSVG } from "../assets/editPageSVG";
import { deletePage } from "../service/page-service";
//TODO: manage edit and delete based on user profiles
function PageCard({ data, getPages}) {
  const [hover, setHover] = useState(false);
  const history = useNavigate();
  const handleDelete = async () =>{

    const status = await deletePage(data.id)

    if(status){
      getPages()
    }
  }
  return (
    <Link
      to={`/page/${data.id}`}
      className="card theme"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
        <div style={{position:"absolute",top: 5, right: 5, zIndex: 9999}}>
        <IconButton
          aria-label="edit"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            history(`/modifyPage/${data.id}`);
          }}
        >
          <EditIcon sx={{color:"white"}} />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            handleDelete()
          }}
        >
          <DeleteIcon sx={{color:"white"}} />
        </IconButton>
        </div>
      )}
    </Link>
  );
}

export default PageCard;
