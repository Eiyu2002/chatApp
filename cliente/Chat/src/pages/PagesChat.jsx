import React, { useRef } from "react";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "../assets/styleChat.css";
import { useMyContext } from "../context/Context";
import { logoutUser } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const socket = io("https://chatapp-production-b82e.up.railway.app");

function PagesChat() {
  const [menssage, setMenssage] = useState("");
  const [menssageS, setMenssageS] = useState([]);
  const [userId, setUserId] = useState();
  const { user } = useMyContext();
  const inputMessage = useRef(null);

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
    console.log(userId);

    return () => {
      socket.off("mensaje");
      socket.off("connect");
    };
  }, []);

  const sendMenssage = () => {
    if (menssage.trim()) {
      socket.emit("mensaje", {
        menssage,
        userMenssage: socket.id,
        username: user.username,
      });
      setMenssage("");
      inputMessage.current.value = "";
    }
  };

  const logout = async () => {
    const res = await logoutUser();

    console.log("Se cerro la sesion");
    window.location.href = "/authLogin";
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMenssage();
      event.target.value = "";
    }
  };

  return (
    <div className="bodyChat">
      <div className="mainContainer">
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
              ref={inputMessage}
              type="text"
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setMenssage(e.target.value);
              }}
              className="inputChat"
            />
            <button
              className="sendChat buttonStyle"
              onClick={() => sendMenssage()}
            >
              Enviar
            </button>
          </div>
        </div>

        <div className="interfaceContainer">
          <div className="profilesContainer"></div>

          <div className="buttonContainer">
            <button className="buttonHouse buttonStyle2">
              <i className="fa-solid fa-house"></i>
            </button>
            <button className="buttonProfile buttonStyle2">
              <i
                style={{ fontSize: "1.2em" }}
                className="fa-solid fa-id-badge"
              ></i>
            </button>
            <button className="buttonChatsList buttonStyle2">
              <i className="fa-solid fa-comments"></i>
            </button>
            <button
              className="buttonLogOut buttonStyle"
              onClick={() => logout()}
            >
              Cerrar Sesion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagesChat;
