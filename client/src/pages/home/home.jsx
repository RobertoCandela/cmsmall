import { useEffect, useState } from "react";
import "./home.css";
import { getPages } from "../../service/page-service";
import PageCard from "../../components/page-card";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { getCurrentSession } from "../../service/auth-service";

function Home({user,loggedIn}) {
  const [dataList, setDataList] = useState([]);
  const history = useNavigate();

  const getPagesHandler = async () => {
    getPages().then((resp) => {
      setDataList(resp);
      console.log(resp);
    });
  };
  //viene fatto solo al primo render della pagina perchè le quadre sono vuote e non ci sono variabili che possono cambiare
  useEffect(() => {
    getPagesHandler();

  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
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
      <Button variant="contained" sx={{ marginTop: "30px", maxWidth: "190px" }} onClick={()=>{
        history('/page/new')
      }}>
        Create New Page
      </Button>
    </div>
  );
}
export default Home;
