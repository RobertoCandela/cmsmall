import { useEffect, useState } from "react";
import "./page.css";
import { getPage } from "../../service/page-service";
import { useParams } from "react-router-dom";
import { PageRender } from "../../components/page-render";

function Page() {
  const [page, setPage] = useState(undefined);

  const params = useParams();

  useEffect(() => {
    getPage(params.id)
      .then((result) => {
        setPage(result);
        console.log(result);
      })
      .catch((err) => console.log(err));
  }, []);

  return <>{ page && <PageRender page={page}></PageRender>}</>
}
export default Page;
