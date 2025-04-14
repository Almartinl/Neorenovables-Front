/* eslint-disable no-unused-vars */
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { rows } from "../internals/data/gridData";
import { IconButton, Tooltip } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfInforme from "./PdfInforme";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function CustomizedDataGrid() {
  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1.5, minWidth: 100 },
    {
      field: "direccion",
      headerName: "Direccion",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "codigoPostal",
      headerName: "Codigo Postal",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "lugar",
      headerName: "Lugar",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "ultimaModificacion",
      headerName: "Ultima Modificacion",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 100,
      renderCell: () => {
        const fila = {
          cliente: { nombre: "", apellido: "", ubicacion: "", colaborador: "" },
          instalacion: {
            acimut: "",
            tipoCubierta: "",
            inclinacion: "",
            tipoPanel: "",
          },
          consumo: { cups: "", potenciaContratada: "", tipoTarifa: "" },
          calculos: { potenciaInstalada: "", ahorro: "", precioPorVatio: "" },
        };

        return (
          <div
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Botón Ver */}
            <Tooltip title="Ver">
              <IconButton size="small" sx={{ color: "#1976d2" }}>
                <VisibilityRoundedIcon />
              </IconButton>
            </Tooltip>

            {/* Botón Descargar */}
            <Tooltip title="Descargar PDF">
              <PDFDownloadLink
                document={<PdfInforme datosEstudio={fila} />}
                fileName={`informe-${fila.nombre || "estudio"}.pdf`}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {({ loading }) => (
                  <IconButton size="small" sx={{ color: "#9c27b0" }}>
                    <DownloadRoundedIcon />
                  </IconButton>
                )}
              </PDFDownloadLink>
            </Tooltip>

            {/* Botón Eliminar */}
            <Tooltip title="Eliminar">
              <IconButton size="small" sx={{ color: "#d32f2f" }}>
                <DeleteRoundedIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return (
    <DataGrid
      // checkboxSelection
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      sx={{
        "& .MuiDataGrid-cell:focus": {
          outline: "none", // Elimina el borde azul al enfocar una celda
        },
        "& .MuiDataGrid-columnHeader:focus": {
          outline: "none", // Elimina el borde en los encabezados de columna
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 800,
          fontSize: "1rem",
        },
        borderRadius: 3,
        height: { md: "88.7vh", xs: "auto" },
      }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      density="compact"
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
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
