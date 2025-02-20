import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const routes = Router();

//Registro de usuario
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

//Inicio de sesion
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

        res
          .cookie("token", tokenUser)
          .status(200)
          .json({ message: "Inicio de sesion realizado correctamente" });
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

//Cierre de sesion
routes.post("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.status(200).json({message: "Se cerro la sesion del usuario"});
});

export default routes;
