import wretch from "wretch";

const api = wretch("/api/v1")
  .errorType("json")
  .resolve((r) => r.json());
export async function getUsers() {
  try {
    const users = await api.get("/users");
    return users;
  } catch (error) {
    // The API could return an empty object - in which case the status text is logged instead.
    const message =
      typeof error.message === "object" && Object.keys(error.message).length > 0
        ? JSON.stringify(error.message)
        : error.response.statusText;
    console.error(`${error.status}: ${message}`);
  }
}
