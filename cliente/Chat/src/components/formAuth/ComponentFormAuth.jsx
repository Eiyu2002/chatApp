import { useState, useEffect } from "react";
import { registerUser, loginUser } from "../../apis/auth.js";
import { useForm } from "react-hook-form";
import "../../assets/styleFormAuth.css";
import { Link } from "react-router-dom";

function ComponentFormAuth({ registerPage }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmt = (user) => {
    if (registerPage) {
      console.log("contraseñas coinciden");
      registerUser(user);
    } else {
      loginUser(user);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmt)}>
      <div className="contentForm">
        <input
          type="text"
          placeholder="Nombre de usuario"
          {...register("userName", {
            required: "El nombre de usuario es obligatorio",
          })}
        />
        {registerPage && (
          <input
            type="email"
            placeholder="Correo electronico"
            {...register("userEmail", { required: "El email es obligatorio" })}
          />
        )}
        <input
          type="password"
          placeholder="Contraseña"
          {...register("userPassword", {
            required: "La contraseña es obligatoria",
          })}
        />
        {registerPage && (
          <input type="password" placeholder="Confirmar contraseña" />
        )}
        <button type="submit" className="buttonSubmit">
          {registerPage ? "Crear cuenta" : "Iniciar sesion"}{" "}
        </button>

        {registerPage ? (
          <Link to={"/authLogin"} className="buttonCount">Ya tengo una cuenta</Link>
        ) : (
          <Link to={"/authRegister"} className="buttonCount">No tengo aun una cuenta</Link>
        )}
      </div>
    </form>
  );
}

export default ComponentFormAuth;
