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

export default function Baterias() {
  const [editableRowIds, setEditableRowIds] = useState(new Set());
  const [baterias, setBaterias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowEditData, setRowEditData] = useState(null); // Datos de la fila a editar
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [bateriaChangeAdd, setBateriaChangeAdd] = useState(false);
  const [newBateriaData, setNewBateriaData] = useState({
    nombre: "",
    marca: "",
    capacidad: "",
    precio: "",
    ficha: "",
  });

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      editable: false,
      flex: 1.5,
    },
    {
      field: "marca",
      headerName: "Marca",
      editable: false,
      flex: 0.8,
    },
    {
      field: "capacidad",
      headerName: "Capacidad (WH)",
      editable: false,
      flex: 1.5,
    },
    {
      field: "precio",
      headerName: "Precio (€)",
      editable: false,
      flex: 0.8,
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
        params.row && (
          <GridActionsCellItem
            icon={<PictureAsPdfIcon sx={{ color: "#f44336" }} />}
            disabled={params.row.ficha == null || params.row.ficha === ""}
            label="Ver PDF"
            onClick={() =>
              window.open(`http://localhost:3000/${params.row.ficha}`, "_blank")
            }
          />
        ),
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Eliminar"
          onClick={() => eliminarBateriaEnDB(params.id)}
        />,
      ],
      flex: 1,
    },
  ];

  useEffect(() => {
    async function fetchBaterias() {
      const response = await fetch(
        `http://localhost:3000/api/product/baterias`
      );
      const data = await response.json();

      setBaterias(data);
    }
    fetchBaterias();
  }, [bateriaChangeAdd]);

  const eliminarBateriaEnDB = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/delete/baterias/${id}`,
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
        setBateriaChangeAdd(!bateriaChangeAdd);
      }

      const result = await response.text(); // o .json() si devuelves un objeto
      console.log("✅ Bateria eliminado:", result);
    } catch (error) {
      console.error("❌ Error al eliminar el bateria:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setNewBateriaData({
      nombre: "",
      marca: "",
      capacidad: "",
      precio: "",
      ficha: "",
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setBateriaChangeAdd(!bateriaChangeAdd);
  };

  const handleOpenDialog = (row) => {
    setRowEditData(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRowEditData(null);
  };

  const handleUpdateBateria = async (datos) => {
    const formData = new FormData();

    // Añade cada campo
    formData.append("nombre", datos.nombre);
    formData.append("marca", datos.marca);
    formData.append("capacidad", datos.capacidad);
    formData.append("precio", datos.precio);

    // Solo si se ha subido un nuevo PDF
    if (datos.nuevaFicha) {
      formData.append("ficha", datos.nuevaFicha);
    }

    try {
      await fetch(`http://localhost:3000/api/product/baterias/${datos.id}`, {
        method: "PATCH",
        body: formData,
      }).then((res) => {
        if (res.status == 200) {
          setBateriaChangeAdd(!bateriaChangeAdd);
        }
      });

      // Si quieres actualizar el frontend aquí...
    } catch (error) {
      console.error("Error al actualizar la batería:", error);
    }
  };

  const handleRowUpdate = (newRow) => {
    const updatedRows = baterias.map((bateria) =>
      bateria.id === newRow.id ? newRow : bateria
    );
    setBaterias(updatedRows);
    return newRow;
  };

  const handleDelete = (id) => {
    setBaterias((prev) => prev.filter((row) => row.id !== id));
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

  const enhancedRows = baterias.map((bateria) => ({
    ...bateria,
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
          Baterias
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenAddDialog}
        >
          Añadir Bateria
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
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 800,
              fontSize: "14px",
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
        {/* Dialog para editar baterias */}
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
                { label: "Marca", key: "marca" },
                {
                  label: "Capacidad de la Batería (WH)",
                  key: "capacidad",
                  type: "number",
                },
                { label: "Precio (€)", key: "precio", type: "number" },
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

              {/* Campo para subir nuevo PDF */}
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  Subir Nueva Ficha Técnica (PDF)
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) =>
                      setRowEditData((prev) => ({
                        ...prev,
                        nuevaFicha: e.target.files[0], // guardamos el File
                      }))
                    }
                  />
                </Button>
                {rowEditData?.nuevaFicha && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: "block", color: "gray" }}
                  >
                    Archivo seleccionado: {rowEditData.nuevaFicha.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={() => {
                handleUpdateBateria(rowEditData); // Le pasas también el nuevo archivo
                handleCloseDialog();
              }}
              variant="contained"
              color="warning"
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog para añadir Baterias */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Añadir Nueva Bateria</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Nombre", key: "nombre" },
                { label: "Marca", key: "marca" },
                {
                  label: "Capacidad de la Bateria (WH)",
                  key: "capacidad",
                  type: "number",
                },
                { label: "Precio (€)", key: "precio", type: "number" },
              ].map(({ label, key, type }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    required
                    type={type || "text"}
                    label={label}
                    value={newBateriaData[key]}
                    onChange={(e) =>
                      setNewBateriaData((prev) => ({
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
              {/* Input para subir PDF */}
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  Subir ficha técnica (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) =>
                      setNewBateriaData((prev) => ({
                        ...prev,
                        ficha: e.target.files[0], // Guardamos el archivo
                      }))
                    }
                  />
                </Button>
                {newBateriaData?.ficha && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Archivo seleccionado: {newBateriaData.ficha.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Cancelar</Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                const formData = new FormData();

                // Añadimos los campos
                formData.append("nombre", newBateriaData.nombre);
                formData.append("marca", newBateriaData.marca);
                formData.append("capacidad", newBateriaData.capacidad);
                formData.append("precio", newBateriaData.precio);

                // Si hay PDF, lo añadimos también
                if (newBateriaData.ficha) {
                  formData.append("ficha", newBateriaData.ficha);
                }

                // Enviar al backend
                fetch("http://localhost:3000/api/product/add_bateria", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => {
                    if (res.status == 200) {
                      setBateriaChangeAdd(!bateriaChangeAdd);
                      handleCloseAddDialog();
                    }
                  })
                  .catch((err) => {
                    console.error("Error al subir batería:", err);
                  });
              }}
            >
              Guardar Batería
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
