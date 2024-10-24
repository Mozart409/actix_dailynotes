import wretch from "wretch";
import FormUrlAddon from "wretch/addons/formUrl";

const api = wretch("/api/v1")
  .errorType("json")
  .resolve((r) => r.json());


export async function getUsers() {
  try {
    const users = await api.get("/users");
    return users;
  } catch (error) {
    console.error(`${error}`);
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string,
) {
  try {
    const newUser = await api
      .url("/users")
      .addon(FormUrlAddon)
      .formUrl({
        username,
        email,
        password,
      })
      .post();

    return newUser;
  } catch (error) {
    console.error(`${error}`);
    return error;
  }
}
