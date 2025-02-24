import React from "react";
import { Route, Routes } from "react-router-dom";
import PagesChat from "./pages/PagesChat";
import PagesAuthLogin from "./pages/PagesAuthLogin";
import PagesAuthRegister from "./pages/PagesAuthRegister";
import { ProtecRoutes, ProtecRoutes2 } from "./apis/ProtecRoutes";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<ProtecRoutes2></ProtecRoutes2>}>
        <Route path="/authLogin" element={<PagesAuthLogin />} />
        <Route path="/authRegister" element={<PagesAuthRegister />} />
      </Route>

      {/* Rutas protegidas */}
      <Route element={<ProtecRoutes />}>
        <Route path="/" element={<PagesChat />} />
      </Route>
    </Routes>
  );
}

export default App;
