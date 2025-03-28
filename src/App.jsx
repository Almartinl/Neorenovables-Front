/* eslint-disable no-unused-vars */
import { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Dashboard from "./views/Dashboard";
import MapCustom from "./components/MapCustom";
import Layout from "./components/Layout";
import CustomizedDataGrid from "./components/CustomizedDataGrid";
import Estudios from "./views/Estudios";
import NuevoEstudio from "./views/NuevoEstudio";
import Login from "./views/Login";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Estudios />} />
          <Route path="crear-estudio" element={<NuevoEstudio />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
