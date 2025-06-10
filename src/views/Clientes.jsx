import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function Clientes() {
  const [editableRowIds, setEditableRowIds] = useState(new Set());
  const [clientes, setClientes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowEditData, setRowEditData] = useState(null); // Datos de la fila a editar
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [clienteChangeAdd, setClienteChangeAdd] = useState(false);
  const [newClienteData, setNewClienteData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      editable: false,
      flex: 1,
    },
    {
      field: "apellidos",
      headerName: "Apellidos",
      editable: false,
      flex: 1,
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      editable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      editable: false,
      flex: 1.5,
    },
    {
      field: "direccion",
      headerName: "Dirección",
      editable: false,
      flex: 1.5,
    },
    {
      field: "acciones",
      type: "actions",
      headerName: "Acciones",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ModeEditIcon color="primary" />}
          label="Editar"
          onClick={() => handleOpenDialog(params.row)}
        />,
        // params.row && (
        //   <GridActionsCellItem
        //     icon={<PictureAsPdfIcon sx={{ color: "#f44336" }} />}
        //     disabled={params.row.ficha == null || params.row.ficha === ""}
        //     label="Ver PDF"
        //     onClick={() =>
        //       window.open(`https://almartindev.com/${params.row.ficha}`, "_blank")
        //     }
        //   />
        // ),
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Eliminar"
          disabled
          onClick={() => eliminarBateriaEnDB(params.id)}
        />,
      ],
      flex: 1,
    },
  ];

  useEffect(() => {
    async function fetchClientes() {
      const response = await fetch(`https://almartindev.com/api/clientes/`);
      const data = await response.json();

      setClientes(data);
    }
    fetchClientes();
  }, [clienteChangeAdd]);

  const eliminarBateriaEnDB = async (id) => {
    try {
      const response = await fetch(
        `https://almartindev.com/api/clientes/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Si activas auth
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el bateria");
      }
      if (response.ok) {
        setClienteChangeAdd(!clienteChangeAdd);
      }

      const result = await response.text(); // o .json() si devuelves un objeto
      console.log("✅ Bateria eliminado:", result);
    } catch (error) {
      console.error("❌ Error al eliminar el bateria:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setNewClienteData({
      nombre: "",
      apellidos: "",
      telefono: "",
      email: "",
      direccion: "",
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setClienteChangeAdd(!clienteChangeAdd);
  };

  const handleOpenDialog = (row) => {
    setRowEditData(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRowEditData(null);
  };

  const handleUpdateCliente = async (datos) => {
    const formData = new FormData();

    // Añade cada campo
    formData.append("nombre", datos.nombre);
    formData.append("apellidos", datos.apellidos);
    formData.append("telefono", datos.telefono);
    formData.append("email", datos.email);
    formData.append("direccion", datos.direccion);

    try {
      await fetch(`https://almartindev.com/api/clientes/update/${datos.id}`, {
        method: "PATCH",
        body: formData,
      }).then((res) => {
        if (res.status == 200) {
          setClienteChangeAdd(!clienteChangeAdd);
        }
      });

      // Si quieres actualizar el frontend aquí...
    } catch (error) {
      console.error("Error al actualizar la batería:", error);
    }
  };

  const handleRowUpdate = (newRow) => {
    const updatedRows = clientes.map((cliente) =>
      cliente.id === newRow.id ? newRow : cliente
    );
    setClientes(updatedRows);
    return newRow;
  };

  const handleDelete = (id) => {
    setClientes((prev) => prev.filter((row) => row.id !== id));
  };

  const handleRowActiveUpdate = (id) => {
    setEditableRowIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Desactivar edición
      } else {
        newSet.add(id); // Activar edición
      }
      return newSet;
    });
  };

  const enhancedRows = clientes.map((cliente) => ({
    ...cliente,
    handleRowActiveUpdate,
    handleDelete,
  }));

  return (
    <Box
      spacing={2}
      sx={{
        alignItems: "center",
        mx: 3,
        pb: 5,
        mt: { xs: 8, md: 0 },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          display: { xs: "flex" },
          width: "100%",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          maxWidth: { sm: "100%", md: "1700px" },
          pt: { xs: 3, sm: 4, md: 2 },
          pb: 0,
        }}
        spacing={2}
      >
        <Typography
          variant="h5"
          color="white"
          fontWeight={600}
          sx={{ textShadow: "0px 0px 20px rgb(0, 0, 0)" }}
        >
          Clientes
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenAddDialog}
        >
          Añadir Cliente
        </Button>
      </Stack>

      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%" },
          backgroundColor: "white",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.59)",
          borderRadius: 3,
          mt: 2,
          "& .row--editing": {
            backgroundColor: "rgba(255, 243, 205, 0.6)",
          },
        }}
      >
        <DataGrid
          rows={enhancedRows}
          columns={columns}
          getRowClassName={(params) =>
            editableRowIds.has(params.id) ? "row--editing" : ""
          }
          processRowUpdate={handleRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          disableRowSelectionOnClick
          density="compact"
          sx={{
            "& .MuiDataGrid-cell": {
              fontSize: "11px",
              borderColor: "#757575",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 800,
              fontSize: "12px",
            },
            "& .MuiDataGrid-columnHeaders": {
              "--DataGrid-containerBackground": "#d3f7ff",
            },
            "& .MuiDataGrid-footerContainer": {
              borderColor: "#757575",
              backgroundColor: "#d3f7ff",
            },

            borderRadius: 3,
            height: { md: "88.7vh", xs: "auto" },
          }}
          localeText={{
            columnMenuSortAsc: "Ordenar Ascendente",
            columnMenuSortDesc: "Ordenar Descendente",
            columnMenuUnsort: "Quitar Orden",
            columnMenuFilter: "Filtrar",
            columnMenuHideColumn: "Ocultar Columna",
            columnMenuShowColumns: "Mostrar Columnas",
            toolbarFilters: "Filtros",
            toolbarDensity: "Densidad",
            toolbarExport: "Exportar",
            toolbarColumns: "Columnas",
            footerRowSelected: (count) => `${count} fila(s) seleccionada(s)`,
            MuiTablePagination: {
              labelRowsPerPage: "Filas por página",
            },
          }}
        />
        {/* Dialog para editar Clientes */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Editar Batería</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Nombre", key: "nombre" },
                { label: "Apellidos", key: "apellidos" },
                {
                  label: "Teléfono",
                  key: "telefono",
                },
                { label: "Email", key: "email" },
                { label: "Dirección", key: "direccion" },
              ].map(({ label, key, type }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    type={type || "text"}
                    label={label}
                    value={rowEditData?.[key] || ""}
                    onChange={(e) =>
                      setRowEditData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={() => {
                handleUpdateCliente(rowEditData); // Le pasas también el nuevo archivo
                handleCloseDialog();
              }}
              variant="contained"
              color="warning"
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog para añadir Clientes */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Nombre", key: "nombre" },
                { label: "Apellidos", key: "apellidos" },
                {
                  label: "Teléfono",
                  key: "telefono",
                },
                { label: "Email", key: "email" },
                { label: "Dirección", key: "direccion" },
              ].map(({ label, key, type }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    required
                    type={type || "text"}
                    label={label}
                    value={newClienteData[key]}
                    onChange={(e) =>
                      setNewClienteData((prev) => ({
                        ...prev,
                        [key]:
                          type === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                      }))
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Cancelar</Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                // Enviar al backend
                fetch("https://almartindev.com/api/clientes/add_cliente", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newClienteData),
                })
                  .then((res) => {
                    if (res.status == 200) {
                      setClienteChangeAdd(!clienteChangeAdd);
                      handleCloseAddDialog();
                    }
                  })
                  .catch((err) => {
                    console.error("Error al subir cliente:", err);
                  });
              }}
            >
              Guardar Cliente
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
