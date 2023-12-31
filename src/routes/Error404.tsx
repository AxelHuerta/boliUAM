import { useRouteError } from "react-router-dom";
import image404 from "../assets/404-page-not-found-monochromatic.svg";
import Navbar from "../components/Navbar";

export default function Error404() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Navbar />
      <div className="flex h-screen justify-center mx-4">
        <img src={image404} alt="404 error" className="max-w-md" />
      </div>
    </>
  );
}
