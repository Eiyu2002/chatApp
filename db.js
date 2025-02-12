import mysql2 from "mysql2";

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "chatdb",
}).promise();

connection.connect((err) => {
  if (err) {
    console.log("error al conectar a la base de datos" + err);
    return
  }

  console.log("conectado a la base de datos");
});

export default connection;
