/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";

export default function FormularioConsumo({ estudio, setEstudio }) {
  const tipoTarifa = estudio.consumo?.datosComunes?.tipoTarifaActual || "2.0TD";
  // Inicializar datos de consumo según el modo
  useEffect(() => {
    if (!estudio.consumo) {
      setEstudio((prev) => ({
        ...prev,
        consumo: {
          modo: "simplificado",
          datosComunes: {
            tipoTarifaActual: "2.0TD",
            watiosContratados: "",
            precioPotencia: "",
            precioKW: "",
            consumoAnualEstimado: "",
          },
          datosCompletos: {
            consumoMensual: Array(12).fill(0),
          },
          tarifaSalida: {
            tipoTarifa: "2.0TD",
            precioPotencia: "",
            precioKW: "",
            watiosContratados: "",
            precioExcedente: "",
          },
        },
      }));
    }
  }, [estudio.consumo, setEstudio]);

  const handleChangeComun = (field, value) => {
    setEstudio((prev) => ({
      ...prev,
      consumo: {
        ...prev.consumo,
        datosComunes: {
          ...prev.consumo.datosComunes,
          [field]: field === "tipoTarifaActual" ? value : Number(value),
        },
        // Actualiza también la tarifa de salida si es el mismo tipo
        tarifaSalida:
          field === "tipoTarifaActual"
            ? {
                ...prev.consumo.tarifaSalida,
                tipoTarifa: value,
              }
            : prev.consumo.tarifaSalida,
      },
    }));
  };

  const handleConsumoMensualChange = (index, value) => {
    const nuevoConsumo = [...estudio.consumo.datosCompletos.consumoMensual];
    nuevoConsumo[index] = Number(value) || 0;

    setEstudio((prev) => ({
      ...prev,
      consumo: {
        ...prev.consumo,
        datosCompletos: {
          ...prev.consumo.datosCompletos,
          consumoMensual: nuevoConsumo,
        },
        datosComunes: {
          ...prev.consumo.datosComunes,
          consumoAnualEstimado: nuevoConsumo.reduce((a, b) => a + b, 0),
        },
      },
    }));
  };

  const handleConsumoAnualChange = (value) => {
    const consumoAnual = Number(value) || 0;
    const consumoMensualPromedio = Math.round((consumoAnual / 12) * 100) / 100;

    setEstudio((prev) => ({
      ...prev,
      consumo: {
        ...prev.consumo,
        datosComunes: {
          ...prev.consumo.datosComunes,
          consumoAnualEstimado: consumoAnual,
        },
        datosCompletos: {
          ...prev.consumo.datosCompletos,
          consumoMensual: Array(12).fill(consumoMensualPromedio),
        },
      },
    }));
  };

  const handleTarifaSalidaChange = (field, value) => {
    setEstudio((prev) => ({
      ...prev,
      consumo: {
        ...prev.consumo,
        tarifaSalida: {
          ...prev.consumo.tarifaSalida,
          [field]: field === "tipoTarifa" ? value : Number(value),
        },
      },
    }));
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: { xs: "100%", md: "100vw" },
        height: { xs: "auto", md: "80vh" },
        mx: "auto",
        px: 2,
        // py: 3,
        bgcolor: "white",
        boxShadow: 3,
        overflowY: "auto",
      }}
    >
      {/* 📝 Tarifa Actual */}
      <Box py={3} display={"flex"} flexDirection="column" gap={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Tarifa Actual
        </Typography>
        <FormControl variant="standard" fullWidth>
          <InputLabel>Tipo de Tarifa</InputLabel>
          <Select
            value={tipoTarifa}
            onChange={(e) =>
              handleChangeComun("tipoTarifaActual", e.target.value)
            }
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
            value={estudio.consumo?.datosComunes?.watiosContratados || ""}
            onChange={(e) =>
              handleChangeComun("watiosContratados", e.target.value)
            }
          />
          <TextField
            type="number"
            variant="standard"
            label="Precio de Potencia (€/kW)"
            fullWidth
            value={estudio.consumo?.datosComunes?.precioPotencia || ""}
            onChange={(e) =>
              handleChangeComun("precioPotencia", e.target.value)
            }
          />
        </Box>

        <TextField
          type="number"
          variant="standard"
          label="Precio del kWh (€/kWh)"
          fullWidth
          value={estudio.consumo?.datosComunes?.precioKW || ""}
          onChange={(e) => handleChangeComun("precioKW", e.target.value)}
        />

        {/* Consumo - Diferente según el modo */}
        {estudio.consumo.modo == "simplificado" ? (
          <TextField
            type="number"
            variant="standard"
            label="Consumo Anual Estimado (kWh)"
            fullWidth
            value={estudio.consumo?.datosComunes?.consumoAnualEstimado || ""}
            onChange={(e) => handleConsumoAnualChange(e.target.value)}
          />
        ) : (
          <>
            <Typography variant="subtitle1" fontWeight="bold">
              Consumo Mensual (kWh)
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
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
                  value={
                    estudio.consumo?.datosCompletos?.consumoMensual[index] || ""
                  }
                  onChange={(e) =>
                    handleConsumoMensualChange(index, e.target.value)
                  }
                  fullWidth
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Tarifa de Salida (común a ambos modos) */}
      <Box py={3} display={"flex"} flexDirection="column" gap={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Tarifa de Salida
        </Typography>
        <FormControl variant="standard" fullWidth>
          <InputLabel>Tipo de Tarifa</InputLabel>
          <Select
            value={estudio.consumo?.tarifaSalida?.tipoTarifa || "2.0TD"}
            onChange={(e) =>
              handleTarifaSalidaChange("tipoTarifa", e.target.value)
            }
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
            value={estudio.consumo?.tarifaSalida?.watiosContratados || ""}
            onChange={(e) =>
              handleTarifaSalidaChange("watiosContratados", e.target.value)
            }
          />
          <TextField
            type="number"
            variant="standard"
            label="Precio de Potencia (€/kW)"
            fullWidth
            value={estudio.consumo?.tarifaSalida?.precioPotencia || ""}
            onChange={(e) =>
              handleTarifaSalidaChange("precioPotencia", e.target.value)
            }
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            type="number"
            variant="standard"
            label="Precio del kWh (€/kWh)"
            fullWidth
            value={estudio.consumo?.tarifaSalida?.precioKW || ""}
            onChange={(e) =>
              handleTarifaSalidaChange("precioKW", e.target.value)
            }
          />
          <TextField
            type="number"
            variant="standard"
            label="Precio Excedente (€/kWh)"
            fullWidth
            value={estudio.consumo?.tarifaSalida?.precioExcedente || ""}
            onChange={(e) =>
              handleTarifaSalidaChange("precioExcedente", e.target.value)
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
