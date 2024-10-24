import { getUsers } from "./utils/api";
import Form from "./components/form.tsx";
import { Navbar } from "./components/navbar.tsx";
import { useQuery } from "@tanstack/react-query";
function App() {
  const query = useQuery({ queryKey: ["users"], queryFn: getUsers });

  return (
    <>
      <Navbar />
      <Form />

      <ul>
        {query.data?.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
