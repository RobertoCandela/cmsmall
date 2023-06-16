import { useEffect, useState } from "react";
import "./home.css";
import { getPages } from "../../service/page-service";
import PageCard from "../../components/page-card";

function Home() {
  const [dataList, setDataList] = useState([]);
  //viene fatto solo al primo render della pagina perchè le quadre sono vuote e non ci sono variabili che possono cambiare
  useEffect(() => {
    getPages().then((resp) => {
      setDataList(resp);
      console.log(resp);
    });
  }, []);

  return (
    <div className="grid">
      {dataList && dataList.map((data) => <PageCard data={data}></PageCard>)}
    </div>
  );
}
export default Home;
