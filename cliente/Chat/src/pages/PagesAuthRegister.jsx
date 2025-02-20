import React from "react";
import ComponentFormAuth from "../components/formAuth/ComponentFormAuth";
import "../assets/stylePageAuth.css"

function PagesAuth() {
  return (
    <div className="contentMain">
      <section className="sectionForm">
        <ComponentFormAuth registerPage={true}></ComponentFormAuth>
      </section>

      <section className="heroSection">
        <h1>Un chat sencillo pero cumple, aun asi</h1>
        <h2>No es mas que un simple chat :)</h2>
        <h1>Create una cuenta y disfruta</h1>
      </section>
    </div>
  );
}

export default PagesAuth;
