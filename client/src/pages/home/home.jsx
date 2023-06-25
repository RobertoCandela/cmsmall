import { useContext, useEffect, useState } from "react";
import "./home.css";
import { getPages } from "../../service/page-service";
import PageCard from "../../components/page-card";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { getCurrentSession } from "../../service/auth-service";
import userContext from "../../userContext";

function Home({ loggedIn }) {
  const [dataList, setDataList] = useState([]);
  const history = useNavigate();

  const user = useContext(userContext);

  const getPagesHandler = async () => {
    getPages().then((resp) => {
      setDataList(resp);
      console.log(resp);
    });
  };

  useEffect(() => {
    getPagesHandler();
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="grid">
        {dataList &&
          dataList.map((data, index) => (
            <PageCard
              data={data}
              getPages={getPagesHandler}
              key={index}
              style={{ margin: "10px" }}
            ></PageCard>
          ))}
      </div>
      {user && (
        <Button
          variant="contained"
          sx={{ marginTop: "30px", maxWidth: "190px" }}
          onClick={() => {
            history("/page/new");
          }}
        >
          Create New Page
        </Button>
      )}
    </div>
  );
}
export default Home;
