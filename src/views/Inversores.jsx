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

export default function Inversores() {
  const [editableRowIds, setEditableRowIds] = useState(new Set());
  const [inversores, setInversores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowEditData, setRowEditData] = useState(null); // Datos de la fila a editar
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [inversorChangeAdd, setInversorChangeAdd] = useState(false);
  const [newInversorData, setNewInversorData] = useState({
    nombre: "",
    marca: "",
    potencia: "",
    intensidad: "",
    nmppt: "",
    tensionmin: "",
    tensionmax: "",
    precio: "",
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
      field: "potencia",
      headerName: "Potencia salida (W)",
      editable: false,
      flex: 1.5,
    },
    {
      field: "intensidad",
      headerName: "Intensidad salida (A)",
      editable: false,
      flex: 1.5,
    },
    {
      field: "nmppt",
      headerName: "Nº Mppts",
      editable: false,
      flex: 1,
    },
    {
      field: "tensionmin",
      headerName: "Tensión mínima (VDC)",
      editable: false,
      flex: 1.5,
    },
    {
      field: "tensionmax",
      headerName: "Tensión máxima (VDC)",
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
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Eliminar"
          onClick={() => eliminarInversorEnDB(params.id)}
        />,
      ],
      flex: 1,
    },
  ];

  useEffect(() => {
    async function fetchInversores() {
      const response = await fetch(
        `http://localhost:3000/api/product/inversores`
      );
      const data = await response.json();
      setInversores(data);
    }
    fetchInversores();
  }, [inversorChangeAdd]);

  const actualizarInversorEnDB = async (inversorActualizado) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/inversores/${inversorActualizado.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Si activas auth
          },
          body: JSON.stringify(inversorActualizado),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el inversor");
      }
      if (response.ok) {
        setInversorChangeAdd(!inversorChangeAdd);
      }

      const result = await response.text(); // o .json() si devuelves un objeto
      console.log("✅ Inversor actualizado:", result);
    } catch (error) {
      console.error("❌ Error al actualizar el inversor:", error);
    }
  };

  const eliminarInversorEnDB = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/delete/inversores/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Si activas auth
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el inversor");
      }
      if (response.ok) {
        setInversorChangeAdd(!inversorChangeAdd);
      }

      const result = await response.text(); // o .json() si devuelves un objeto
      console.log("✅ Inversor eliminado:", result);
    } catch (error) {
      console.error("❌ Error al eliminar el inversor:", error);
    }
  };

  const crearInversorEnDB = async (inversorData) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/product/add_inversor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inversorData),
        }
      );
      const data = await res.text();
      console.log("✅ Inversor creado:", data);
    } catch (error) {
      console.error("❌ Error al crear inversor:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setNewInversorData({
      nombre: "",
      marca: "",
      potencia: "",
      intensidad: "",
      nmppt: "",
      tensionmin: "",
      tensionmax: "",
      precio: "",
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setInversorChangeAdd(!inversorChangeAdd);
  };

  const handleOpenDialog = (row) => {
    setRowEditData(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRowEditData(null);
  };

  const handleUpdateInversor = (updatedRow) => {
    setInversores((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    actualizarInversorEnDB(updatedRow); // Tu función fetch al backend
  };

  const handleRowUpdate = (newRow) => {
    const updatedRows = inversores.map((inversor) =>
      inversor.id === newRow.id ? newRow : inversor
    );
    setInversores(updatedRows);
    return newRow;
  };

  const handleDelete = (id) => {
    setInversores((prev) => prev.filter((row) => row.id !== id));
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

  const enhancedRows = inversores.map((inversor) => ({
    ...inversor,
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
          Inversores
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenAddDialog}
        >
          Añadir Inversor
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
        {/* Dialog para editar inversores */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Editar Inversor</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Nombre", key: "nombre" },
                { label: "Marca", key: "marca" },
                {
                  label: "Potencia de salida (W)",
                  key: "potencia",
                  type: "number",
                },
                {
                  label: "Intesidad de salida (A)",
                  key: "intensidad",
                  type: "number",
                },
                { label: "Nº de MPPT", key: "nmppt", type: "number" },
                {
                  label: "Tension Minima (VDC)",
                  key: "tensionmin",
                  type: "number",
                },
                {
                  label: "Tension Maxima (VDC)",
                  key: "tensionmax",
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={() => {
                handleUpdateInversor(rowEditData);
                handleCloseDialog();
              }}
              variant="contained"
              color="warning"
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog para añadir Inversores */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Añadir Nuevo Inversor</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                { label: "Nombre", key: "nombre" },
                { label: "Marca", key: "marca" },
                {
                  label: "Potencia de salida (W)",
                  key: "potencia",
                  type: "number",
                },
                {
                  label: "Intesidad de salida (A)",
                  key: "intensidad",
                  type: "number",
                },
                { label: "Nº de MPPT", key: "nmppt", type: "number" },
                {
                  label: "Tension Minima (VDC)",
                  key: "tensionmin",
                  type: "number",
                },
                {
                  label: "Tension Maxima (VDC)",
                  key: "tensionmax",
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
                    value={newInversorData[key]}
                    onChange={(e) =>
                      setNewInversorData((prev) => ({
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
                const newId = inversores.length
                  ? Math.max(...inversores.map((r) => r.id)) + 1
                  : 1;
                const newInversor = { id: newId, ...newInversorData };

                // Actualiza en el frontend
                setInversores((prev) => [...prev, newInversor]);

                // Enviar al backend
                crearInversorEnDB(newInversor);

                handleCloseAddDialog();
              }}
            >
              Guardar Inversor
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
