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

export default function Paneles() {
  const [editableRowIds, setEditableRowIds] = useState(new Set());
  const [paneles, setPaneles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowEditData, setRowEditData] = useState(null); // Datos de la fila a editar
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [panelChangeAdd, setPanelChangeAdd] = useState(false);
  const [newPanelData, setNewPanelData] = useState({
    nombre: "",
    marca: "",
    potencia: "",
    vmp: "",
    imp: "",
    tipo: "",
    largo: "",
    ancho: "",
    alto: "",
    color: "",
    precio: "",
    descripcion: "",
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
      flex: 1,
    },
    {
      field: "potencia",
      headerName: "Potencia (W)",
      editable: false,
      flex: 1,
    },
    {
      field: "vmp",
      headerName: "Vmp (V)",
      editable: false,
      flex: 1,
    },
    {
      field: "imp",
      headerName: "Imp (A)",
      editable: false,
      flex: 1,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      editable: false,
      flex: 1.5,
    },
    {
      field: "largo",
      headerName: "Largo (mm)",
      editable: false,
      flex: 1,
    },
    {
      field: "ancho",
      headerName: "Ancho (mm)",
      editable: false,
      flex: 1,
    },
    {
      field: "alto",
      headerName: "Alto (mm)",
      editable: false,
      flex: 1,
    },
    {
      field: "color",
      headerName: "Color",
      editable: false,
      flex: 1,
    },
    {
      field: "precio",
      headerName: "Precio (€)",
      editable: false,
      flex: 1,
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
              window.open(
                `https://almartindev.com/api${params.row.ficha}`,
                "_blank"
              )
            }
          />
        ),
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Eliminar"
          onClick={() => eliminarPanelEnDB(params.id)}
        />,
      ],
      flex: 1,
    },
  ];

  useEffect(() => {
    async function fetchPaneles() {
      const response = await fetch(
        `https://almartindev.com/api/product/paneles`
      );
      const data = await response.json();
      setPaneles(data);
    }
    fetchPaneles();
  }, [panelChangeAdd]);

  const eliminarPanelEnDB = async (id) => {
    try {
      const response = await fetch(
        `https://almartindev.com/api/product/delete/paneles/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Si activas auth
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el panel");
      }
      if (response.ok) {
        setPanelChangeAdd(!panelChangeAdd);
      }

      const result = await response.text(); // o .json() si devuelves un objeto
      console.log("✅ Panel eliminado:", result);
    } catch (error) {
      console.error("❌ Error al eliminar el panel:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setNewPanelData({
      nombre: "",
      marca: "",
      vmp: "",
      imp: "",
      tipo: "",
      largo: "",
      ancho: "",
      alto: "",
      color: "",
      precio: "",
      descripcion: "",
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setPanelChangeAdd(!panelChangeAdd);
  };

  const handleOpenDialog = (row) => {
    setRowEditData(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRowEditData(null);
  };

  const handleUpdatePanel = async (datos) => {
    const formData = new FormData();

    console.log(datos);

    // Añade cada campo
    formData.append("nombre", datos.nombre ?? "");
    formData.append("marca", datos.marca ?? "");
    formData.append("potencia", datos.potencia ?? "");
    formData.append("vmp", datos.vmp ?? "");
    formData.append("imp", datos.imp ?? "");
    formData.append("tipo", datos.tipo ?? "");
    formData.append("largo", datos.largo ?? "");
    formData.append("ancho", datos.ancho ?? "");
    formData.append("alto", datos.alto ?? "");
    formData.append("color", datos.color ?? "");
    formData.append("precio", datos.precio ?? "");
    formData.append("descripcion", datos.descripcion ?? "");

    // Solo si se ha subido un nuevo PDF
    if (datos.nuevaFicha) {
      formData.append("ficha", datos.nuevaFicha);
    }

    try {
      await fetch(`https://almartindev.com/api/product/paneles/${datos.id}`, {
        method: "PATCH",
        body: formData,
      }).then((res) => {
        if (res.status == 200) {
          setPanelChangeAdd(!panelChangeAdd);
        }
      });

      // Si quieres actualizar el frontend aquí...
    } catch (error) {
      console.error("Error al actualizar el panel:", error);
    }
  };

  const handleRowUpdate = (newRow) => {
    const updatedRows = paneles.map((panel) =>
      panel.id === newRow.id ? newRow : panel
    );
    setPaneles(updatedRows);
    return newRow;
  };

  const handleDelete = (id) => {
    setPaneles((prev) => prev.filter((row) => row.id !== id));
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

  const enhancedRows = paneles.map((panel) => ({
    ...panel,
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
          Paneles Solares
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenAddDialog}
        >
          Añadir Panel
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
          disableColumnMenu
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
        {/* Dialog para editar paneles */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Editar Panel</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Nombre", key: "nombre", size: 6, required: true },
                { label: "Marca", key: "marca", size: 6, required: true },
                { label: "Color", size: 2.25, key: "color" },
                { label: "Tipo", key: "tipo", size: 2.25 },
                {
                  label: "WP",
                  key: "potencia",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Vmp",
                  key: "vmp",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Imp (A)",
                  key: "imp",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Largo (mm)",
                  key: "largo",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Ancho (mm)",
                  key: "ancho",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Alto (mm)",
                  key: "alto",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Precio (€)",
                  key: "precio",
                  size: 1.5,
                  type: "number",
                },
              ].map(({ label, key, size, type, required }) => (
                <Grid item xs={12} sm={size} key={key}>
                  <TextField
                    fullWidth
                    required={required}
                    size="small"
                    type={type || "text"}
                    label={label}
                    value={rowEditData?.[key] || ""}
                    onChange={(e) =>
                      setRowEditData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
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
              ))}
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={4}
                  label="Descripción"
                  value={rowEditData?.["descripcion"] || ""}
                  onChange={(e) =>
                    setRowEditData((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
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
                handleUpdatePanel(rowEditData);
                handleCloseDialog();
              }}
              variant="contained"
              color="warning"
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog para añadir paneles */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Añadir Nuevo Panel</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Nombre", key: "nombre", size: 6, required: true },
                { label: "Marca", key: "marca", size: 6, required: true },
                { label: "Color", size: 2.25, key: "color" },
                { label: "Tipo", key: "tipo", size: 2.25 },
                {
                  label: "WP",
                  key: "potencia",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Vmp",
                  key: "vmp",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Imp (A)",
                  key: "imp",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Largo (mm)",
                  key: "largo",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Ancho (mm)",
                  key: "ancho",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Alto (mm)",
                  key: "alto",
                  size: 1.5,
                  type: "number",
                  required: true,
                },
                {
                  label: "Precio (€)",
                  key: "precio",
                  size: 1.5,
                  type: "number",
                },
              ].map(({ label, key, size, type, required }) => (
                <Grid item xs={12} sm={size} key={key}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    required={required}
                    type={type || "text"}
                    label={label}
                    value={newPanelData[key]}
                    onChange={(e) =>
                      setNewPanelData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
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
              ))}
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={4}
                  label="Descripción"
                  value={newPanelData["descripcion"]}
                  onChange={(e) =>
                    setNewPanelData((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
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
                      setNewPanelData((prev) => ({
                        ...prev,
                        ficha: e.target.files[0], // Guardamos el archivo
                      }))
                    }
                  />
                </Button>
                {newPanelData?.ficha && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Archivo seleccionado: {newPanelData.ficha.name}
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
                formData.append("nombre", newPanelData.nombre);
                formData.append("marca", newPanelData.marca);
                formData.append("potencia", newPanelData.potencia);
                formData.append("vmp", newPanelData.vmp);
                formData.append("imp", newPanelData.imp);
                formData.append("tipo", newPanelData.tipo);
                formData.append("largo", newPanelData.largo);
                formData.append("ancho", newPanelData.ancho);
                formData.append("alto", newPanelData.alto);
                formData.append("color", newPanelData.color);
                formData.append("precio", newPanelData.precio);
                formData.append("descripcion", newPanelData.descripcion);

                // Si hay PDF, lo añadimos también
                if (newPanelData.ficha) {
                  formData.append("ficha", newPanelData.ficha);
                }

                // Enviar al backend
                fetch("https://almartindev.com/api/product/add_panel", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => {
                    if (res.status == 200) {
                      setPanelChangeAdd(!panelChangeAdd);
                      handleCloseAddDialog();
                    }
                  })
                  .catch((err) => {
                    console.error("Error al subir panel:", err);
                  });
              }}
            >
              Guardar Panel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
