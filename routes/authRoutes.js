import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const routes = Router();

routes.post("/api/register", async (req, res) => {
  try {
    const { userEmail, userName, userPassword } = req.body;

    const passwordBcrypt = await bcrypt.hash(userPassword, 10);
    const result = await db.query(
      "INSERT INTO users (username, useremail, userpassword) VALUES (?,?,?)",
      [userName, userEmail, passwordBcrypt]
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
      userName,
    ]);

    if (rows.length > 0) {
      const comparePassword = await bcrypt.compare(
        userPassword,
        rows[0].userpassword
      );
      if (comparePassword) {
        const tokenUser = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        }); 

        res.cookie("token", tokenUser);
      } else {
        return res.status(500).json({ message: "Contraseña incorrecta" });
      }
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default routes;
