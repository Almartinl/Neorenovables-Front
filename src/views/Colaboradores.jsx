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

export default function Colaboradores() {
  const [editableRowIds, setEditableRowIds] = useState(new Set());
  const [colaborador, setColaborador] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowEditData, setRowEditData] = useState(null); // Datos de la fila a editar
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [colaboradorChangeAdd, setColaboradorChangeAdd] = useState(false);
  const [newColaboradorData, setNewColaboradorData] = useState({
    colaborador: "",
    logo: "",
  });

  const columns = [
    {
      field: "colaborador",
      headerName: "Colaborador",
      editable: false,
      flex: 1.5,
    },
    {
      field: "logo",
      headerName: "Logo",
      editable: false,
      flex: 1,
      renderCell: (params) => {
        if (params.row.logo) {
          return (
            <img
              src={`https://almartindev.com/api${params.row.logo}`}
              alt="Logo"
              style={{ width: "150px", height: "50px", objectFit: "contain" }}
            />
          );
        }
        return <Typography>No hay logo</Typography>;
      },
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
        //     label="Ver Logo"
        //     onClick={() =>
        //       window.open(`https://almartindev.com/${params.row.ficha}`, "_blank")
        //     }
        //   />
        // ),
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Eliminar"
          onClick={() => eliminarColaboradorEnDB(params.id)}
        />,
      ],
      flex: 1,
    },
  ];

  useEffect(() => {
    async function fetchBaterias() {
      const response = await fetch(`https://almartindev.com/api/colaborador`);
      const data = await response.json();

      setColaborador(data);
    }
    fetchBaterias();
  }, [colaboradorChangeAdd]);

  const eliminarColaboradorEnDB = async (id) => {
    try {
      const response = await fetch(
        `https://almartindev.com/api/colaborador/delete_colaborador/${id}`,
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
        setColaboradorChangeAdd(!colaboradorChangeAdd);
      }

      const result = await response.text(); // o .json() si devuelves un objeto
      console.log("✅ Bateria eliminado:", result);
    } catch (error) {
      console.error("❌ Error al eliminar el bateria:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setNewColaboradorData({
      colaborador: "",
      logo: "",
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setColaboradorChangeAdd(!colaboradorChangeAdd);
  };

  const handleOpenDialog = (row) => {
    setRowEditData(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRowEditData(null);
  };

  const handleUpdateColaborador = async (datos) => {
    const formData = new FormData();

    // Añade cada campo
    formData.append("colaborador", datos.colaborador);

    // Solo si se ha subido un nuevo PDF
    if (datos.logo) {
      formData.append("logo", datos.logo);
    }

    try {
      await fetch(
        `https://almartindev.com/api/colaborador/update_colaborador/${datos.id}`,
        {
          method: "PATCH",
          body: formData,
        }
      ).then((res) => {
        if (res.status == 200) {
          setColaboradorChangeAdd(!colaboradorChangeAdd);
        }
      });

      // Si quieres actualizar el frontend aquí...
    } catch (error) {
      console.error("Error al actualizar la batería:", error);
    }
  };

  const handleRowUpdate = (newRow) => {
    const updatedRows = colaborador.map((bateria) =>
      bateria.id === newRow.id ? newRow : bateria
    );
    setColaborador(updatedRows);
    return newRow;
  };

  const handleDelete = (id) => {
    setColaborador((prev) => prev.filter((row) => row.id !== id));
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

  const enhancedRows = colaborador.map((bateria) => ({
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
          Colaboradores
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenAddDialog}
        >
          Añadir Colaborador
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
          density="standard"
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
        {/* Dialog para editar baterias */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Editar Colaborador</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[{ label: "Colaborador", key: "colaborador" }].map(
                ({ label, key, type }) => (
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
                )
              )}

              {/* Campo para subir nuevo logo */}
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  Subir Nuevo Logo (Img)
                  <input
                    type="file"
                    hidden
                    accept="application/image" // Aceptamos cualquier imagen
                    onChange={(e) =>
                      setRowEditData((prev) => ({
                        ...prev,
                        logo: e.target.files[0], // guardamos el File
                      }))
                    }
                  />
                </Button>
                {rowEditData?.logo && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: "block", color: "gray" }}
                  >
                    Archivo seleccionado: {rowEditData.logo.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={() => {
                handleUpdateColaborador(rowEditData); // Le pasas también el nuevo archivo
                handleCloseDialog();
              }}
              variant="contained"
              color="warning"
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog para añadir Colaboradores */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Añadir Nuevo Colaborador</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[{ label: "Colaborador", key: "colaborador" }].map(
                ({ label, key, type }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      required
                      type={type || "text"}
                      label={label}
                      value={newColaboradorData[key]}
                      onChange={(e) =>
                        setNewColaboradorData((prev) => ({
                          ...prev,
                          [key]:
                            type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        }))
                      }
                    />
                  </Grid>
                )
              )}
              {/* Input para subir Logo*/}
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  Subir Logo (Img)
                  <input
                    type="file"
                    accept="application/image" // Aceptamos cualquier imagen
                    hidden
                    onChange={(e) =>
                      setNewColaboradorData((prev) => ({
                        ...prev,
                        logo: e.target.files[0], // Guardamos el archivo
                      }))
                    }
                  />
                </Button>
                {newColaboradorData?.logo && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Archivo seleccionado: {newColaboradorData.logo.name}
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
                formData.append("colaborador", newColaboradorData.colaborador);
                // Si hay logo, lo añadimos también
                if (newColaboradorData.logo) {
                  formData.append("logo", newColaboradorData.logo);
                }

                // Enviar al backend
                fetch(
                  "https://almartindev.com/api/colaborador/add_colaborador",
                  {
                    method: "POST",
                    body: formData,
                  }
                )
                  .then((res) => {
                    if (res.status == 200) {
                      setColaboradorChangeAdd(!colaboradorChangeAdd);
                      handleCloseAddDialog();
                    }
                  })
                  .catch((err) => {
                    console.error("Error al subir colaborador:", err);
                  });
              }}
            >
              Guardar Colaborador
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
