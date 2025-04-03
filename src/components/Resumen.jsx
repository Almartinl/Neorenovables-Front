import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Resumen({ datosEstudio, actualizarDatos }) {
  // Datos de ejemplo para las gráficas
  const dataMensual = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Consumo Mensual (kWh)",
        data: [150, 175, 160, 145, 180, 200, 210, 220, 230, 240, 250, 260],
        backgroundColor: "rgba(75,192,192,0.5)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: "Gasto Mensual (€)",
        data: [50, 55, 45, 60, 70, 80, 90, 75, 85, 95, 100, 110],
        backgroundColor: "rgba(255,99,132,0.5)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
      {
        label: "Generación de Energía (kWh)",
        data: [120, 130, 140, 150, 170, 190, 210, 230, 250, 270, 290, 310],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
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
        bgcolor: "white",
        boxShadow: 3,
        overflowY: "auto",
        maxHeight: "80vh", // Limita la altura y permite scroll
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Resumen del Estudio
      </Typography>

      {/* Sección 1: Instalación Fotovoltaica */}
      <Box sx={{ border: "1px solid gray", borderRadius: 2, padding: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Instalación Fotovoltaica
        </Typography>

        {/* Datos Generales */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Datos del Cliente
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            label="Nombre"
            fullWidth
            value={datosEstudio.cliente.nombre}
            onChange={(e) =>
              actualizarDatos("cliente", { nombre: e.target.value })
            }
          />
          <TextField
            size="small"
            label="Apellido"
            fullWidth
            value={datosEstudio.cliente.apellido}
            onChange={(e) =>
              actualizarDatos("cliente", { apellido: e.target.value })
            }
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            size="small"
            label="Ubicación"
            fullWidth
            value={datosEstudio.cliente.ubicacion}
            onChange={(e) =>
              actualizarDatos("cliente", { ubicacion: e.target.value })
            }
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Colaborador</InputLabel>
            <Select
              label="colaborador"
              value={datosEstudio.cliente.colaborador}
              onChange={(e) =>
                actualizarDatos("cliente", { colaborador: e.target.value })
              }
            >
              <MenuItem value="colaborador1">Colaborador 1</MenuItem>
              <MenuItem value="colaborador2">Colaborador 2</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Sección 2: Gráficas */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 3,
          mt: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Gráficas de Consumo y Generación
        </Typography>

        {/* Gráfico de Consumo, Gasto y Generación */}
        <Paper sx={{ padding: 2, width: { xs: "90vw", md: "40vw" } }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Consumo, Gasto y Generación de Energía
          </Typography>
          <Bar data={dataMensual} options={{ responsive: true }} />
        </Paper>
      </Box>

      {/* Sección 3: Cálculos y Ahorro Estimado */}
      <Box
        sx={{ border: "1px solid gray", borderRadius: 2, padding: 2, mt: 4 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Cálculo del Sistema
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            label="Potencia Instalada (kW)"
            type="number"
            fullWidth
            value={datosEstudio.calculos.potenciaInstalada}
            onChange={(e) =>
              actualizarDatos("calculos", { potenciaInstalada: e.target.value })
            }
          />
          <TextField
            size="small"
            label="Ahorro Estimado (%)"
            type="number"
            fullWidth
            value={datosEstudio.calculos.ahorro}
            onChange={(e) =>
              actualizarDatos("calculos", { ahorro: e.target.value })
            }
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            size="small"
            label="Precio por Vatio (€)"
            type="number"
            fullWidth
            value={datosEstudio.calculos.precioPorVatio}
            onChange={(e) =>
              actualizarDatos("calculos", { precioPorVatio: e.target.value })
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
