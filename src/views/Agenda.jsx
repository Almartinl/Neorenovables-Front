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
  useTheme,
} from "@mui/material";

/** Helpers de fecha */
const toISO = (d) =>
  typeof d === "string" ? d.slice(0, 10) : d.toISOString().slice(0, 10);

const addDays = (iso, n) => {
  const dt = new Date(iso + "T00:00:00");
  dt.setDate(dt.getDate() + n);
  return toISO(dt);
};

const cmpIso = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** ¿Un día concreto está dentro del rango del evento (inclusive)? */
const dayInsideEvent = (dayISO, ev) => {
  const s = toISO(ev.start);
  const e = toISO(ev.end ?? ev.start);
  return cmpIso(s, dayISO) <= 0 && cmpIso(dayISO, e) <= 0;
};

/** ¿Los rangos [s1,e1] y [s2,e2] se pisan? (inclusive) */
const rangesOverlap = (s1, e1, s2, e2) =>
  !(cmpIso(e1, s2) < 0 || cmpIso(e2, s1) < 0);

/** Generador de IDs únicos simples */
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function Agenda() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Estado de eventos (almacenamos end INCLUSIVO)
  const [events, setEvents] = useState([
    {
      id: makeId(),
      title: "Instalación FV - Cliente 1",
      start: "2025-08-22",
      end: "2025-08-24",
      notes: "Acceso por calle lateral",
      presupuesto: "",
    },
  ]);

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
  });

  // Diálogo de detalle
  const [openView, setOpenView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const initialView = useMemo(
    () => (isMobile ? "listWeek" : "dayGridMonth"),
    [isMobile]
  );

  // Aplicar estilos a los eventos después del renderizado
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .fc-daygrid-event {
        background-color: #1976d2 !important;
        border-color: #1976d2 !important;
        color: white !important;
        font-size: 0.75rem;
        padding: 1px 2px;
        margin: 1px 0;
        border-radius: 4px;
      }
      .fc-daygrid-event:hover {
        opacity: 0.9;
        transform: scale(1.02);
        z-index: 1000;
      }
      .fc-daygrid-event-dot {
        display: none;
      }
      .fc-list-event-title {
        color: #1976d2 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  /** Click en día: si ese día está en rango de un evento -> ver, si no -> crear */
  const handleDateClick = (info) => {
    const dayISO = info.dateStr;
    console.log(info);
    const existing = events.find((ev) => dayInsideEvent(dayISO, ev));
    // if (existing) {
    //   console.log(existing);
    // setSelectedEvent(existing);
    // setOpenView(true);
    // } else {
    setDraft({
      title: "",
      start: dayISO,
      end: dayISO,
      notes: "",
      presupuesto: "",
    });
    setOpenCreate(true);
    // }
  };

  /** Selección de rango (semana/día) */
  const handleSelect = (info) => {
    const startISO = toISO(info.start);
    let endISO = toISO(info.end);
    if (info.allDay) endISO = addDays(endISO, -1); // convertir a inclusivo

    const conflict = events.some((ev) =>
      rangesOverlap(
        startISO,
        endISO,
        toISO(ev.start),
        toISO(ev.end ?? ev.start)
      )
    );
    if (conflict) {
      setSnack({
        open: true,
        message:
          "Ese rango pisa una instalación existente. Solo se permite 1 instalación por día.",
        severity: "error",
      });
      return;
    }

    setDraft({
      title: "",
      start: startISO,
      end: endISO,
      notes: "",
      presupuesto: "",
    });
    setOpenCreate(true);
  };

  /** Crear instalación */
  const handleCreate = () => {
    const s = toISO(draft.start);
    const e = toISO(draft.end || draft.start);

    if (!draft.title || !s) {
      setSnack({
        open: true,
        message: "Título y fecha de inicio son obligatorios.",
        severity: "warning",
      });
      return;
    }
    if (cmpIso(e, s) < 0) {
      setSnack({
        open: true,
        message: "La fecha fin no puede ser anterior a la de inicio.",
        severity: "warning",
      });
      return;
    }

    // const conflict = events.some((ev) =>
    //   rangesOverlap(s, e, toISO(ev.start), toISO(ev.end ?? ev.start))
    // );
    // if (conflict) {
    //   setSnack({
    //     open: true,
    //     message:
    //       "Ya hay una instalación en alguno de esos días. Máximo 1 por día.",
    //     severity: "error",
    //   });
    //   return;
    // }

    const nuevo = {
      id: makeId(),
      title: draft.presupuesto
        ? `${draft.title} (Pto: ${draft.presupuesto})`
        : draft.title,
      start: s,
      end: e,
      notes: draft.notes,
      presupuesto: draft.presupuesto || "",
    };

    setEvents((prev) => [...prev, nuevo]);
    setOpenCreate(false);
    setDraft({ title: "", start: "", end: "", notes: "", presupuesto: "" });
    setSnack({
      open: true,
      message: "✅ Instalación creada con éxito.",
      severity: "success",
    });
  };

  /** Borrar instalación */
  const handleDelete = () => {
    if (!selectedEvent) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
    setOpenView(false);
    setSelectedEvent(null);
    setSnack({
      open: true,
      message: "🗑️ Instalación eliminada.",
      severity: "success",
    });
  };

  const closeCreate = () => {
    setOpenCreate(false);
    setDraft({ title: "", start: "", end: "", notes: "", presupuesto: "" });
  };

  const closeView = () => {
    setOpenView(false);
    setSelectedEvent(null);
  };

  /** Click sobre evento */
  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    console.log(clickInfo);
    const endExclusive = ev.end ? toISO(ev.end) : toISO(ev.start);
    const endInclusive = addDays(endExclusive, 0);
    const obj = {
      id: ev.id,
      title: ev.title,
      start: toISO(ev.start),
      end: endExclusive,
      notes: ev.extendedProps?.notes || "",
      presupuesto: ev.extendedProps?.presupuesto || "",
    };
    setSelectedEvent(obj);
    setOpenView(true);
  };

  return (
    <Box sx={{ p: 2 }}>
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
          mt: isMobile ? 8 : 0,
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
            right: isMobile
              ? "listWeek,dayGridMonth"
              : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          height={isMobile ? "80vh" : "85vh"}
          locale={esLocale}
          firstDay={1}
          selectable
          selectMirror
          //   select={handleSelect}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events.map((e) => ({
            ...e,
            start: e.start,
            end: addDays(e.end, 2), // convertir a exclusivo
            allDay: true,
            display: "block",
            backgroundColor: "#1976d2",
            borderColor: "#1976d2",
            textColor: "white",
          }))}
          //   selectAllow={(selectInfo) => {
          //     const s = toISO(selectInfo.start);
          //     let e = toISO(selectInfo.end);
          //     if (selectInfo.allDay) e = addDays(e, -1);
          //     return !events.some((ev) =>
          //       rangesOverlap(s, e, toISO(ev.start), toISO(ev.end ?? ev.start))
          //     );
          //   }}
          dayMaxEvents={true}
          dayCellClassNames="fc-day-cell"
          eventDisplay="block"
          nowIndicator
        />
      </Box>

      {/* Diálogo: CREAR */}
      <Dialog open={openCreate} onClose={closeCreate} fullWidth maxWidth="sm">
        <DialogTitle>Nueva Instalación</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la instalación"
            size="small"
            fullWidth
            value={draft.title}
            onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Fecha de inicio"
            type="date"
            size="small"
            fullWidth
            value={draft.start}
            onChange={(e) => setDraft((p) => ({ ...p, start: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Fecha de fin (opcional)"
            type="date"
            size="small"
            fullWidth
            value={draft.end || draft.start}
            onChange={(e) => setDraft((p) => ({ ...p, end: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Número de presupuesto"
            size="small"
            fullWidth
            value={draft.presupuesto}
            onChange={(e) =>
              setDraft((p) => ({ ...p, presupuesto: e.target.value }))
            }
            placeholder="Ej: P-2025-088"
          />
          <TextField
            margin="dense"
            label="Notas adicionales"
            fullWidth
            multiline
            rows={3}
            value={draft.notes}
            onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Acceso, materiales, observaciones..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreate} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleCreate} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: VER / BORRAR */}
      <Dialog open={openView} onClose={closeView} fullWidth maxWidth="sm">
        <DialogTitle>Detalles de la Instalación</DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
            {selectedEvent?.title}
          </Typography>
          <Typography>
            <b>📅 Inicio:</b>{" "}
            {selectedEvent
              ? `${selectedEvent.start} → ${selectedEvent.end}`
              : "-"}
          </Typography>
          {selectedEvent?.presupuesto && (
            <Typography sx={{ mt: 1 }}>
              <b>📄 Presupuesto:</b> {selectedEvent.presupuesto}
            </Typography>
          )}
          {selectedEvent?.notes && (
            <Typography
              sx={{ mt: 2, p: 1, backgroundColor: "#f5f5f5", borderRadius: 1 }}
            >
              {selectedEvent.notes}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeView} color="inherit">
            Cerrar
          </Button>
          <Button onClick={handleDelete} color="error">
            Borrar
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
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ fontWeight: 500 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
