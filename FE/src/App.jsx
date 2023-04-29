import { useEffect, useState } from "react";
import Form from "./components/Form";

function App() {
  // let [searchParams, setSearchParams] = useSearchParams();
  const [key, setKey] = useState("");

  useEffect(() => {
    let params = new URLSearchParams(window.location.search);

    setKey(params.get("code"));
    console.log(params.get("code"));
  }, []);

  return (
    <div className="flex justify-center h-screen w-screen">
      {key ? <h1 className="w-2/3">Signed in, your key: {key}</h1> : <Form />}
    </div>
  );
}

export default App;
