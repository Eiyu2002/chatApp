import React, { useRef } from "react";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "../assets/styleChat.css";
import { useMyContext } from "../context/Context";
import { logoutUser, sendImage } from "../apis/auth";
import { useNavigate } from "react-router-dom";
let url = "";

if(import.meta.env.VITE_PROD_ENV === "produccion"){
    url = `chatapp-production-b82e.up.railway.app`;
}else{
    url = 'http://localhost:3000'
}


const socket = io(url);

function PagesChat() {
  const [menssage, setMenssage] = useState("");
  const [menssageS, setMenssageS] = useState([]);
  const [userId, setUserId] = useState();
  const { user } = useMyContext();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  const inputMessage = useRef(null);
  const chatSeccion = useRef(null);


  //ESCUCHAR MENSAJES DEL BACKEND Y GUARDARLOS EN UN ESTADO PARA EL USO EN EL FRONTEND
  useEffect(() => {
    socket.on("mensaje", ({ fileUrl, menssage, userMenssage, username }) => {
      setMenssageS((prevMenssageS) => [
        ...prevMenssageS,
        { fileUrl, menssage, userMenssage, username },
      ]);

      setUserId(socket.id);
    });
    console.log(userId);

    return () => {
      socket.off("mensaje");
    };
  }, []);


  //MANEJO DEL SCROLL, SE EJECUTA CADA QUE SE CAMBIA ESTADO DE LOS MENSAJES Y LA PREVIEW DE LA IMAGEN
  useEffect(() => {
    function scrollChatSeccion() {
      chatSeccion.current.scrollTop = chatSeccion.current.scrollHeight;
    }
    scrollChatSeccion();
  }, [menssageS, preview]);

  //GUARDAR IMAGEN SELECCIONADA EN FILE Y EN LA PREVIEW. FILE ES ENVIADA AL BACKEND
  const handleSaveImg = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      e.target.value = "";
    }
  };


//SE ENVIA MENSAJES CON O SIN IMAGEN AL BACKEND. EL BACKEND LOS REENVIA AL FRONTEND
  const sendMenssage = async () => {

    if (menssage.trim() || file) {
      const formData = new FormData();
      formData.append("file", file);

      //ARCHIVO DE IMAGEN MANDADA AL BACKEND, EL BACKEND DEVUELVE URL DEL ARCHIVO
      const imgUrl = await sendImage(formData);
      //URL DEL ARCHIVO SE MANDA AL BACKEND Y SE REENVIA COMO MENSAJE USANDO SOCKET.IO
      if (imgUrl) {
        socket.emit("mensaje", {
          fileUrl: imgUrl,
          menssage,
          userMenssage: socket.id,
          username: user.username,
        });
      } else {
        socket.emit("mensaje", {
          menssage,
          userMenssage: socket.id,
          username: user.username,
        });
      }

      setMenssage("");
      setFile(null);
      setPreview(null);
      inputMessage.current.value = "";
    }
  };



  //MANEJAR EL CIERRE DE SESION DEL BOTON CERRAR SESION
  const logout = async () => {
    const res = await logoutUser();

    console.log("Se cerro la sesion");
    window.location.href = "/authLogin";
  };

  //MANEJAR TECLA ENTER PARA ENVIAR EL MENSAJE
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMenssage();
    }
  };




  //FRONTEND

  return (
    <div className="bodyChat">
      <div className="mainContainer">
        <div className="chatContainer">
          <div
            ref={chatSeccion}
            className="chatSection"
            style={{ height: preview && "68%" }}
          >
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
                    {item.fileUrl && (
                      <div className="containerImgInChat">
                        <div
                          className="imgInChat"
                          style={{ backgroundImage: `url(${item.fileUrl})` }}
                        >
                          {" "}
                        </div>{" "}
                      </div>
                    )}
                    <h1> {item.menssage} </h1>
                  </div>
                </div>
              );
            })}
          </div>
          {preview && (
            <div className="containerPreviewImg">
              <div
                className="previewImg"
                style={{ backgroundImage: `url( ${preview} )` }}
              ></div>
            </div>
          )}

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
            <button className="buttonSendImg buttonStyle">
              <input
                type="file"
                className="inputSendImg"
                name="imgSend"
                onChange={(e) => {
                  handleSaveImg(e);
                }}
              />
              <i className="fa-solid fa-images"></i>
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
