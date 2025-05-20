/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function Presupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [reload, setReload] = useState(false);
  const [productos, setProductos] = useState({
    paneles: [],
    inversores: [],
    baterias: [],
  });

  const [nuevoPresupuesto, setNuevoPresupuesto] = useState({
    clienteId: "",
    nombreCliente: "",
    direccionInstalacion: "",
    poblacionInstalacion: "",
    iva: "",
    fecha: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD
    num_presupuesto: "",
    productos: [],
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    categoria: "",
    productoId: "",
    nombreManual: "",
    precio: "",
    cantidad: 1,
  });

  useEffect(() => {
    const fetchPresupuestos = async () => {
      const res = await fetch("http://localhost:3000/api/presupuestos/");
      const data = await res.json();
      setPresupuestos(data);
    };

    fetchPresupuestos();
    fetchClientes();
    fetchProductos();
  }, [reload]);

  const generarNumeroPresupuesto = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes con dos dígitos
    const prefix = `${year}${month}`;

    // Filtra presupuestos del mismo mes y año
    const presupuestosDelMes = presupuestos.filter((p) => {
      const fechaPresupuesto = new Date(p.fecha);
      return (
        fechaPresupuesto.getFullYear() === year &&
        String(fechaPresupuesto.getMonth() + 1).padStart(2, "0") === month
      );
    });

    // Encuentra el último número usado (por ejemplo, 202504003)
    let maxNum = 0;
    presupuestosDelMes.forEach((p) => {
      if (p.num_presupuesto?.startsWith(prefix)) {
        const num = parseInt(p.num_presupuesto.slice(6), 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });

    const siguienteNum = maxNum + 1;
    return `${prefix}${String(siguienteNum).padStart(3, "0")}`;
  };

  const fetchClientes = async () => {
    const res = await fetch("http://localhost:3000/api/clientes/");
    const data = await res.json();
    setClientes(data);
  };

  function resetFormulario() {
    setNuevoPresupuesto({
      clienteId: "",
      nombreCliente: "",
      direccionInstalacion: "",
      poblacionInstalacion: "",
      iva: "",
      fecha: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD
      productos: [],
    });
    setProductoSeleccionado({
      categoria: "",
      productoId: "",
      nombreManual: "",
      precio: "",
      cantidad: 1,
    });
    setOpenDialog(false);
    setReload(!reload);
  }

  const fetchProductos = async () => {
    const paneles = await (
      await fetch("http://localhost:3000/api/product/paneles")
    ).json();
    const inversores = await (
      await fetch("http://localhost:3000/api/product/inversores")
    ).json();
    const baterias = await (
      await fetch("http://localhost:3000/api/product/baterias")
    ).json();

    setProductos({ paneles, inversores, baterias });
  };

  const handleAddProducto = () => {
    if (
      productoSeleccionado.categoria &&
      (productoSeleccionado.nombreManual || productoSeleccionado.productoId)
    ) {
      const nombre =
        productoSeleccionado.productoId !== ""
          ? obtenerNombrePorId(
              productoSeleccionado.categoria,
              productoSeleccionado.productoId
            )
          : productoSeleccionado.nombreManual;

      // Asigna el tipo_producto según la categoría
      const tipoProductoMap = {
        paneles: "panel",
        inversores: "inversor",
        baterias: "bateria",
        manual: "manual",
      };

      const tipo_producto = tipoProductoMap[productoSeleccionado.categoria];

      setNuevoPresupuesto((prev) => ({
        ...prev,
        productos: [
          ...prev.productos,
          {
            ...productoSeleccionado,
            id: Date.now(),
            nombre,
            tipo_producto, // 👈 Añadimos el tipo_producto
          },
        ],
      }));

      setProductoSeleccionado({
        categoria: "",
        productoId: "",
        nombreManual: "",
        precio: "",
        cantidad: 1,
      });
    }
  };

  const obtenerNombrePorId = (categoria, id) => {
    const item = productos[categoria]?.find((p) => p.id === parseInt(id));
    return item?.nombre || "";
  };

  const eliminarItem = (id) => {
    setNuevoPresupuesto((prev) => ({
      ...prev,
      productos: prev.productos.filter((item) => item.id !== id),
    }));
  };

  const handleGuardarPresupuesto = async () => {
    try {
      const num_presupuesto = generarNumeroPresupuesto();
      const {
        clienteId,
        nombreCliente,
        direccionInstalacion,
        poblacionInstalacion,
        iva,
        fecha,
        productos,
      } = nuevoPresupuesto;

      // Calcular total bruto
      const totalBruto = productos.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );

      // Crear objeto presupuesto para el backend
      const presupuestoData = {
        num_presupuesto: num_presupuesto,
        cliente_id: clienteId || null,
        nombre_cliente_manual: nombreCliente || null,
        direccion_instalacion: direccionInstalacion || null,
        poblacion_instalacion: poblacionInstalacion || null,
        iva: (totalBruto * iva) / 100,
        iva_porcentaje: iva,
        total_bruto: totalBruto,
        total: totalBruto + (totalBruto * iva) / 100,
        fecha: fecha,
      };

      // Convertir productos en items con formato esperado
      const items = productos.map((p) => ({
        tipo_producto: p.tipo_producto, // panel, inversor, bateria, manual
        producto_id: p.productoId ? parseInt(p.productoId) : null,
        nombre: p.nombre,
        descripcion: "", // si no usas descripción, puedes dejar vacío o eliminar este campo
        cantidad: parseInt(p.cantidad),
        precio_unitario: parseFloat(p.precio),
        total: parseFloat(p.precio) * parseInt(p.cantidad),
      }));

      // Llamada al backend
      const res = await fetch(
        "http://localhost:3000/api/presupuestos/add_presupuesto",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ presupuesto: presupuestoData, items }),
        }
      );

      if (res.ok) {
        resetFormulario();
      }
    } catch (error) {
      console.error("Error al guardar el presupuesto:", error);
    }
  };

  const calcularSubtotal = (items) => {
    return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  };

  const calcularTotalConIVA = (presupuesto) => {
    const subtotal = calcularSubtotal(presupuesto.productos);
    const iva = presupuesto.iva || 0;
    return subtotal + subtotal * (iva / 100);
  };

  const columns = [
    { field: "num_presupuesto", headerName: "Nº Presupuesto", flex: 1 },
    { field: "nombre", headerName: "Nombre Cliente", flex: 1 },
    { field: "direccion_instalacion", headerName: "Dirección", flex: 1.5 },
    { field: "poblacion_instalacion", headerName: "Población", flex: 1 },
    { field: "fecha", headerName: "Fecha", flex: 1 },
    { field: "total_bruto", headerName: "Total Bruto (€)", flex: 1 },
    { field: "iva", headerName: "IVA (€)", flex: 1 },
    { field: "total", headerName: "Total (€)", flex: 1 },
    {
      field: "acciones",
      type: "actions",
      headerName: "Acciones",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<PictureAsPdfIcon sx={{ color: "#f44336" }} />}
          label="Ver PDF"
          onClick={() =>
            window.open(`/api/pdf/presupuesto/${params.id}`, "_blank")
          }
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Eliminar"
          onClick={() => eliminarPresupuesto(params.id)}
        />,
      ],
      flex: 1,
    },
  ];

  const eliminarPresupuesto = async (id) => {
    await fetch(`http://localhost:3000/api/product/delete/presupuesto/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <Box
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
          Presupuestos
        </Typography>
        <Button
          variant="contained"
          color="warning"
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpenDialog(true)}
          size="small"
        >
          Crear Presupuesto
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
          rows={presupuestos}
          columns={columns}
          getRowId={(row) => row.id}
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
      </Box>

      {/* Dialog de creación */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Nuevo Presupuesto</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Cliente existente</InputLabel>
                <Select
                  value={nuevoPresupuesto.clienteId}
                  label="Cliente existente"
                  onChange={(e) =>
                    setNuevoPresupuesto((prev) => ({
                      ...prev,
                      clienteId: e.target.value,
                    }))
                  }
                >
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Nombre Cliente (manual)"
                value={nuevoPresupuesto.nombreCliente}
                onChange={(e) =>
                  setNuevoPresupuesto((prev) => ({
                    ...prev,
                    nombreCliente: e.target.value,
                  }))
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Dirección Instalación"
                value={nuevoPresupuesto.direccionInstalacion}
                onChange={(e) =>
                  setNuevoPresupuesto((prev) => ({
                    ...prev,
                    direccionInstalacion: e.target.value,
                  }))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Población Instalación"
                value={nuevoPresupuesto.poblacionInstalacion}
                onChange={(e) =>
                  setNuevoPresupuesto((prev) => ({
                    ...prev,
                    poblacionInstalacion: e.target.value,
                  }))
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                size="small"
                label="Fecha"
                type="date"
                value={nuevoPresupuesto.fecha}
                onChange={(e) =>
                  setNuevoPresupuesto((prev) => ({
                    ...prev,
                    fecha: e.target.value,
                  }))
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel>IVA</InputLabel>
                <Select
                  value={nuevoPresupuesto.iva}
                  label="IVA"
                  onChange={(e) =>
                    setNuevoPresupuesto((prev) => ({
                      ...prev,
                      iva: parseInt(e.target.value),
                    }))
                  }
                >
                  <MenuItem value={10}>10%</MenuItem>
                  <MenuItem value={21}>21%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Añadir Producto al Presupuesto
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={productoSeleccionado.categoria}
                  label="Categoría"
                  onChange={(e) =>
                    setProductoSeleccionado((prev) => ({
                      ...prev,
                      categoria: e.target.value,
                      productoId: "",
                      nombreManual: "",
                      precio: "",
                      cantidad: 1,
                    }))
                  }
                >
                  <MenuItem value="paneles">Panel Solar</MenuItem>
                  <MenuItem value="inversores">Inversor</MenuItem>
                  <MenuItem value="baterias">Batería</MenuItem>
                  <MenuItem value="manual">Otro (manual)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {productoSeleccionado.categoria &&
              productoSeleccionado.categoria !== "manual" && (
                <Grid item xs={12} sm={4}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Producto</InputLabel>
                    <Select
                      value={productoSeleccionado.productoId}
                      label="Producto"
                      onChange={(e) =>
                        setProductoSeleccionado((prev) => ({
                          ...prev,
                          productoId: e.target.value,
                          precio: productos[productoSeleccionado.categoria]
                            ?.find((p) => p.id === parseInt(e.target.value))
                            ?.precio.toString(),
                        }))
                      }
                    >
                      {productos[productoSeleccionado.categoria]?.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

            {productoSeleccionado.categoria === "manual" && (
              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  label="Nombre Manual"
                  value={productoSeleccionado.nombreManual}
                  onChange={(e) =>
                    setProductoSeleccionado((prev) => ({
                      ...prev,
                      nombreManual: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
            )}

            <Grid item xs={6} sm={2}>
              <TextField
                size="small"
                label="Precio"
                type="number"
                value={productoSeleccionado.precio}
                onChange={(e) =>
                  setProductoSeleccionado((prev) => ({
                    ...prev,
                    precio: parseFloat(e.target.value),
                  }))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                size="small"
                label="Cantidad"
                type="number"
                value={productoSeleccionado.cantidad}
                onChange={(e) =>
                  setProductoSeleccionado((prev) => ({
                    ...prev,
                    cantidad: parseInt(e.target.value),
                  }))
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddProducto}>
                Añadir Producto
              </Button>
            </Grid>
          </Grid>

          {/* Tabla de productos añadidos */}
          {nuevoPresupuesto.productos.length > 0 && (
            <>
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nuevoPresupuesto.productos.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell align="right">{item.cantidad}</TableCell>
                        <TableCell align="right">{item.precio} €</TableCell>
                        <TableCell align="right">
                          {item.precio * item.cantidad} €
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => eliminarItem(item.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Totales */}
              <Box sx={{ mt: 2, textAlign: "right", pr: 2 }}>
                <Typography variant="body1">
                  Subtotal:{" "}
                  <strong>
                    {calcularSubtotal(nuevoPresupuesto.productos).toFixed(2)} €
                  </strong>
                </Typography>
                <Typography variant="body1">
                  IVA ({nuevoPresupuesto.iva || 0}%):{" "}
                  <strong>
                    {(
                      (calcularSubtotal(nuevoPresupuesto.productos) *
                        (nuevoPresupuesto.iva || 0)) /
                      100
                    ).toFixed(2)}{" "}
                    €
                  </strong>
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  Total con IVA:{" "}
                  <strong>
                    {calcularTotalConIVA(nuevoPresupuesto).toFixed(2)} €
                  </strong>
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => resetFormulario()}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleGuardarPresupuesto}
            color="success"
          >
            Guardar Presupuesto
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
