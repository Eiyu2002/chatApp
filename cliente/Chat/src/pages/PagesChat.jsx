import React from "react";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "../assets/styleChat.css";
import { useMyContext } from "../context/Context";
import { logoutUser } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

function PagesChat() {
  const [menssage, setMenssage] = useState("");
  const [menssageS, setMenssageS] = useState([]);
  const [userId, setUserId] = useState();
  const { user } = useMyContext();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      setUserId(socket.id);
    });

    socket.on("mensaje", ({ menssage, userMenssage, username }) => {
      setMenssageS((prevMenssageS) => [
        ...prevMenssageS,
        { menssage, userMenssage, username },
      ]);

      setUserId(socket.id);
    });

    return () => {
      socket.off("mensaje");
      socket.off("connect");
    };
  }, []);

  const sendMenssage = () => {
    if (menssage.trim()) {
      socket.emit("mensaje", {
        menssage,
        userMenssage: userId,
        username: user.username,
      });
      setMenssage("");
    }
  };

  const logout = async () => {
    const res = await logoutUser();

    console.log("Se cerro la sesion");
    window.location.href = "/authLogin";
  };

  return (
    <div className="bodyChat">
      <div className="chatContainer">
        <div className="chatSection">
          {menssageS.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  userId === item.userMenssage
                    ? "textInChatUserContainer"
                    : "textInChatContainer"
                }
              >
                <div
                  className={
                    userId === item.userMenssage
                      ? "textInChatUser"
                      : "textInChat"
                  }
                >
                  <h1 className="userNameInChat"> {item.username} </h1>
                  <h1> {item.menssage} </h1>
                </div>
              </div>
            );
          })}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            onChange={(e) => {
              setMenssage(e.target.value);
            }}
            className="inputChat"
          />
          <button className="sendChat" onClick={() => sendMenssage()}>
            Enviar
          </button>
        </div>
      </div>

      <div className="buttonContainer">
        <div className="buttonLogOutContainer">
          <button className="buttonLogOut" onClick={() => logout()}>
            Cerrar Sesion
          </button>
        </div>
      </div>
    </div>
  );
}

export default PagesChat;
