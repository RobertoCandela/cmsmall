import { Typography } from "@mui/material";
import { NoMatchSVG } from "../../../assets/nomatchSVG";

function NoMatch() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <NoMatchSVG />
      <Typography variant="h2" sx={{ marginTop: "20px" }}>
        No page found!
      </Typography>
    </div>
  );
}
export default NoMatch;
