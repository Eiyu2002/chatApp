import React from "react";
import ComponentFormAuth from "../components/formAuth/ComponentFormAuth";
import "../assets/stylePageAuth.css";

function PagesAuthLogin() {
  return (
    <div className="contentMain">
      <section className="sectionForm">
        <ComponentFormAuth registerPage={false}></ComponentFormAuth>
      </section>

      <section className="heroSection">
        <h1>Disfruta de este prototipo de chat diseñado por</h1>
        <h2>Joel Maximiliano Etchegaray</h2>
        <h1>Inicia sesion con tu cuenta</h1>
      </section>
    </div>
  );
}

export default PagesAuthLogin;
