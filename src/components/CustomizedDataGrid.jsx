import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns, rows } from "../internals/data/gridData";

export default function CustomizedDataGrid() {
  return (
    <DataGrid
      // checkboxSelection
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      localeText={{
        columnMenuSortAsc: "Ordenar Ascendente",
        columnMenuSortDesc: "Ordenar Descendente",
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
