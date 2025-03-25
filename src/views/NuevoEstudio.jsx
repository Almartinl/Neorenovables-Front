import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import MapCustom from "../components/MapCustom";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function NuevoEstudio() {
  const [expanded, setExpanded] = React.useState("Sitio");
  const [zonas, setZonas] = React.useState([]);

  const handleAddZona = () => {
    setZonas([
      ...zonas,
      { ancho: "", largo: "", numPaneles: "", sombras: false },
    ]);
  };

  const handleZonaChange = (index, field, value) => {
    const newZonas = [...zonas];
    newZonas[index][field] = value;
    setZonas(newZonas);
  };

  const handleRemoveZona = (index) => {
    setZonas(zonas.filter((_, i) => i !== index));
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        pt: { xs: 10, sm: 11, md: 0 },
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100vw", md: "35vw" },
          height: { md: "100vh" },
        }}
      >
        {["Sitio", "Paneles", "Inversores", "Baterias"].map((panel) => (
          <Accordion
            key={panel}
            expanded={expanded === panel}
            onChange={handleChange(panel)}
            sx={{
              flex: expanded === panel ? 1 : "unset",
              transition: "flex 0.3s ease",
            }}
          >
            <AccordionSummary
              aria-controls={`${panel}-content`}
              id={`${panel}-header`}
            >
              <Typography component="span">{panel}</Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "column",
                height: { xs: "auto", md: "100%" },
                overflow: "auto",
                p: 2,
              }}
            >
              {panel === "Sitio" && (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      variant="standard"
                      size="small"
                      label="Nombre"
                      fullWidth
                    />
                    <TextField
                      variant="standard"
                      size="small"
                      label="Apellido"
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      sx={{
                        borderStartEndRadius: 0,
                        borderEndEndRadius: 0,
                        borderEndStartRadius: 10,
                        borderStartStartRadius: 10,
                        width: 150,
                        height: 40,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      Direccion
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderStartEndRadius: 10,
                        borderEndEndRadius: 10,
                        borderEndStartRadius: 0,
                        borderStartStartRadius: 0,
                        width: 150,
                        height: 40,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      Coordenadas
                    </Button>
                  </Box>
                  <TextField
                    variant="standard"
                    size="small"
                    label="Direccion"
                    fullWidth
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      variant="standard"
                      size="small"
                      label="Codigo Postal"
                      fullWidth
                    />
                    <TextField
                      variant="standard"
                      size="small"
                      label="Poblacion"
                      fullWidth
                    />
                  </Box>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel>Colaboradores</InputLabel>
                    <Select>
                      <MenuItem value={10}>Colaborador 1</MenuItem>
                      <MenuItem value={20}>Colaborador 2</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

              {panel === "Paneles" && (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {/* Acimut e Inclinación */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      type="number"
                      variant="standard"
                      size="small"
                      label="Acimut (°)"
                      fullWidth
                    />
                    <TextField
                      type="number"
                      variant="standard"
                      size="small"
                      label="Inclinación (°)"
                      fullWidth
                    />
                  </Box>

                  {/* Tipo de Cubierta y Tipo de Panel */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl variant="standard" size="small" fullWidth>
                      <InputLabel>Tipo de Cubierta</InputLabel>
                      <Select>
                        <MenuItem value="plana">Plana</MenuItem>
                        <MenuItem value="inclinada">Inclinada</MenuItem>
                        <MenuItem value="metalica">Metálica</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl variant="standard" size="small" fullWidth>
                      <InputLabel>Tipo de Panel</InputLabel>
                      <Select>
                        <MenuItem value="monocristalino">
                          Monocristalino
                        </MenuItem>
                        <MenuItem value="policristalino">
                          Policristalino
                        </MenuItem>
                        <MenuItem value="thinfilm">Thin-Film</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Lista de Zonas */}
                  {zonas.map((zona, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", gap: 2, alignItems: "center" }}
                    >
                      <TextField
                        type="number"
                        variant="standard"
                        size="small"
                        label="Ancho (m)"
                        value={zona.ancho}
                        onChange={(e) =>
                          handleZonaChange(index, "ancho", e.target.value)
                        }
                        fullWidth
                      />
                      <TextField
                        type="number"
                        variant="standard"
                        size="small"
                        label="Largo (m)"
                        value={zona.largo}
                        onChange={(e) =>
                          handleZonaChange(index, "largo", e.target.value)
                        }
                        fullWidth
                      />
                      <TextField
                        type="number"
                        variant="standard"
                        size="small"
                        label="Nº Paneles"
                        value={zona.numPaneles}
                        onChange={(e) =>
                          handleZonaChange(index, "numPaneles", e.target.value)
                        }
                        fullWidth
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={zona.sombras}
                            onChange={(e) =>
                              handleZonaChange(
                                index,
                                "sombras",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Sombras"
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveZona(index)}
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    </Box>
                  ))}

                  {/* Botón para Añadir Zona */}
                  <Button
                    variant="contained"
                    onClick={handleAddZona}
                    sx={{
                      borderRadius: 10,
                      width: "fit-content",
                      fontSize: 14,
                      fontWeight: 600,
                      alignSelf: "center",
                    }}
                  >
                    Añadir Zona
                  </Button>
                </Box>
              )}

              {panel === "Inversores" && (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <TextField label="Dirección" fullWidth />
                  <TextField label="Código Postal" fullWidth />
                  <Button variant="contained">Actualizar</Button>
                </Box>
              )}

              {panel === "Baterias" && (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Typography variant="h6">Configuración Avanzada</Typography>
                  <Switch label="Activar Modo Avanzado" />
                  <Button variant="contained">Guardar Configuración</Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Box sx={{ display: "flex", width: { xs: "100vw", md: "65vw" } }}>
        <MapCustom />
      </Box>
    </Box>
  );
}
