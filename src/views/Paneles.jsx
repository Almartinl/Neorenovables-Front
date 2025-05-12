import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const initialRows = [
  //   {
  //     id: 1,
  //     nombre: "Panel NeoX400",
  //     marca: "NeoSolar",
  //     vmp: 40.2,
  //     imp: 9.9,
  //     tipo: "PERC",
  //     largo: 1722,
  //     ancho: 1134,
  //     alto: 35,
  //     color: "Negro",
  //     precio: 130,
  //   },
];

const columns = [
  { field: "nombre", headerName: "Nombre", editable: true, flex: 1 },
  { field: "marca", headerName: "Marca", editable: true, flex: 1 },
  {
    field: "vmp",
    headerName: "Vmp (V)",
    editable: true,
    flex: 1,
  },
  {
    field: "imp",
    headerName: "Imp (A)",
    editable: true,
    flex: 1,
  },
  {
    field: "tipo",
    headerName: "Tipo",
    editable: true,
    type: "singleSelect",
    valueOptions: ["PERC", "Bifacial", "Monocristalino", "Policristalino"],
    flex: 1,
  },
  {
    field: "largo",
    headerName: "Largo (mm)",
    editable: true,
    flex: 1,
  },
  {
    field: "ancho",
    headerName: "Ancho (mm)",
    type: "number",
    editable: true,
    flex: 1,
  },
  {
    field: "alto",
    headerName: "Alto (mm)",
    type: "number",
    editable: true,
    flex: 1,
  },
  { field: "color", headerName: "Color", editable: true, flex: 1 },
  {
    field: "precio",
    headerName: "Precio (€)",
    type: "number",
    editable: true,
    flex: 1,
  },
  {
    field: "acciones",
    type: "actions",
    headerName: "Acciones",
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon color="error" />}
        label="Eliminar"
        onClick={() => params.row.handleDelete(params.id)}
      />,
    ],
    flex: 1,
  },
];

export default function Paneles() {
  const [rows, setRows] = useState(initialRows);

  const handleRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleAdd = () => {
    const newId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows([
      ...rows,
      {
        id: newId,
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
        handleDelete,
      },
    ]);
  };

  const enhancedRows = rows.map((row) => ({ ...row, handleDelete }));

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
          onClick={handleAdd}
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
        }}
      >
        <DataGrid
          rows={enhancedRows}
          columns={columns}
          processRowUpdate={handleRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 800,
              fontSize: "1rem",
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
      </Box>
    </Box>
  );
}
