import { useEffect, useState } from "react";
import "./home.css";
import { getPages } from "../../service/page-service";
import PageCard from "../../components/page-card";
import Button from "@mui/material/Button";

function Home() {
  const [dataList, setDataList] = useState([]);

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
    // <div style={{display:"flex", alignItems:"center", flexDirection:"column", width:"100vw"}}>
      <div className="grid">
        {dataList &&
          dataList.map((data, index) => (
            <PageCard
              data={data}
              getPages={getPagesHandler}
              key={index}
            ></PageCard>
          ))}
      </div>
      //<Button variant="contained" sx={{marginTop:"30px", maxWidth:"150px"}}>Create New Page</Button>
    // </div>
  );
}
export default Home;
