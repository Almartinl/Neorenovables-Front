/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
  Typography,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid2,
  Grid,
  IconButton,
} from "@mui/material";
import { useAuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import { color } from "framer-motion";

/** Helpers de fecha */
const toISO = (d) => {
  if (typeof d === "string") {
    // Aseguramos formato YYYY-MM-DD sin conversión de huso
    return d.split("T")[0]; // "2025-08-29T00:00:00" → "2025-08-29"
  }
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Sin pasar por toISOString()
};
const addDays = (iso, n) => {
  const [year, month, day] = iso.split("-").map(Number);
  const dt = new Date(year, month - 1, day); // Mes de 0-11
  dt.setDate(dt.getDate() + n);
  return toISO(dt);
};

export default function Agenda() {
  const { dataToken } = useAuthContext();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [openEdit, setOpenEdit] = useState(false); // Edición
  const [loading, setLoading] = useState(false);

  // Estado de eventos
  const [events, setEvents] = useState([]);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Diálogo de creación
  const [openCreate, setOpenCreate] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    start: "",
    end: "",
    notes: "",
    presupuesto: "",
    tecnicos: "",
    tipo: "Fotovoltaica",
    estado: "pendiente",
    contacto: "",
    telefono: "",
    direccion: "",
    poblacion: "",
    doc_url: "",
  });

  // Diálogo de edición
  const [openView, setOpenView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const initialView = useMemo(
    () => (isMobile ? "dayGridMonth" : "dayGridMonth"),
    [isMobile]
  );

  /** 🔁 Cargar eventos desde API */
  const loadEvents = () => {
    fetch("https://almartindev.com/api/agenda")
      .then((res) => res.json())
      .then((data) => {
        const citas = data.map((c) => ({
          id: c.id,
          title: c.cita,
          start: toISO(c.fecha_inicio),
          end: toISO(c.fecha_fin),
          notes: c.notas || "",
          presupuesto: c.presupuesto_id || "",
          tipo: c.tipo || "Fotovoltaica",
          estado: c.estado || "pendiente",
          tecnicos: c.tecnicos || "",
          contacto: c.contacto || "",
          telefono: c.telefono || "",
          direccion: c.direccion || "",
          poblacion: c.poblacion || "",
          doc_url: c.doc_url || "",
        }));
        setEvents(citas);
      })
      .catch((err) => {
        console.error("Error cargando agenda:", err);
        setSnack({
          open: true,
          message: "Error al cargar las citas.",
          severity: "error",
        });
      });
  };

  // Cargar al montar
  useEffect(() => {
    loadEvents();
  }, []);

  /** 🟢 Crear cita (POST) */
  const handleCreate = async () => {
    setLoading(true);
    const s = toISO(draft.start);
    const e = toISO(draft.end || draft.start);

    if (!draft.title || !s || !draft.poblacion) {
      setLoading(false);
      setSnack({
        open: true,
        message:
          "Título, poblacion, fecha de inicio y fecha de fin son obligatorios.",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();

    // Añadimos los campos
    formData.append("cita", draft.title);
    formData.append("fecha_inicio", s);
    formData.append("fecha_fin", e);
    formData.append("notas", draft.notes);
    formData.append("tipo", draft.tipo);
    formData.append("estado", draft.estado);
    formData.append("tecnicos", draft.tecnicos);
    formData.append("contacto", draft.contacto);
    formData.append("telefono", draft.telefono);
    formData.append("direccion", draft.direccion);
    formData.append("poblacion", draft.poblacion);

    // Si hay PDF, lo añadimos también
    if (draft.doc_url) {
      formData.append("doc_url", draft.doc_url);
    }

    // Enviar al backend
    fetch("https://almartindev.com/api/agenda/add_cita", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          setOpenCreate(false);
          setDraft({
            title: "",
            start: "",
            end: "",
            notes: "",
            presupuesto: "",
            tecnicos: "",
            tipo: "Fotovoltaica",
            estado: "pendiente",
            contacto: "",
            telefono: "",
            direccion: "",
            poblacion: "",
            doc_url: "",
          });

          setSnack({
            open: true,
            message: "✅ Cita creada.",
            severity: "success",
          });

          loadEvents();
        }
      })
      .catch((err) => {
        setLoading(false);
        setSnack({
          open: true,
          message: err.message,
          severity: "error",
        });
      });

    // 🔁 Recargar desde API
    loadEvents();
  };

  /** 🔴 Borrar cita (DELETE) */
  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://almartindev.com/api/agenda/delete/${selectedEvent.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Error al eliminar cita");

      setOpenEdit(false);
      setSelectedEvent(null);

      setSnack({
        open: true,
        message: "🗑️ Cita eliminada.",
        severity: "success",
      });

      // 🔁 Recargar
      loadEvents();
    } catch (err) {
      setSnack({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /** 🔵 Actualizar cita (PATCH) */
  const handleUpdate = async () => {
    if (!selectedEvent) return;
    setLoading(true);

    const formData = new FormData();

    // Añadimos los campos
    formData.append("cita", selectedEvent.title);
    formData.append("fecha_inicio", selectedEvent.start);
    formData.append("fecha_fin", selectedEvent.end);
    formData.append("notas", selectedEvent.notes);
    formData.append("tipo", selectedEvent.tipo);
    formData.append("estado", selectedEvent.estado);
    formData.append("tecnicos", selectedEvent.tecnicos);
    formData.append("contacto", selectedEvent.contacto);
    formData.append("telefono", selectedEvent.telefono);
    formData.append("direccion", selectedEvent.direccion);
    formData.append("poblacion", selectedEvent.poblacion);

    // Si hay PDF, lo añadimos también
    if (selectedEvent.doc_url) {
      formData.append("doc_url", selectedEvent.doc_url);
    }

    // Enviar al backend
    fetch(`https://almartindev.com/api/agenda/update/${selectedEvent.id}`, {
      method: "PATCH",
      body: formData,
    })
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          setOpenEdit(false);
          setSelectedEvent(null);
          setSnack({
            open: true,
            message: "✏️ Cita actualizada.",
            severity: "success",
          });

          loadEvents();
        }
      })
      .catch((err) => {
        setLoading(false);
        setSnack({
          open: true,
          message: err.message,
          severity: "error",
        });
      });

    loadEvents(); // Recargar
  };

  /** 🔹 Click sobre evento */
  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;

    // Extraemos fechas sin tocar el huso horario
    const startISO = toISO(ev.start);
    const endExclusive = ev.end ? toISO(ev.end) : startISO;
    const endInclusive = addDays(endExclusive, -1);

    setSelectedEvent({
      id: ev.id,
      title: ev.title.replace(/\s*\(.*?\)\s*$/, ""), // Elimina "(FV)", "(Eólico)", etc.
      start: startISO,
      end: endInclusive,
      notes: ev.extendedProps?.notes || "",
      presupuesto: ev.extendedProps?.presupuesto || "",
      tecnicos: ev.extendedProps?.tecnicos || "",
      estado: ev.extendedProps?.estado || "pendiente",
      tipo: ev.extendedProps?.tipo || "Fotovoltaica",
      contacto: ev.extendedProps?.contacto || "",
      telefono: ev.extendedProps?.telefono || "",
      direccion: ev.extendedProps?.direccion || "",
      poblacion: ev.extendedProps?.poblacion || "",
      doc_url: ev.extendedProps?.doc_url || "",
    });

    // 🔥 Mostramos SweetAlert con dos botones
    Swal.fire({
      title: "¿Qué quieres hacer?",
      text: ev.title,
      icon: "info",
      showCancelButton: false,
      showCloseButton: true,
      customClass: {
        popup: "swal2-custom-popup",
      },
      width: isMobile ? "90%" : "25%",
      background: "#f8f9fa",
      confirmButtonText: "🔍 Ver cita",
      confirmButtonColor: "#3085d6",
      showDenyButton: true,
      denyButtonText: "✏️ Modificar",
      denyButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Ver cita
        setOpenView(true);
      } else if (result.isDenied) {
        // Modificar cita
        setOpenEdit(true);
      }
    });
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
    /* Fila de días de la semana - fondo y texto */
    .fc-col-header-cell {
      background-color: #88888aff !important;
      color: white !important;
    }
    .fc-col-header-cell .fc-col-header-cell-cushion {
      color: white !important;
      text-decoration: none;
      font-weight: bold;
      padding: 3px 0;
      font-size: 14px;
    }
  `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const detailStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: 0.5,
    fontSize: "0.95rem",
    lineHeight: 1.5,
    "& > b": {
      minWidth: "70px",
      display: "inline-block",
    },
    span: {
      mt: 0.2,
    },
  };

  return (
    <Box mt={{ xs: 10, md: 0 }} sx={{ p: 2 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "white" }}
      >
        📅 Agenda de Instalaciones
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: 3,
          p: isMobile ? 1 : 2,
          overflow: "hidden",
        }}
      >
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView={initialView}
          headerToolbar={{
            center: "title",
            start: false,
            end: false,
          }}
          footerToolbar={{
            left: "prev,next today",
            right: "dayGridMonth,listWeek",
          }}
          height={isMobile ? "75vh" : "85vh"}
          locale={esLocale}
          firstDay={1}
          selectable
          dateClick={(info) => {
            setDraft({
              title: "",
              start: info.dateStr,
              end: info.dateStr,
              notes: "",
              presupuesto: "",
              tecnicos: "",
              tipo: "Fotovoltaica",
              estado: "pendiente",
              contacto: "",
              telefono: "",
              direccion: "",
              poblacion: "",
              doc_url: "",
            });
            setOpenCreate(true);
          }}
          eventClick={handleEventClick}
          events={events.map((e) => ({
            ...e,
            start: e.start,
            end: addDays(e.end, 1), // FullCalendar espera end exclusivo
            allDay: true,
            backgroundColor:
              e.tipo === "Fotovoltaica"
                ? "#0004ffff"
                : e.tipo === "Mantenimiento/Averia"
                ? "#ff0000ff"
                : e.tipo === "Cargador VE"
                ? "#388e3c"
                : e.tipo === "Electricidad"
                ? "#1976d2"
                : "#7b1fa2", // Otro
            borderColor: "transparent",
            textColor: "white",
            // ✅ Solo mostramos el tipo en la vista, NO en el título real
            extendedProps: { ...e },
            title: `${e.title} (${e.tipo})`,
          }))}
          eventContent={(info) => {
            // Aquí puedes acceder a info.event.extendedProps
            const poblacion =
              info.event.extendedProps.poblacion || "Sin población";
            const tipo = info.event.extendedProps.tipo || "";
            const view = info.view.type; // 'dayGridMonth', 'listWeek'

            const isListView = view === "listWeek";

            return (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: isListView ? "#000" : "white",
                  textAlign: "left",
                  width: "100%",
                  overflow: "hidden",
                  textTransform: "capitalize",
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingLeft: "2px",
                  alignItems: "center",
                }}
              >
                {poblacion} ({tipo})
              </div>
            );
          }}
          dayMaxEvents={true}
        />
      </Box>

      {/* Diálogo: CREAR */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Nueva Cita</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={3}>
              <FormControl
                size="small"
                fullWidth
                disabled={dataToken.role === "usuario"}
                margin="dense"
              >
                <InputLabel sx={{ fontSize: "12px" }}>Tipo de Cita</InputLabel>
                <Select
                  value={draft.tipo}
                  label="Tipo de Cita"
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, tipo: e.target.value }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem sx={{ fontSize: "12px" }} value="Fotovoltaica">
                    Fotovoltaica
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Cargador VE">
                    Cargadores VE
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Electricidad">
                    Electricidad
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px" }}
                    value="Mantenimiento/Averia"
                  >
                    Mantenimiento/Averia
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Otro">
                    Otro
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl
                size="small"
                fullWidth
                disabled={dataToken.role === "usuario"}
                margin="dense"
              >
                <InputLabel sx={{ fontSize: "12px" }}>Estado</InputLabel>
                <Select
                  value={draft.estado}
                  label="Estado"
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, estado: e.target.value }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem sx={{ fontSize: "12px" }} value="pendiente">
                    Pendiente
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="iniciado">
                    Iniciado
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="terminado">
                    Terminado
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Fecha inicio"
                type="date"
                fullWidth
                disabled={dataToken.role === "usuario"}
                value={draft.start}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, start: e.target.value }))
                }
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Fecha fin"
                type="date"
                fullWidth
                disabled={dataToken.role === "usuario"}
                value={draft.end || draft.start}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, end: e.target.value }))
                }
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Presupuesto"
                fullWidth
                disabled
                // disabled={dataToken.role === "usuario"}
                value={draft.presupuesto}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, presupuesto: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                size="small"
                margin="dense"
                label="Técnicos"
                fullWidth
                disabled={dataToken.role === "usuario"}
                value={draft.tecnicos}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, tecnicos: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Persona de contacto"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={draft.contacto}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, contacto: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Telefono de contacto"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={draft.telefono}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, telefono: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                size="small"
                margin="dense"
                label="Direccion Cita"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={draft.direccion}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, direccion: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                size="small"
                margin="dense"
                label="Poblacion Cita"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={draft.poblacion}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, poblacion: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
          </Grid>
          <TextField
            size="small"
            margin="dense"
            label="Título Cita"
            fullWidth
            disabled={dataToken.role === "usuario"}
            value={draft.title}
            onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
            InputProps={{
              style: {
                fontSize: "12px", // Tamaño del texto dentro del input
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: "12px", // Tamaño del texto del label
              },
            }}
          />

          <TextField
            size="small"
            margin="dense"
            label="Notas"
            fullWidth
            disabled={dataToken.role === "usuario"}
            multiline
            rows={4}
            value={draft.notes}
            onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
            InputProps={{
              style: {
                fontSize: "12px", // Tamaño del texto dentro del input
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: "12px", // Tamaño del texto del label
              },
            }}
          />
          <Grid container spacing={2} sx={{ mt: 1, alignItems: "center" }}>
            <Grid item xs={12} sm={3}>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="small"
                  disabled={dataToken.role === "usuario"}
                >
                  Subir documento (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        doc_url: e.target.files[0], // Guardamos el archivo
                      }))
                    }
                  />
                </Button>
                {draft?.doc_url && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Archivo seleccionado: {draft.doc_url.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={() => setOpenCreate(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            size="small"
            disabled={dataToken.role === "usuario" || loading}
            onClick={handleCreate}
            variant="contained"
            color="success"
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: VER CITA (solo lectura) */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            overflow: "hidden",
          },
        }}
      >
        {/* Cabecera con color por estado */}
        <Box
          sx={{
            backgroundColor:
              selectedEvent?.estado === "pendiente"
                ? "#f57c00"
                : selectedEvent?.estado === "iniciado"
                ? "#1976d2"
                : "#2e7d32",
            color: "white",
            py: 1.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            📋 Detalles de la Cita
          </Typography>
          <Box
            sx={{
              ml: "auto",
              backgroundColor: "rgba(255,255,255,0.2)",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: "0.8rem",
              textTransform: "capitalize",
            }}
          >
            {selectedEvent?.estado || "–"}
          </Box>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {/* Título principal */}
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{ mb: 2, wordBreak: "break-word" }}
          >
            {selectedEvent?.title || "Sin título"}
          </Typography>

          {/* Información principal en grid */}
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography sx={detailStyle}>
                  {/* <span role="img" aria-label="calendar">
                📅
              </span> */}
                  <b>Fecha:</b>
                  {selectedEvent?.start} → {selectedEvent?.end}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={detailStyle}>
                  {/* <span role="img" aria-label="type">
                🏷️
              </span> */}
                  <b>Tipo:</b> {selectedEvent?.tipo || "–"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={detailStyle}>
                  {/* <span role="img" aria-label="workers">
                👷
              </span> */}
                  <b>Técnicos:</b> {selectedEvent?.tecnicos || "–"}
                </Typography>
              </Grid>
            </Grid>

            {/* <Typography sx={detailStyle}>
              <span role="img" aria-label="budget">
                📄
              </span>
              <b>Presupuesto:</b> {selectedEvent?.presupuesto || "–"}
            </Typography> */}
            <Grid container spacing={2} mt={0.3}>
              <Grid item xs={12} sm={6}>
                <Typography sx={detailStyle}>
                  {/* <span role="img" aria-label="contact">
                👤
              </span> */}
                  <b>Contacto:</b> {selectedEvent?.contacto || "–"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={detailStyle}>
                  {/* <span role="img" aria-label="phone">
                📞
              </span> */}
                  <b>Teléfono:</b> {selectedEvent?.telefono || "–"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={detailStyle}>
                  {/* <span role="img" aria-label="location">
                📍
              </span> */}
                  <b>Dirección:</b> {selectedEvent?.direccion || "–"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={detailStyle}>
                  {/* <span role="img" aria-label="city">
                🏙️
              </span> */}
                  <b>Población:</b> {selectedEvent?.poblacion || "–"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Notas */}
          {selectedEvent?.notes && (
            <Box
              sx={{
                mt: 2,
                p: 2.5,
                backgroundColor: "#f9f9fb",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                📝 Notas
              </Typography>
              {selectedEvent.notes}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            px: 3.1,
            pb: 4,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Enlace al parte de trabajo */}
          {selectedEvent?.doc_url && selectedEvent?.doc_url !== " " ? (
            <Box sx={{ mt: 2, textAlign: "left" }}>
              <a
                href={`https://almartindev.com/api${selectedEvent?.doc_url}`}
                target="_blank"
                rel="noopener noreferrer"
                // style={{
                //   display: "flex",
                //   padding: "8px 16px",
                //   backgroundColor: "#2ac515ff",
                //   color: "white",
                //   textDecoration: "none",
                //   borderRadius: "20px",
                //   fontSize: "0.9rem",
                //   fontWeight: "medium",
                //   boxShadow: "0 2px 6px rgba(25,118,210,0.3)",
                //   transition: "all 0.2s",
                // }}
                // onMouseOver={(e) =>
                //   (e.target.style.backgroundColor = "#24a013ff")
                // }
                // onMouseOut={(e) =>
                //   (e.target.style.backgroundColor = "#2ac515ff")
                // }
              >
                Parte de Trabajo
              </a>
            </Box>
          ) : (
            <Box></Box>
          )}
          <Button
            onClick={() => setOpenView(false)}
            variant="contained"
            color="warning"
            size="small"
            sx={{
              textTransform: "none",
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: EDITAR */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Editar o Borrar Cita</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={3}>
              <FormControl
                fullWidth
                disabled={dataToken.role === "usuario"}
                margin="dense"
                size="small"
              >
                <InputLabel sx={{ fontSize: "12px" }}>Tipo de Cita</InputLabel>
                <Select
                  value={selectedEvent?.tipo || "Fotovoltaica"}
                  label="Tipo de Cita"
                  onChange={(e) =>
                    setSelectedEvent((p) => ({ ...p, tipo: e.target.value }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem sx={{ fontSize: "12px" }} value="Fotovoltaica">
                    Fotovoltaica
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Cargador VE">
                    Cargadores VE
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Electricidad">
                    Electricidad
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px" }}
                    value="Mantenimiento/Averia"
                  >
                    Mantenimiento/Averia
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Otro">
                    Otro
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl
                fullWidth
                disabled={dataToken.role === "usuario"}
                margin="dense"
                size="small"
              >
                <InputLabel sx={{ fontSize: "12px" }}>Estado</InputLabel>
                <Select
                  value={selectedEvent?.estado || "pendiente"}
                  label="Estado"
                  onChange={(e) =>
                    setSelectedEvent((p) => ({ ...p, estado: e.target.value }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem sx={{ fontSize: "12px" }} value="pendiente">
                    Pendiente
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="iniciado">
                    Iniciado
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="terminado">
                    Terminado
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Fecha inicio"
                type="date"
                fullWidth
                disabled={dataToken.role === "usuario"}
                value={selectedEvent?.start || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({ ...p, start: e.target.value }))
                }
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Fecha fin"
                type="date"
                fullWidth
                disabled={dataToken.role === "usuario"}
                value={selectedEvent?.end || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({ ...p, end: e.target.value }))
                }
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Presupuesto"
                fullWidth
                disabled
                // disabled={dataToken.role === "usuario"}
                value={selectedEvent?.presupuesto || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({
                    ...p,
                    presupuesto: e.target.value,
                  }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                size="small"
                margin="dense"
                label="Técnicos"
                fullWidth
                disabled={dataToken.role === "usuario"}
                value={selectedEvent?.tecnicos || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({ ...p, tecnicos: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Persona de contacto"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={selectedEvent?.contacto || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({ ...p, contacto: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Telefono de contacto"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={selectedEvent?.telefono || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({ ...p, telefono: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                size="small"
                margin="dense"
                label="Direccion Cita"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={selectedEvent?.direccion || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({ ...p, direccion: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                size="small"
                margin="dense"
                label="Poblacion Cita"
                fullWidth
                // disabled
                disabled={dataToken.role === "usuario"}
                value={selectedEvent?.poblacion || ""}
                onChange={(e) =>
                  setSelectedEvent((p) => ({ ...p, poblacion: e.target.value }))
                }
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
              />
            </Grid>
          </Grid>
          <TextField
            size="small"
            margin="dense"
            label="Título Cita"
            fullWidth
            disabled={dataToken.role === "usuario"}
            value={selectedEvent?.title || ""}
            onChange={(e) =>
              setSelectedEvent((p) => ({ ...p, title: e.target.value }))
            }
            InputProps={{
              style: {
                fontSize: "12px", // Tamaño del texto dentro del input
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: "12px", // Tamaño del texto del label
              },
            }}
          />

          <TextField
            size="small"
            margin="dense"
            label="Notas"
            fullWidth
            disabled={dataToken.role === "usuario"}
            multiline
            rows={4}
            value={selectedEvent?.notes || ""}
            onChange={(e) =>
              setSelectedEvent((p) => ({ ...p, notes: e.target.value }))
            }
            InputProps={{
              style: {
                fontSize: "12px", // Tamaño del texto dentro del input
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: "12px", // Tamaño del texto del label
              },
            }}
          />
          <Grid container spacing={2} sx={{ mt: 1, alignItems: "center" }}>
            <Grid item xs={12} sm={3}>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={dataToken.role === "usuario"}
                  size="small"
                >
                  nuevo documento (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) =>
                      setSelectedEvent((prev) => ({
                        ...prev,
                        doc_url: e.target.files[0], // Guardamos el archivo
                      }))
                    }
                  />
                </Button>
                {selectedEvent?.doc_url && selectedEvent?.doc_url !== " " ? (
                  <>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Archivo seleccionado:{" "}
                      {selectedEvent?.doc_url
                        ? selectedEvent.doc_url.name
                          ? selectedEvent.doc_url.name
                          : "documento existente"
                        : "documento existente"}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          setSelectedEvent((p) => ({ ...p, doc_url: " " }));
                          e.stopPropagation();
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Typography>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setOpenEdit(false)}>
            Cancelar
          </Button>
          <Button
            size="small"
            disabled={dataToken.role === "usuario" || loading}
            onClick={handleUpdate}
            variant="contained"
            color="success"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button
            size="small"
            disabled={dataToken.role === "usuario" || loading}
            onClick={() => {
              setOpenEdit(false); // Cierra el diálogo inmediatamente
              setTimeout(() => {
                Swal.fire({
                  title: "¿Seguro que quieres borrar esta cita?",
                  text: `"${selectedEvent?.title}"`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Sí, borrar",
                  cancelButtonText: "Cancelar",
                  confirmButtonColor: "#d33",
                  customClass: {
                    popup: "swal2-popup-higher",
                  },
                  // Aseguramos z-index
                  didOpen: () => {
                    document.querySelector(".swal2-popup").style.zIndex =
                      "1500";
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete();
                  }
                });
              }, 150); // Pequeño delay para asegurar el cierre
            }}
            color="error"
          >
            {loading ? "Borrando..." : "Borrar cita"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SnackBar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
