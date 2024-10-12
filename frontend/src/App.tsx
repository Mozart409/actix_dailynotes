import { useState } from "react";
import { getUsers } from "./utils/api";
import Form from "./components/form.tsx";
import { Navbar } from "./components/navbar.tsx";
function App() {
  const [count, setCount] = useState(0);

  const users = getUsers();
  return (
    <>
      <Navbar />
      <Form />
    </>
  );
}

export default App;
