import mysql2 from "mysql2";

const connection = mysql2.createConnection({
  host: process.env.HOST_DB || "localhost",
  user: process.env.USER_DB || "root",
  password: process.env.PASSWORD_DB || "0000",
  port: process.env.PORT_DB || "3306",
  database: process.env.NAME_DB || "chatdb",
}).promise(); // ← Si usas esto, no necesitas connection.connect()

export default connection;

