import { Typography } from "@mui/material";
import { PageSVG } from "../assets/pageSVG";
import "./page-card.css";

function PageCard({ data }) {
  return (
    <a href="#" className="card theme">
      <div className="overlay"></div>
      <div className="circle">
        <PageSVG fill={"white"} width="40%" height="40%" />
      </div>
      <div className="container">
        <Typography className="typography strong">{data.title}</Typography>
        <Typography className="typography light">Author: {data.username}</Typography>
        <Typography className="typography light">
          Publication date: {data.publication_date}
        </Typography>
      </div>
    </a>
  );
}

export default PageCard;
