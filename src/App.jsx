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
import Home from "./views/Home";
import Productos from "./views/Productos";
import Paneles from "./views/Paneles";
import Inversores from "./views/Inversores";
import Baterias from "./views/Baterias";
import Presupuestos from "./views/Presupuestos";
import CustomDatePicker from "./components/CustomDatePicker";
import HighlightedCard from "./components/HighlightedCard";
import CustomizedTreeView from "./components/CustomizedTreeView";
import Search from "./components/Search";
import ForgotPassword from "./components/ForgotPassword";
import StatCard from "./components/StatCard";
import MainGrid from "./components/MainGrid";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Estudios />} />
          <Route path="crear-estudio" element={<NuevoEstudio />} />
          <Route path="productos" element={<Productos />} />
          <Route path="productos/paneles" element={<Paneles />} />
          <Route path="productos/inversores" element={<Inversores />} />
          <Route path="productos/baterias" element={<Baterias />} />
          {/* <Route path="clientes" element={<Presupuestos />} /> */}
          <Route path="presupuestos" element={<Presupuestos />} />
        </Route>
        {/* <Route path="/test" element={<MainGrid />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
