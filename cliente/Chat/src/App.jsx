import React from "react";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "./assets/styleChat.css";
import { use } from "react";

const socket = io("http://localhost:3000");

function App() {
  const [menssage, setMenssage] = useState("");

  const [menssageS, setMenssageS] = useState([]);

  useEffect(() => {
    socket.on("mensaje", (data) => {
      setMenssageS((prevMenssageS) => [...prevMenssageS, data]);
    });

    return () => {
      socket.off("mensaje");
    };
  }, []);

  const sendMenssage = () => {
    if (menssage.trim()) {
      socket.emit("mensaje", menssage);
      setMenssage("");
    }
  };

  return (
    <div className="bodyChat">
      <div className="chatContainer">
        <div className="chatSection">
          {menssageS.map((item, index) => {
            return <h1 key={index}> {item} </h1>;
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
    </div>
  );
}

export default App;
