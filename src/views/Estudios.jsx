import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import Header from "../components/Header";
import CustomizedDataGrid from "../components/CustomizedDataGrid";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { rows } from "../internals/data/gridData";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

export default function Estudios() {
  const navigate = useNavigate();
  function Linkto(ruta) {
    navigate(ruta);
  }

  const columns = [
    {
      field: "ultimaModificacion",
      headerName: "Fecha",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 120,
    },
    { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 100 },
    {
      field: "direccion",
      headerName: "Direccion",
      headerAlign: "left",
      align: "left",
      flex: 1.5,
      minWidth: 80,
    },
    {
      field: "codigoPostal",
      headerName: "Codigo Postal",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "lugar",
      headerName: "Lugar",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "acciones",
      type: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ModeEditIcon color="primary" />}
          label="Editar"
          // onClick={() => handleOpenDialog(params.row)}
        />,
        params.row && (
          <GridActionsCellItem
            icon={<PictureAsPdfIcon sx={{ color: "#f44336" }} />}
            disabled={params.row.ficha == null || params.row.ficha === ""}
            label="Ver PDF"
            // onClick={() =>
            //   window.open(`http://localhost:3000/${params.row.ficha}`, "_blank")
            // }
          />
        ),
        <GridActionsCellItem
          icon={<DeleteRoundedIcon color="error" />}
          label="Eliminar"
          // onClick={() => eliminarPanelEnDB(params.id)}
        />,
      ],
      flex: 0.5,
    },
  ];

  return (
    <Stack
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
          Estudios
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() => Linkto("crear-estudio")}
        >
          Crear Nuevo Estudio
        </Button>
      </Stack>
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%" },
          backgroundColor: "white",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.59)",
          borderRadius: 3,
        }}
      >
        <Grid size={{ xs: 12 }}>
          <DataGrid
            rows={rows}
            columns={columns}
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
        </Grid>
      </Box>
    </Stack>
  );
}
