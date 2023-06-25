import { useEffect, useState } from "react";
import { getPage } from "../../service/page-service";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { PageRender } from "../../components/page-render";
import { Button } from "@mui/material";

function Page() {
  const [page, setPage] = useState(undefined);

  const history = useNavigate();

  const params = useParams();

  useEffect(() => {
    getPage(params.id)
      .then((result) => {
        setPage(result);
        console.log(result);
      })
      .catch((err) => console.log(err));
  }, []);

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
      {page && <PageRender page={page}></PageRender>}
    </>
  );
}
export default Page;
