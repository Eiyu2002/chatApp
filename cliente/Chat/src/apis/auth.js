import axios from "./axios";

export async function registerUser(user) {
  try {
    console.log(user);
    const response = await axios.post("/register", user);
    console.log(`Registro exitoso, cliente. ${response.data}`);
    return response.data;
  } catch (error) {
    console.log(`Error en registro, cliente: ${error} `);
  }
}

export async function loginUser(user) {
  try {
    console.log(user);
    const response = await axios.post("/login", user);
    console.log(`Login exitoso, cliente. ${response.data.message}`);
    return response.data;
  } catch (error) {
    console.log(`Error en login, cliente:`, error.response.data.message );
  }
}
