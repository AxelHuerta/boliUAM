import Card from "../components/Card";
import { trimestres } from "../content/trimestres";

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-6xl font-extrabold text-center my-12">BoliUAM</h1>
      {trimestres.map((trimestre) => {
        return (
          <div key={trimestre[0].trimestre} className="text-center">
            <h2 className="text-xl font-bold m-4">
              Trimestre {trimestre[0].trimestre}
            </h2>
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 2xl:grid-cols-4">
              {trimestre.map((uea, index) => {
                return (
                  <>
                    <Card
                      name={uea.uea}
                      id={uea.id}
                      credits={uea.credits}
                      type={uea.type}
                      key={index}
                      trimestre={uea.trimestre}
                      seriation={uea.seriation}
                    />
                  </>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
