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
          .cookie("token", tokenUser, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production", // Solo usa cookies seguras (https)
            sameSite: process.env.NODE_ENV === "production" ? "None" : "", // Necesario para permitir cookies entre diferentes dominios
            expires: new Date(Date.now() + 3600000), // Expiración (1 hora, ajusta según tu necesidad)
          })
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
routes.post("/api/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: false, // Si la cookie se creó con httpOnly, debe eliminarse desde el servidor
    secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
    sameSite: process.env.NODE_ENV === "production" ? "None" : "", // Si la usaste al crear la cookie, inclúyela aquí
    path: "/", // Asegura que se elimine en todas las rutas
    expires: new Date(0), // Alternativa: maxAge: 0
  });

  return res.status(200).json({ message: "Se cerro la sesion del usuario" });
});

//Verificar token

routes.get("/api/verifyToken", async (req, res) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "No hay token para verificar al usuario" });
    }
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) {
      return res.status(403).json({ message: "Token inválido" });
    }
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      userId.id,
    ]);

    if (rows.length > 0) {
      res.status(200).json({
        message: "El usuario se encuentra autenticado",
        username: rows[0].username,
        userEmail: rows[0].useremail,
        userId: rows[0].id,
      });
    }
  } catch (error) {
    return res.status(403).json({ message: "Token invalido o expirado" });
  }
});

export default routes;
