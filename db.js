import mysql2 from "mysql2";

const connection = mysql2.createConnection({
  host: process.env.HOST_DB || "localhost",
  user: process.env.USER_DB || "root",
  password: process.env.PASSWORD_DB || "0000",
  database: process.env.NAME_DB || "chatdb",
}).promise();

connection.connect((err) => {
  if (err) {
    console.log("error al conectar a la base de datos" + err);
    return
  }

  console.log("conectado a la base de datos");
});

export default connection;
