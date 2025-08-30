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
} from "@mui/material";
import { useAuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";

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
    tipo: "FV",
    estado: "pendiente",
  });

  // Diálogo de edición
  const [openView, setOpenView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const initialView = useMemo(
    () => (isMobile ? "listWeek" : "dayGridMonth"),
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
          tipo: c.tipo || "FV",
          estado: c.estado || "pendiente",
          tecnicos: c.tecnicos || "",
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
    const s = toISO(draft.start);
    const e = toISO(draft.end || draft.start);

    if (!draft.title || !s) {
      setSnack({
        open: true,
        message: "Título, fecha de inicio y fecha de fin son obligatorios.",
        severity: "warning",
      });
      return;
    }

    try {
      const res = await fetch("https://almartindev.com/api/agenda/add_cita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presupuesto_id: draft.presupuesto || null,
          cita: draft.title,
          fecha_inicio: s,
          fecha_fin: e,
          notas: draft.notes,
          tipo: draft.tipo,
          estado: draft.estado,
          tecnicos: draft.tecnicos,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear cita");

      setOpenCreate(false);
      setDraft({
        title: "",
        start: "",
        end: "",
        notes: "",
        presupuesto: "",
        tecnicos: "",
        tipo: "FV",
        estado: "pendiente",
      });

      setSnack({
        open: true,
        message: "✅ Cita creada.",
        severity: "success",
      });

      // 🔁 Recargar desde API
      loadEvents();
    } catch (err) {
      setSnack({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  /** 🔴 Borrar cita (DELETE) */
  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
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
    }
  };

  /** 🔵 Actualizar cita (PATCH) */
  const handleUpdate = async () => {
    if (!selectedEvent) return;

    try {
      const res = await fetch(
        `https://almartindev.com/api/agenda/update/${selectedEvent.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cita: selectedEvent.title, // ✅ Solo el título limpio
            fecha_inicio: selectedEvent.start,
            fecha_fin: selectedEvent.end,
            notas: selectedEvent.notes,
            tipo: selectedEvent.tipo, // se guarda aparte
            estado: selectedEvent.estado,
            tecnicos: selectedEvent.tecnicos,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar");

      setOpenEdit(false);
      setSelectedEvent(null);

      setSnack({
        open: true,
        message: "✏️ Cita actualizada.",
        severity: "success",
      });

      loadEvents(); // Recargar
    } catch (err) {
      setSnack({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
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
      tipo: ev.extendedProps?.tipo || "FV",
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
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listWeek",
            // right: isMobile
            //   ? "listWeek,dayGridMonth"
            //   : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
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
              tipo: "FV",
              estado: "pendiente",
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
              e.tipo === "FV"
                ? "#0004ffff"
                : e.tipo === "Mantenimiento"
                ? "#ff0000ff"
                : e.tipo === "CVE"
                ? "#388e3c"
                : e.tipo === "Electricidad"
                ? "#1976d2"
                : "#7b1fa2", // Otro
            borderColor: "transparent",
            textColor: "white",
            // ✅ Solo mostramos el tipo en la vista, NO en el título real
            title: `${e.title} (${e.tipo})`,
          }))}
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
                  <MenuItem sx={{ fontSize: "12px" }} value="FV">
                    Fotovoltaica
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="CVE">
                    Cargadores VE
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Electricidad">
                    Electricidad
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Mantenimiento">
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
                disabled
                // disabled={dataToken.role === "usuario"}
                value={draft.notes}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, notes: e.target.value }))
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
                disabled
                // disabled={dataToken.role === "usuario"}
                value={draft.notes}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, notes: e.target.value }))
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
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                margin="dense"
                label="Direccion Cita"
                fullWidth
                disabled
                // disabled={dataToken.role === "usuario"}
                value={draft.notes}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, notes: e.target.value }))
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
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setOpenCreate(false)}>
            Cancelar
          </Button>
          <Button
            size="small"
            disabled={dataToken.role === "usuario"}
            onClick={handleCreate}
            variant="contained"
            color="success"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: VER CITA (solo lectura) */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>📋 Detalles de la Cita</DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            {selectedEvent?.title}
          </Typography>

          <Typography>
            <b>📅 Rango:</b> {selectedEvent?.start} → {selectedEvent?.end}
          </Typography>
          <Typography>
            <b>🏷️ Tipo:</b> {selectedEvent?.tipo}
          </Typography>
          <Typography>
            <b>⚙️ Estado:</b> {selectedEvent?.estado}
          </Typography>
          <Typography>
            <b>👷 Técnicos:</b> {selectedEvent?.tecnicos || "–"}
          </Typography>
          <Typography>
            <b>📄 Presupuesto:</b> {selectedEvent?.presupuesto || "–"}
          </Typography>

          {selectedEvent?.notes && (
            <Typography
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                fontSize: "0.95rem",
                whiteSpace: "pre-line",
              }}
            >
              {selectedEvent.notes}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenView(false)}
            variant="contained"
            color="primary"
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
                  value={selectedEvent?.tipo || "FV"}
                  label="Tipo de Cita"
                  onChange={(e) =>
                    setSelectedEvent((p) => ({ ...p, tipo: e.target.value }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem sx={{ fontSize: "12px" }} value="FV">
                    Fotovoltaica
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="CVE">
                    Cargadores VE
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Electricidad">
                    Electricidad
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Mantenimiento">
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
                disabled
                // disabled={dataToken.role === "usuario"}
                // value={selectedEvent?.title || ""}
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
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                margin="dense"
                label="Telefono de contacto"
                fullWidth
                disabled
                // disabled={dataToken.role === "usuario"}
                // value={selectedEvent?.title || ""}
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                margin="dense"
                label="Direccion Cita"
                fullWidth
                disabled
                // disabled={dataToken.role === "usuario"}
                // value={selectedEvent?.title || ""}
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
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setOpenEdit(false)}>
            Cancelar
          </Button>
          <Button
            size="small"
            disabled={dataToken.role === "usuario"}
            onClick={handleUpdate}
            variant="contained"
            color="success"
          >
            Guardar cambios
          </Button>
          <Button
            size="small"
            disabled={dataToken.role === "usuario"}
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
            Borrar Cita
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
