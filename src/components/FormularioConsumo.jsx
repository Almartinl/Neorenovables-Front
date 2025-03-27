import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";

const FormularioConsumo = () => {
  // const [modoTecnico, setModoTecnico] = useState(false);
  const [tipoTarifa, setTipoTarifa] = useState("2.0TD");
  const [consumoMensual, setConsumoMensual] = useState(
    Array(12).fill("") // Inicializa los 12 meses vacíos
  );
  const [tarifaDatos, setTarifaDatos] = useState({
    precioPotencia: "",
    precioKw: "",
    precioExcedente: "",
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    p5: "",
    p6: "",
  });

  const handleConsumoChange = (index, value) => {
    const nuevoConsumo = [...consumoMensual];
    nuevoConsumo[index] = value;
    setConsumoMensual(nuevoConsumo);
  };

  const handleTarifaChange = (field, value) => {
    setTarifaDatos({ ...tarifaDatos, [field]: value });
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: { xs: "100%", md: "80vw" },
        height: "80vh",
        mx: "auto",
        px: 2,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* 🔘 Selector de Modo */}
      {/* <FormControlLabel
        control={
          <Switch
            checked={modoTecnico}
            onChange={() => setModoTecnico(!modoTecnico)}
          />
        }
        label="Modo Técnico"
      /> */}
      {/* 📝 Tarifa Actual */}
      <Typography mt={2} variant="h6" fontWeight="bold">
        Tarifa Actual
      </Typography>
      <FormControl variant="standard">
        <InputLabel>Tipo de Tarifa</InputLabel>
        <Select
          value={tipoTarifa}
          onChange={(e) => setTipoTarifa(e.target.value)}
        >
          <MenuItem value="2.0TD">2.0TD</MenuItem>
          <MenuItem value="3.0TD">3.0TD</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          type="number"
          variant="standard"
          label="Watios Contratados"
          fullWidth
        />
        <TextField
          type="number"
          variant="standard"
          label="Precio de Potencia (€/kW)"
          fullWidth
          value={tarifaDatos.precioPotencia}
          onChange={(e) => handleTarifaChange("precioPotencia", e.target.value)}
        />
      </Box>
      <TextField
        type="number"
        variant="standard"
        label="Precio del kWh (€/kWh)"
        fullWidth
        value={tarifaDatos.precioKw}
        onChange={(e) => handleTarifaChange("precioKw", e.target.value)}
      />
      {/* 🔧 Tarifa de Salida (Solo en Modo Técnico) */}
      {/* {modoTecnico && (
        <>
          <Typography variant="h6" fontWeight="bold">
            Tarifa de Salida
          </Typography>
          <FormControl variant="standard" fullWidth>
            <InputLabel>Tipo de Tarifa</InputLabel>
            <Select
              value={tipoTarifa}
              onChange={(e) => setTipoTarifa(e.target.value)}
            >
              <MenuItem value="2.0TD">2.0TD</MenuItem>
              <MenuItem value="3.0TD">3.0TD</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              type="number"
              variant="standard"
              label="Watios Contratados"
              fullWidth
            />
            <TextField
              type="number"
              variant="standard"
              label="Precio de Potencia (€/kW)"
              fullWidth
              value={tarifaDatos.precioPotencia}
              onChange={(e) =>
                handleTarifaChange("precioPotencia", e.target.value)
              }
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              type="number"
              variant="standard"
              label="Precio del kWh (€/kWh)"
              fullWidth
              value={tarifaDatos.precioKw}
              onChange={(e) => handleTarifaChange("precioKw", e.target.value)}
            />
            <TextField
              type="number"
              variant="standard"
              label="Precio Excedente (€/kWh)"
              fullWidth
              value={tarifaDatos.precioExcedente}
              onChange={(e) =>
                handleTarifaChange("precioExcedente", e.target.value)
              }
            />
          </Box>

          {/* 📝 P1, P2... P6 (Solo si es tarifa 3.0) */}
      {/* {tipoTarifa === "3.0TD" && (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "1fr 1fr 1fr",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <TextField
                  key={p}
                  type="number"
                  variant="standard"
                  label={`P${p} (€/kWh)`}
                  value={tarifaDatos[`p${p}`]}
                  onChange={(e) => handleTarifaChange(`p${p}`, e.target.value)}
                  fullWidth
                />
              ))}
            </Box>
          )}
        </>
      )} */}
      {/* 📊 Consumo Mensual */}
      <Typography variant="h6" fontWeight="bold">
        Consumo Mensual (kWh)
      </Typography>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
      >
        {[
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ].map((mes, index) => (
          <TextField
            key={mes}
            type="number"
            variant="standard"
            label={mes}
            value={consumoMensual[index]}
            onChange={(e) => handleConsumoChange(index, e.target.value)}
            fullWidth
          />
        ))}
      </Box>
      {/* ✅ Botón de Guardar */}
      {/* <Button variant="contained" size="large" sx={{ alignSelf: "center" }}>
        Guardar Datos
      </Button> */}
    </Box>
  );
};

export default FormularioConsumo;
