import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import ElectricalServicesRoundedIcon from "@mui/icons-material/ElectricalServicesRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import FormularioConsumo from "../components/FormularioConsumo";

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

// const actions = [
//   { icon: <SolarPowerRoundedIcon />, name: "Instalacion" },
//   { icon: <ElectricalServicesRoundedIcon />, name: "Consumo Cliente" },
//   { icon: <SummarizeRoundedIcon />, name: "Resumen" },
// ];

const steps = ["Instalación", "Consumo Cliente", "Resumen"];

export default function NuevoEstudio() {
  const [expanded, setExpanded] = React.useState("Sitio");
  const [zonas, setZonas] = React.useState([]);
  // const [pagina, setPagina] = React.useState("Instalacion");
  const [activeStep, setActiveStep] = React.useState(0);
  const [modo, setModo] = React.useState("simplificado");

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddZona = () => {
    setZonas([
      ...zonas,
      {
        ancho: "",
        largo: "",
        numPaneles: "",
        acimut: "",
        inclinacion: "",
        sombras: false,
      },
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
    <Box display="flex" flexDirection="column">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          pt: { xs: 10, sm: 11, md: 2 },
          justifyContent: "space-evenly",
        }}
      >
        {/* Selección de modo (Simplificado o Completo) */}
        <Box color="white" sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="h5">Selecciona el Modo de Estudio</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={modo}
              onChange={(e) => setModo(e.target.value)}
            >
              <FormControlLabel
                value="simplificado"
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label="Modo Simplificado"
              />
              <FormControlLabel
                value="completo"
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label="Modo Completo"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        {/* Stepper de navegación */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepConnector-line": { borderColor: "#ed6c02" }, // Líneas en color warning
            "& .MuiStepLabel-label": {
              color: "white", // Texto en blanco
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "white", // Texto del paso activo en blanco
              fontWeight: "bold",
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "white", // Texto del paso completado en blanco
            },
            "& .MuiStepIcon-root": {
              color: "lightgray", // Iconos en gris cuando están inactivos
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "#ed6c02", // Icono del paso activo en warning
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#ed6c02", // Iconos de pasos completados en warning
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {/* Contenido de cada página */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
        }}
      >
        {/*pagina de formulario de instalacion y mapa*/}
        {activeStep === 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "100vw", md: "35vw" },
                height: { md: "80vh" },
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
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
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
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {/* Tipo de Cubierta y Tipo de Panel */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <FormControl
                            variant="standard"
                            size="small"
                            fullWidth
                          >
                            <InputLabel>Tipo de Cubierta</InputLabel>
                            <Select>
                              <MenuItem value="terreno">Terreno</MenuItem>
                              <MenuItem value="coplanal">Coplanal</MenuItem>
                              <MenuItem value="cubierta">
                                Cubierta Plana
                              </MenuItem>
                              <MenuItem value="pergola">Pergola</MenuItem>
                              <MenuItem value="otros">Otros</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="standard"
                            size="small"
                            fullWidth
                          >
                            <InputLabel>Tipo de Panel</InputLabel>
                            <Select>
                              <MenuItem value="panel1">Panel 1</MenuItem>
                              <MenuItem value="panel2">Panel 2</MenuItem>
                              <MenuItem value="panel3">Panel 3</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Lista de Zonas */}
                        {zonas.map((zona, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="caption">
                              Zona:{index + 1}
                            </Typography>
                            <Box display="flex" flexDirection="row" gap={2}>
                              <TextField
                                type="number"
                                variant="standard"
                                size="small"
                                label="Acimut (°)"
                                value={zona.acimut}
                                onChange={(e) =>
                                  handleZonaChange(
                                    index,
                                    "acimut",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                              <TextField
                                type="number"
                                variant="standard"
                                size="small"
                                label="Inclinación (°)"
                                value={zona.inclinacion}
                                onChange={(e) =>
                                  handleZonaChange(
                                    index,
                                    "inclinacion",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </Box>
                            <Box display="flex" flexDirection="row" gap={2}>
                              <TextField
                                type="number"
                                variant="standard"
                                size="small"
                                label="Ancho (m)"
                                value={zona.ancho}
                                onChange={(e) =>
                                  handleZonaChange(
                                    index,
                                    "ancho",
                                    e.target.value
                                  )
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
                                  handleZonaChange(
                                    index,
                                    "largo",
                                    e.target.value
                                  )
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
                                  handleZonaChange(
                                    index,
                                    "numPaneles",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </Box>
                            <Box display="flex" flexDirection="row" gap={2}>
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
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <FormControl variant="standard" size="small" fullWidth>
                          <InputLabel>Tipo de Inversor</InputLabel>
                          <Select>
                            <MenuItem value="inversor1">Inversor 1</MenuItem>
                            <MenuItem value="inversor2">Inversor 2</MenuItem>
                            <MenuItem value="inversor3">Inversor 3</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          type="number"
                          variant="standard"
                          size="small"
                          label="Cantidad de inversores"
                          fullWidth
                        />
                      </Box>
                    )}

                    {panel === "Baterias" && (
                      <Box
                        component="form"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <FormControl variant="standard" size="small" fullWidth>
                          <InputLabel>Tipo de Bateria</InputLabel>
                          <Select>
                            <MenuItem value="bateria1">Bateria 1</MenuItem>
                            <MenuItem value="bateria2">Bateria 2</MenuItem>
                            <MenuItem value="bateria3">Bateria 3</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          type="number"
                          variant="standard"
                          size="small"
                          label="Cantidad de baterías"
                        />
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            <Box sx={{ display: "flex", width: { xs: "100vw", md: "65vw" } }}>
              <MapCustom />
            </Box>
          </>
        )}
        {/*pagina de formulario de consumo del cliente*/}
        {activeStep === 1 && <FormularioConsumo />}
        {/* <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1500, // Asegura que esté por encima del contenido
          }}
        >
          <SpeedDial
            ariaLabel="Acciones rápidas"
            icon={<MenuBookRoundedIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => setPagina(action.name)}
              />
            ))}
          </SpeedDial>
        </Box> */}
      </Box>
      {/* Botones de navegación */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        {activeStep !== 0 && (
          <Button
            sx={{ m: 2 }}
            variant="contained"
            color="warning"
            onClick={handleBack}
          >
            Atrás
          </Button>
        )}

        {activeStep !== 2 && (
          <Button
            variant="contained"
            color="warning"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            sx={{ m: 2 }}
          >
            {activeStep === steps.length - 2 ? "Finalizar" : "Siguiente"}
          </Button>
        )}
        {activeStep === 2 && (
          <Button variant="contained" color="warning" sx={{ m: 2 }}>
            Guardar Estudio
          </Button>
        )}
      </Box>
    </Box>
  );
}
