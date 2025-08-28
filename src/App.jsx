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
import Clientes from "./views/Clientes";
import Colaboradores from "./views/Colaboradores";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ROLES } from "./const/roles";
import PrivateRoute from "./components/routes/PrivatRoute/PrivateRoute";
import Agenda from "./views/Agenda";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                allowedRoles={[ROLES.User, ROLES.Admin, ROLES.SuperAdmin]}
              />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="estudios" element={<Estudios />} />
            <Route path="estudios/crear-estudio" element={<NuevoEstudio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/paneles" element={<Paneles />} />
            <Route path="productos/inversores" element={<Inversores />} />
            <Route path="productos/baterias" element={<Baterias />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="presupuestos" element={<Presupuestos />} />
            <Route path="colaboradores" element={<Colaboradores />} />
            <Route path="agenda" element={<Agenda />} />
          </Route>
          {/* <Route path="/test" element={<MainGrid />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
