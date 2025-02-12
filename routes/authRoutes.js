import { Router } from "express";
import db from "../db.js";

const routes = Router();

routes.post("/api/register", async (req, res) => {
  try {
    const { userEmail, userName, userPassword } = req.body;

    const result = await db.query(
      "INSERT INTO users (username, useremail, userpassword) VALUES (?,?,?)",
      [userName, userEmail, userPassword]
    );
    console.log(result);
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send(error);
  }
});

routes.post("/api/login", async (req, res) => {
  try {
    const { userName, userPassword } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE userName = ?", [
      userName
    ]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
      console.log(rows)
    } else {
      res.status(404).json({ menssage: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default routes;
