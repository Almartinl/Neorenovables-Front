import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
} from "@mui/material";

export default function AddCliente({ open, onClose }) {
  const [newClienteData, setNewClienteData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClienteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = async () => {
    // Validación básica
    if (!newClienteData.nombre || !newClienteData.apellidos) {
      alert("Por favor, rellena todos los campos obligatorios");
      return;
    }

    try {
      const res = await fetch(
        "https://almartindev.com/api/clientes/add_cliente",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClienteData),
        }
      );

      if (res.ok) {
        setNewClienteData({
          nombre: "",
          apellidos: "",
          telefono: "",
          email: "",
          direccion: "",
        });
        onClose(true);
      } else {
        const error = await res.text();
        console.error("Error en el servidor:", error);
        alert("Hubo un problema al guardar el cliente");
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const handleClose = () => {
    // Reiniciar formulario
    setNewClienteData({
      nombre: "",
      apellidos: "",
      telefono: "",
      email: "",
      direccion: "",
    });
    onClose(false); // 👈 false indica que se cerró sin guardar
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              name="nombre"
              value={newClienteData.nombre}
              onChange={handleChange}
              fullWidth
              size="small"
              required
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
              label="Apellidos"
              name="apellidos"
              value={newClienteData.apellidos}
              onChange={handleChange}
              fullWidth
              size="small"
              required
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
              label="Teléfono"
              name="telefono"
              value={newClienteData.telefono}
              onChange={(e) =>
                setNewClienteData((prev) => ({
                  ...prev,
                  telefono: e.target.value.replace(/\D/g, ""), // Solo números
                }))
              }
              fullWidth
              size="small"
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
              label="Email"
              name="email"
              type="email"
              value={newClienteData.email}
              onChange={handleChange}
              fullWidth
              size="small"
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
          <Grid item xs={12} sm={12}>
            <TextField
              label="Dirección"
              name="direccion"
              value={newClienteData.direccion}
              onChange={handleChange}
              fullWidth
              size="small"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={
            newClienteData.nombre == "" || newClienteData.apellidos == ""
          }
          onClick={handleGuardar}
        >
          Guardar Cliente
        </Button>
      </DialogActions>
    </Dialog>
  );
}
