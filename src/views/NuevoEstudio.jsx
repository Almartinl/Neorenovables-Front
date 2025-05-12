/* eslint-disable no-unused-vars */
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
import Resumen from "../components/Resumen";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfInforme from "../components/PdfInforme";

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
    alignItems: "center",
    gap: 40,
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const steps = ["Instalación", "Consumo Cliente", "Resumen"];

export default function NuevoEstudio() {
  const [direccion, setDireccion] = React.useState("");
  const [poblacion, setPoblacion] = React.useState("");
  const [expanded, setExpanded] = React.useState("Sitio");
  const [zonas, setZonas] = React.useState([]);
  // const [pagina, setPagina] = React.useState("Instalacion");
  const [activeStep, setActiveStep] = React.useState(0);
  const [usarBaterias, setUsarBaterias] = React.useState(false);
  const [datosEstudio, setDatosEstudio] = React.useState({
    cliente: { nombre: "", apellido: "", ubicacion: "", colaborador: "" },
    instalacion: {
      acimut: "",
      tipoCubierta: "",
      inclinacion: "",
      tipoPanel: "",
    },
    consumo: { cups: "", potenciaContratada: "", tipoTarifa: "" },
    calculos: { potenciaInstalada: "", ahorro: "", precioPorVatio: "" },
  });
  const [estudio, setEstudio] = React.useState({
    instalacion: {
      sitio: {
        nombreCliente: "",
        apellidoCliente: "",
        direccion: "",
        poblacion: "",
        codigoPostal: "",
        coordenadas: { lat: null, lng: null },
        colaborador: "",
      },
      paneles: {
        tipoCubierta: "",
        tipoPanel: "",
        zonas: [], // Array vacío que se llenará con zonas
      },
      inversores: {
        tipoInversor: "",
        cantidad: "", // Valor por defecto 1
      },
      baterias: {
        tieneBaterias: false,
        tipoBateria: "",
        cantidad: "",
      },
    },
    consumo: {
      modo: "simplificado", // "simple" o "completo"
      datosComunes: {
        tipoTarifaActual: "",
        watiosContratados: 0,
        precioPotencia: 0,
        precioKW: 0,
        consumoAnualEstimado: 0,
      },
      datosCompletos: {
        consumoMensual: Array(12).fill(0), // 12 meses inicializados a 0
      },
      tarifaSalida: {
        tipoTarifa: "",
        precioPotencia: 0,
        precioKW: 0,
        watiosContratados: 0,
        precioExcedente: 0,
      },
    },
  });
  const [modoDireccion, setModoDireccion] = React.useState("direccion");

  const [potenciaPanel, setPotenciaPanel] = React.useState(0);
  const [potenciaGenerada, setPotenciaGenerada] = React.useState(0);

  const paneles = [
    {
      nombre: "Panel 440W",
      marca: "LONGi",
      potencia: 440,
      eficiencia: 97.5,
      tipo: "monocristalino",
      largo: 1.7,
      ancho: 1.0,
      alto: 0.04,
    },
    {
      nombre: "Panel 505W",
      marca: "LONGi",
      potencia: 505,
      eficiencia: 97.5,
      tipo: "monocristalino",
    },
    {
      nombre: "Panel 565W",
      marca: "LONGi",
      potencia: 565,
      eficiencia: 97.5,
      tipo: "monocristalino",
    },
  ];

  const inversores = [
    {
      nombre: "HUAWEI SUN2000-2KTL-L1",
      potencia: 2000, // en vatios (W)
      tipo: "Monofásico",
      numMPPT: 1, // Número de trackers MPPT
    },
    {
      nombre: "HUAWEI SUN2000-3KTL-L1",
      potencia: 3000,
      tipo: "Monofásico",
      numMPPT: 1,
    },
    {
      nombre: "HUAWEI SUN2000-5KTL-L1",
      potencia: 5000,
      tipo: "Monofásico",
      numMPPT: 2,
    },
  ];

  const baterias = [
    {
      nombre: "HUAWEI LUNA2000-5KWH",
      capacidad: 5, // kWh
      voltaje: 48, // V
      vidaUtil: 10, // años
      profundidadDescarga: 90, // %
    },
    {
      nombre: "HUAWEI LUNA2000-10KWH",
      capacidad: 10,
      voltaje: 48,
      vidaUtil: 10,
      profundidadDescarga: 90,
    },
    {
      nombre: "LG RESU10H",
      capacidad: 9.6,
      voltaje: 48,
      vidaUtil: 10,
      profundidadDescarga: 95,
    },
  ];

  const [wattsTotales, setWattsTotales] = React.useState(0);
  const radAnual = 1647; //kwh/kwp -- solo Malaga

  React.useEffect(() => {
    const total = zonas.reduce(
      (acum, zona) => acum + Number(zona.numPaneles || 0),
      0
    );
    setWattsTotales(total * potenciaPanel);
    setPotenciaGenerada((wattsTotales * radAnual) / 1000); //kwh/año
  }, [zonas, potenciaPanel, wattsTotales]);

  const actualizarDatos = (seccion, nuevosValores) => {
    setDatosEstudio((prev) => ({
      ...prev,
      [seccion]: { ...prev[seccion], ...nuevosValores },
    }));
  };

  const cambiarModoConsumo = (modo) => {
    setEstudio((prev) => ({
      ...prev,
      consumo: {
        ...prev.consumo,
        modo,
        // Resetear valores si cambiamos de completo a simple
        datosCompletos:
          modo === "simple"
            ? { consumoMensual: Array(12).fill(0) }
            : prev.consumo.datosCompletos,
      },
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  function handleBack() {
    setActiveStep((prevStep) => prevStep - 1);
  }

  // Función para actualizar los datos generales de paneles
  const handlePanelChange = (field, value) => {
    setEstudio((prev) => ({
      ...prev,
      instalacion: {
        ...prev.instalacion,
        paneles: {
          ...prev.instalacion.paneles,
          [field]: value,
        },
      },
    }));
  };

  // Función para actualizar una zona específica
  const handleZonaChange = (index, field, value) => {
    setEstudio((prev) => {
      const nuevasZonas = [...prev.instalacion.paneles.zonas];
      nuevasZonas[index] = {
        ...nuevasZonas[index],
        [field]: field === "sombras" ? value : Number(value),
      };

      return {
        ...prev,
        instalacion: {
          ...prev.instalacion,
          paneles: {
            ...prev.instalacion.paneles,
            zonas: nuevasZonas,
          },
        },
      };
    });
  };

  // Función para añadir nueva zona
  const handleAddZona = () => {
    setEstudio((prev) => ({
      ...prev,
      instalacion: {
        ...prev.instalacion,
        paneles: {
          ...prev.instalacion.paneles,
          zonas: [
            ...prev.instalacion.paneles.zonas,
            {
              acimut: "",
              inclinacion: "",
              ancho: "",
              largo: "",
              numPaneles: "",
              sombras: false,
            },
          ],
        },
      },
    }));
  };

  // Función para eliminar zona
  const handleRemoveZona = (index) => {
    setEstudio((prev) => ({
      ...prev,
      instalacion: {
        ...prev.instalacion,
        paneles: {
          ...prev.instalacion.paneles,
          zonas: prev.instalacion.paneles.zonas.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const handleChange = (panel) => (event, newExpanded) => {
    if (panel === "Baterias" && !usarBaterias) return;
    setExpanded(newExpanded ? panel : false);
  };

  const handleSitioChange = (field, value) => {
    setEstudio((prev) => ({
      ...prev,
      instalacion: {
        ...prev.instalacion,
        sitio: {
          ...prev.instalacion.sitio,
          [field]: value,
        },
      },
    }));
  };

  function enviarDireccion(e) {
    e.preventDefault();
    setDireccion(estudio.instalacion.sitio.direccion);
    setPoblacion(estudio.instalacion.sitio.poblacion);
  }

  const handleInversorChange = (field, value) => {
    setEstudio((prev) => ({
      ...prev,
      instalacion: {
        ...prev.instalacion,
        inversores: {
          ...prev.instalacion.inversores,
          [field]: value,
        },
      },
    }));
  };

  const handleModeloInversorChange = (nombreModelo) => {
    const inversorSeleccionado = inversores.find(
      (inv) => inv.nombre === nombreModelo
    );

    if (inversorSeleccionado) {
      setEstudio((prev) => ({
        ...prev,
        instalacion: {
          ...prev.instalacion,
          inversores: {
            ...prev.instalacion.inversores, // Mantenemos la cantidad existente
            nombre: inversorSeleccionado.nombre,
            potencia: inversorSeleccionado.potencia,
            tipo: inversorSeleccionado.tipo,
            numMPPT: inversorSeleccionado.numMPPT,
          },
        },
      }));
    }
  };

  // Función genérica para cambios
  const handleBateriaChange = (field, value) => {
    setEstudio((prev) => ({
      ...prev,
      instalacion: {
        ...prev.instalacion,
        baterias: {
          ...prev.instalacion.baterias,
          [field]:
            field === "cantidad" ? Math.max(0, parseInt(value) || 0) : value,
        },
      },
    }));
  };

  // Función para selección de modelo
  const handleModeloBateriaChange = (nombreBateria) => {
    const bateriaSeleccionada = baterias.find(
      (bat) => bat.nombre === nombreBateria
    );

    if (bateriaSeleccionada) {
      setEstudio((prev) => ({
        ...prev,
        instalacion: {
          ...prev.instalacion,
          baterias: {
            ...prev.instalacion.baterias, // Mantiene la cantidad existente
            nombre: bateriaSeleccionada.nombre,
            capacidad: bateriaSeleccionada.capacidad,
            voltaje: bateriaSeleccionada.voltaje,
            vidaUtil: bateriaSeleccionada.vidaUtil,
            profundidadDescarga: bateriaSeleccionada.profundidadDescarga,
          },
        },
      }));
    }
  };

  const handleUsarBateriasChange = (event) => {
    setUsarBaterias(event.target.checked);
    if (usarBaterias === true) {
      setEstudio((prev) => ({
        ...prev,
        instalacion: {
          ...prev.instalacion,
          baterias: {
            ...prev.instalacion.baterias,
            tieneBaterias: false,
            tipoBateria: "",
            cantidad: "",
            nombre: "",
            vidaUtil: "",
            voltaje: "",
            profundidadDescarga: "",
            capacidad: "",
          },
        },
      }));
    } else {
      setEstudio((prev) => ({
        ...prev,
        instalacion: {
          ...prev.instalacion,
          baterias: {
            ...prev.instalacion.baterias,
            tieneBaterias: true,
          },
        },
      }));
    }
  };

  console.log(estudio);
  return (
    <Box display="flex" flexDirection="column">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          pt: { xs: 10, sm: 11, md: 2 },
          px: 2,
          justifyContent: "space-between",
        }}
      >
        {/* Selección de modo (Simplificado o Completo) */}
        <Box color="white" sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="h5">Selecciona el Modo de Estudio</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={estudio.consumo.modo}
              onChange={(e) => cambiarModoConsumo(e.target.value)}
            >
              <FormControlLabel
                value="simplificado"
                disabled={activeStep != 0}
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                      "&.Mui-disabled": {
                        color: "#ffffff69",
                      },
                    }}
                  />
                }
                label="Modo Simplificado"
                sx={{
                  "& .MuiFormControlLabel-label.Mui-disabled": {
                    color: "#ffffff69",
                  },
                }}
              />
              <FormControlLabel
                value="completo"
                disabled={activeStep != 0}
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                      "&.Mui-disabled": {
                        color: "#ffffff69",
                      },
                    }}
                  />
                }
                label="Modo Completo"
                sx={{
                  "& .MuiFormControlLabel-label.Mui-disabled": {
                    color: "#ffffff69",
                  },
                }}
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="span">{panel}</Typography>
                    {/* Agregar Switch solo en Baterías */}
                    {panel === "Baterias" && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={usarBaterias}
                            onChange={(e) => handleUsarBateriasChange(e)}
                          />
                        }
                        label="Usar Baterías"
                      />
                    )}
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
                            value={estudio.instalacion.sitio.nombreCliente}
                            onChange={(e) =>
                              handleSitioChange("nombreCliente", e.target.value)
                            }
                          />
                          <TextField
                            variant="standard"
                            size="small"
                            label="Apellido"
                            fullWidth
                            value={estudio.instalacion.sitio.apellidoCliente}
                            onChange={(e) =>
                              handleSitioChange(
                                "apellidoCliente",
                                e.target.value
                              )
                            }
                          />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            variant={
                              modoDireccion === "direccion"
                                ? "contained"
                                : "outlined"
                            }
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
                            onClick={() => setModoDireccion("direccion")}
                          >
                            Direccion
                          </Button>
                          <Button
                            variant={
                              modoDireccion === "coordenadas"
                                ? "contained"
                                : "outlined"
                            }
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
                            onClick={() => setModoDireccion("coordenadas")}
                          >
                            Coordenadas
                          </Button>
                        </Box>
                        {modoDireccion === "direccion" ? (
                          <>
                            <TextField
                              variant="standard"
                              size="small"
                              label="Dirección"
                              fullWidth
                              value={estudio.instalacion.sitio.direccion}
                              onChange={(e) =>
                                handleSitioChange("direccion", e.target.value)
                              }
                            />
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <TextField
                                variant="standard"
                                size="small"
                                label="Código Postal"
                                value={
                                  estudio.instalacion.sitio.codigoPostal || ""
                                }
                                onChange={(e) =>
                                  handleSitioChange(
                                    "codigoPostal",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                              <TextField
                                variant="standard"
                                size="small"
                                label="Población"
                                value={
                                  estudio.instalacion.sitio.poblacion || ""
                                }
                                onChange={(e) =>
                                  handleSitioChange("poblacion", e.target.value)
                                }
                                fullWidth
                              />
                            </Box>
                          </>
                        ) : (
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                              variant="standard"
                              size="small"
                              label="Latitud"
                              type="number"
                              value={
                                estudio.instalacion.sitio.coordenadas?.lat || ""
                              }
                              onChange={(e) =>
                                handleSitioChange("coordenadas", {
                                  ...estudio.instalacion.sitio.coordenadas,
                                  lat: parseFloat(e.target.value),
                                })
                              }
                              fullWidth
                            />
                            <TextField
                              variant="standard"
                              size="small"
                              label="Longitud"
                              type="number"
                              value={
                                estudio.instalacion.sitio.coordenadas?.lng || ""
                              }
                              onChange={(e) =>
                                handleSitioChange("coordenadas", {
                                  ...estudio.instalacion.sitio.coordenadas,
                                  lng: parseFloat(e.target.value),
                                })
                              }
                              fullWidth
                            />
                          </Box>
                        )}
                        <FormControl variant="standard" size="small" fullWidth>
                          <InputLabel>Colaboradores</InputLabel>
                          <Select>
                            <MenuItem value={1}>Colaborador 1</MenuItem>
                            <MenuItem value={2}>Colaborador 2</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          sx={{
                            borderStartEndRadius: 10,
                            borderEndEndRadius: 10,
                            borderEndStartRadius: 10,
                            borderStartStartRadius: 10,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                          onClick={enviarDireccion}
                        >
                          Buscar Direccion
                        </Button>
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
                            <Select
                              value={estudio.instalacion.paneles.tipoCubierta}
                              onChange={(e) =>
                                handlePanelChange(
                                  "tipoCubierta",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="terreno">Terreno</MenuItem>
                              <MenuItem value="coplanar">Coplanal</MenuItem>
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
                            <Select
                              value={estudio.instalacion.paneles.tipoPanel}
                              onChange={(e) => {
                                const panelSeleccionado = paneles.find(
                                  (p) => p.nombre === e.target.value
                                );
                                handlePanelChange(
                                  "tipoPanel",
                                  panelSeleccionado.nombre
                                );
                                handlePanelChange(
                                  "potenciaPanel",
                                  panelSeleccionado.potencia
                                );
                              }}
                            >
                              {paneles.map((panel) => (
                                <MenuItem
                                  key={panel.nombre}
                                  value={panel.nombre}
                                >
                                  {panel.nombre} ({panel.potencia}W)
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Lista de Zonas */}
                        <Box sx={{ maxHeight: "38vh", overflowY: "auto" }}>
                          {estudio.instalacion.paneles.zonas.map(
                            (zona, index) => (
                              <Box
                                key={zona.id || index}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="caption">
                                  Zona: {index + 1}
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
                            )
                          )}
                        </Box>

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
                          <Select
                            value={estudio.instalacion.inversores?.nombre || ""}
                            onChange={(e) =>
                              handleModeloInversorChange(e.target.value)
                            }
                            label="Tipo de Inversor"
                          >
                            {inversores.map((inversor) => (
                              <MenuItem
                                key={inversor.nombre}
                                value={inversor.nombre}
                              >
                                {inversor.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          type="number"
                          variant="standard"
                          size="small"
                          label="Cantidad de inversores"
                          value={estudio.instalacion.inversores?.cantidad}
                          onChange={(e) =>
                            handleInversorChange("cantidad", e.target.value)
                          }
                          fullWidth
                          sx={{ mt: 2 }}
                        />
                      </Box>
                    )}

                    {panel === "Baterias" && usarBaterias && (
                      <Box
                        component="form"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <FormControl variant="standard" size="small" fullWidth>
                          <InputLabel>Tipo de Batería</InputLabel>
                          <Select
                            value={estudio.instalacion.baterias?.nombre || ""}
                            onChange={(e) =>
                              handleModeloBateriaChange(e.target.value)
                            }
                            label="Tipo de Batería"
                          >
                            {baterias.map((bateria) => (
                              <MenuItem
                                key={bateria.nombre}
                                value={bateria.nombre}
                              >
                                {bateria.nombre} ({bateria.capacidad}kWh)
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          type="number"
                          variant="standard"
                          size="small"
                          label="Cantidad de baterías"
                          value={estudio.instalacion.baterias?.cantidad || ""}
                          onChange={(e) =>
                            handleBateriaChange("cantidad", e.target.value)
                          }
                          fullWidth
                        />
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                width: { xs: "100vw", md: "55vw", xl: "65vw" },
              }}
            >
              <MapCustom direccion={direccion} poblacion={poblacion} />
            </Box>
          </>
        )}
        {/*pagina de formulario de consumo del cliente*/}
        {activeStep === 1 && (
          <FormularioConsumo estudio={estudio} setEstudio={setEstudio} />
        )}
        {/*pagina de resumen*/}
        {activeStep === 2 && (
          <Resumen
            datosEstudio={datosEstudio}
            actualizarDatos={actualizarDatos}
          />
        )}
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
          <Button
            variant="contained"
            color="warning"
            sx={{ m: 2 }}
            // onClick={handleNext}
          >
            Guardar Estudio
          </Button>
        )}
      </Box>
    </Box>
  );
}
