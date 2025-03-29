import {
  Box,
  Typography,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";

export default function Resumen({ datosEstudio, actualizarDatos }) {
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
        // borderRadius: 2,
        boxShadow: 3,
        overflowY: "auto",
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

        {/* Configuración del Sistema Fotovoltaico */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Configuración del Sistema
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            label="Acimut (°)"
            type="number"
            fullWidth
            value={datosEstudio.instalacion.acimut}
            onChange={(e) =>
              actualizarDatos("instalacion", { acimut: e.target.value })
            }
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo de Cubierta</InputLabel>
            <Select
              label="Tipo de cubierta"
              value={datosEstudio.instalacion.tipoCubierta}
              onChange={(e) =>
                actualizarDatos("instalacion", { tipoCubierta: e.target.value })
              }
            >
              <MenuItem value="terreno">Terreno</MenuItem>
              <MenuItem value="coplanal">Coplanal</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            size="small"
            label="Inclinación (°)"
            type="number"
            fullWidth
            value={datosEstudio.instalacion.inclinacion}
            onChange={(e) =>
              actualizarDatos("instalacion", { inclinacion: e.target.value })
            }
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo de Panel</InputLabel>
            <Select
              label="Tipo de panel"
              value={datosEstudio.instalacion.tipoPanel}
              onChange={(e) =>
                actualizarDatos("instalacion", { tipoPanel: e.target.value })
              }
            >
              <MenuItem value="panel1">Panel 1</MenuItem>
              <MenuItem value="panel2">Panel 2</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Sección 2: Consumo Cliente */}
      <Box sx={{ border: "1px solid gray", borderRadius: 2, padding: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Consumo Cliente
        </Typography>

        {/* Tarifa Actual */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Tarifa Actual
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            label="CUPS"
            fullWidth
            value={datosEstudio.consumo.cups}
            onChange={(e) =>
              actualizarDatos("consumo", { cups: e.target.value })
            }
          />
          <TextField
            size="small"
            label="Potencia Contratada (kW)"
            type="number"
            fullWidth
            value={datosEstudio.consumo.potenciaContratada}
            onChange={(e) =>
              actualizarDatos("consumo", { potenciaContratada: e.target.value })
            }
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Tipo de Tarifa</InputLabel>
            <Select
              label="Tipo de tarifa"
              value={datosEstudio.consumo.tipoTarifa}
              onChange={(e) =>
                actualizarDatos("consumo", { tipoTarifa: e.target.value })
              }
            >
              <MenuItem value="2.0">2.0</MenuItem>
              <MenuItem value="3.0">3.0</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Sección 3: Cálculo del Sistema */}
      <Box sx={{ border: "1px solid gray", borderRadius: 2, padding: 2 }}>
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
