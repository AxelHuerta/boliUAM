import Card from "./components/Card";
import Navbar from "./components/Navbar";
import { trimestres } from "./content/trimestres";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center pt-12">
        <h1 className="text-6xl font-extrabold text-center my-12">BoliUAM</h1>
        {trimestres.map((trimestre, index) => {
          return (
            <div key={index + trimestre[0].trimestre} className="text-center">
              <h2 className="text-xl font-bold m-4">
                Trimestre {trimestre[0].trimestre}
              </h2>
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 2xl:grid-cols-4">
                {trimestre.map((uea, index) => {
                  return (
                    <Card
                      name={uea.uea}
                      id={uea.id}
                      credits={uea.credits}
                      type={uea.type}
                      key={index + uea.id}
                      trimester={uea.trimestre}
                      seriation={uea.seriation}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
