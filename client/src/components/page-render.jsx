import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function PageRender({ page }) {

  const [sortedBlocks, setSortedBlocks] = useState([]);

  useEffect(() => {
    if (page && page.blocks.length > 0) {
      setSortedBlocks(page?.blocks.sort((a, b) => a.item_order - b.item_order));
    }
  }, [page]);

  function renderItem(item) {
    switch (item.blockType) {
      case "h": {
        return (
          <Typography
            variant="h2"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {item.content}
          </Typography>
        );
      }
      case "p": {
        return (
          <Typography
            variant="body1"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {item.content}
          </Typography>
        );
      }
      case "img": {

        return (
          <div
            style={{
              width: "350px",
              height: "250px",
              display: "flex",
              justifyContent: "center",
              margin:'auto'
            }}
          >
            <img
              src={item.content}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        );
      }
      default: {
        console.log("Not a valid render item");
      }
    }
  }

  return (
    <>
      <Typography
        variant="h5"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {page.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {" "}
        Author: {page.username}
      </Typography>
      <Typography
        variant="body2"
        sx={{ display: "flex", justifyContent: "center",marginBottom:'20px'}}
      >
        {" "}
        Publication Date: {page.publication_date}
      </Typography>

      <div style={{ backgroundColor: "white", padding:'32px',width:'80%',margin:'auto', marginBottom:'74px'}}>
        {sortedBlocks.map((item) => renderItem(item))}
      </div>
    </>
  );
}
