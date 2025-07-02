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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridFooter } from "@mui/x-data-grid";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import html2pdf from "html2pdf.js";
import PdfPresupuesto from "../components/PdfPresupuesto";
import AddCliente from "../components/AddCliente";
import { useMediaQuery } from "@mui/material";
import { useAuthContext } from "../contexts/AuthContext";

export default function Presupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [numPresupuestos, setNumPresupuestos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [reload, setReload] = useState(false);
  const [openEditarDialog, setOpenEditarDialog] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [openAddCliente, setOpenAddCliente] = useState(false);
  const { dataToken } = useAuthContext();
  const [verSoloMisPresupuestos, setVerSoloMisPresupuestos] = useState(false);

  const isMobile = useMediaQuery("(max-width:1600px)");
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
    codigoPostal: "",
    iva: "",
    fecha: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD
    num_presupuesto: "",
    estado: "",
    productos: [],
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    categoria: "",
    productoId: "",
    nombreManual: "",
    precio: "",
    descuento: "",
    descuento_porcentaje: "",
    descripcion: "",
    cantidad: 1,
  });
  useEffect(() => {
    const fetchPresupuestosByUser = async () => {
      let url = "";

      if (dataToken.role === "usuario" || verSoloMisPresupuestos) {
        // Usuarios normales o admins que quieren ver solo los suyos
        url = `http://localhost:3000/api/presupuestos/user/${dataToken.id}`;
      } else {
        // Admin o Superadmin que quieren ver todos
        url = "http://localhost:3000/api/presupuestos/";
      }

      const res = await fetch(url);
      const data = await res.json();
      setPresupuestos(data);
    };

    const fetchPresupuestos = async () => {
      const url = "http://localhost:3000/api/presupuestos/";
      const res = await fetch(url);
      const data = await res.json();
      setNumPresupuestos(data);
    };

    fetchPresupuestos();
    fetchPresupuestosByUser();
    fetchClientes();
    fetchProductos();
  }, [dataToken.id, dataToken.role, reload, verSoloMisPresupuestos]);

  const generarNumeroPresupuesto = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes con dos dígitos
    const prefix = `${year}${month}`;

    // Filtra presupuestos del mismo mes y año
    const presupuestosDelMes = numPresupuestos.filter((p) => {
      const fechaPresupuesto = new Date(p.fecha);
      return (
        fechaPresupuesto.getFullYear() === year &&
        String(fechaPresupuesto.getMonth() + 1).padStart(2, "0") === month
      );
    });
    console.log(presupuestosDelMes);
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
    const res = await fetch("https://almartindev.com/api/clientes/");
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
      estado: "",
      productos: [],
    });
    setProductoSeleccionado({
      categoria: "",
      productoId: "",
      nombreManual: "",
      precio: "",
      descuento: "",
      descuento_porcentaje: "",
      descripcion: "",
      cantidad: 1,
    });
    setOpenDialog(false);
    setReload(!reload);
  }

  const cerrarDialogoEdicion = () => {
    setPresupuestoSeleccionado(null); // 👈 Resetea solo el de edición
    setProductoSeleccionado({
      categoria: "",
      productoId: "",
      nombreManual: "",
      precio: "",
      descuento: "",
      descuento_porcentaje: "",
      descripcion: "",
      cantidad: 1,
    });
    setOpenEditarDialog(false);
  };

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

  const handleAddProductoNuevo = () => {
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

      // Mapea la categoría al tipo_producto
      const tipoProductoMap = {
        paneles: "panel",
        inversores: "inversor",
        baterias: "bateria",
        manual: "manual",
      };
      const tipo_producto = tipoProductoMap[productoSeleccionado.categoria];
      const descripcion = productoSeleccionado.descripcion || "";

      const precioOriginal = parseFloat(productoSeleccionado.precio) || 0;
      const descuento_porcentaje =
        parseFloat(productoSeleccionado.descuento_porcentaje) || 0;
      const cantidad = parseInt(productoSeleccionado.cantidad) || 1;

      const descuento = precioOriginal * (descuento_porcentaje / 100);
      const precioFinal = precioOriginal - descuento;

      // Añade el producto al nuevo presupuesto
      setNuevoPresupuesto((prev) => ({
        ...prev,
        productos: [
          ...prev.productos,
          {
            id: Date.now(),
            nombre,
            tipo_producto,
            descripcion,
            cantidad,
            precioOriginal: precioOriginal.toFixed(2),
            descuento_porcentaje,
            descuento: descuento.toFixed(2),
            precio: precioFinal.toFixed(2),
          },
        ],
      }));

      // Reinicia formulario del producto
      setProductoSeleccionado({
        categoria: "",
        productoId: "",
        nombreManual: "",
        precio: "",
        descuento_porcentaje: "",
        descripcion: "",
        cantidad: 1,
      });
    }
  };

  const handleAddProductoEdicion = () => {
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

      // Mapea la categoría al tipo_producto
      const tipoProductoMap = {
        paneles: "panel",
        inversores: "inversor",
        baterias: "bateria",
        manual: "manual",
      };
      const tipo_producto = tipoProductoMap[productoSeleccionado.categoria];
      const descripcion = productoSeleccionado.descripcion || "";

      const precioOriginal = parseFloat(productoSeleccionado.precio) || 0;
      const descuento_porcentaje =
        parseFloat(productoSeleccionado.descuento_porcentaje) || 0;
      const cantidad = parseInt(productoSeleccionado.cantidad) || 1;

      const descuento = precioOriginal * (descuento_porcentaje / 100);
      const precioFinal = precioOriginal - descuento;

      // Añade el producto al presupuesto seleccionado (en edición)
      setPresupuestoSeleccionado((prev) => ({
        ...prev,
        productos: [
          ...(prev?.productos || []),
          {
            id: Date.now(),
            nombre,
            tipo_producto,
            descripcion,
            cantidad,
            precioOriginal: precioOriginal.toFixed(2),
            descuento_porcentaje,
            descuento: descuento.toFixed(2),
            precio: precioFinal.toFixed(2),
          },
        ],
      }));

      // Reinicia formulario del producto
      setProductoSeleccionado({
        categoria: "",
        productoId: "",
        nombreManual: "",
        precio: "",
        descuento_porcentaje: "",
        dexcripcion: "",
        cantidad: 1,
      });
    }
  };

  console.log(productoSeleccionado);

  const obtenerNombrePorId = (categoria, id) => {
    const item = productos[categoria]?.find((p) => p.id === parseInt(id));
    return item?.nombre || "";
  };

  const eliminarItem = (id, esEdicion = false) => {
    if (esEdicion) {
      // Eliminar del presupuesto seleccionado (en edición)
      setPresupuestoSeleccionado((prev) => ({
        ...prev,
        productos: prev.productos.filter((item) => item.id !== id),
      }));
    } else {
      // Eliminar del nuevo presupuesto
      setNuevoPresupuesto((prev) => ({
        ...prev,
        productos: prev.productos.filter((item) => item.id !== id),
      }));
    }
  };

  const handleGuardarPresupuesto = async () => {
    try {
      const num_presupuesto = generarNumeroPresupuesto();
      const {
        clienteId,
        nombreCliente,
        direccionInstalacion,
        poblacionInstalacion,
        codigoPostal,
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
        usuario_id: dataToken.id || null,
        nombre_cliente_manual: nombreCliente || null,
        direccion_instalacion: direccionInstalacion || null,
        poblacion_instalacion: poblacionInstalacion || null,
        codigo_postal: codigoPostal || null,
        iva: ((totalBruto * iva) / 100).toFixed(2),
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
        descripcion: p.descripcion, // si no usas descripción, puedes dejar vacío o eliminar este campo
        cantidad: parseInt(p.cantidad),
        precio_unitario: parseFloat(p.precio),
        total: parseFloat(p.precio) * parseInt(p.cantidad),
        descuento: parseFloat(p.descuento),
        descuento_porcentaje: parseFloat(p.descuento_porcentaje),
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
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const precio = parseFloat(item.precio) || 0;
      const cantidad = parseInt(item.cantidad) || 0;
      return sum + precio * cantidad;
    }, 0);
  };

  const calcularSubtotalModificado = (items) => {
    if (!Array.isArray(items)) return 0;

    return items.reduce((sum, item) => {
      const precio = safeNumber(
        item.precio_unitario || item.precio || item.precioOriginal
      );
      const cantidad = safeNumber(item.cantidad, 1);
      return sum + precio * cantidad;
    }, 0);
  };

  const calcularDescuento = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const descuento = parseFloat(item.descuento) || 0;
      return sum + descuento;
    }, 0);
  };

  const calcularTotalConIVA = (presupuesto) => {
    const subtotal = calcularSubtotal(presupuesto?.productos || []);
    const iva = presupuesto?.iva || 0;
    return subtotal + subtotal * (iva / 100);
  };

  const calcularTotalConIVAModificado = (presupuesto) => {
    const subtotal = calcularSubtotalModificado(presupuesto?.productos || []);
    const iva = presupuesto?.iva_porcentaje || 0;
    return subtotal + subtotal * (iva / 100);
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "num_presupuesto",
      headerName: "Nº Prto.",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1.5,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "apellidos",
      headerName: "Apellidos",
      flex: 1.5,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "telefono",
      headerName: "Telefono",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "direccion_instalacion",
      headerName: "Dirección Ins",
      flex: 1.5,
    },
    { field: "poblacion_instalacion", headerName: "Población", flex: 1 },
    { field: "codigo_postal", headerName: "C.P.", flex: 1 },
    {
      field: "total_bruto",
      headerName: "Neto (€)",
      align: "right",
      headerAlign: "right",
      flex: 1,
    },
    {
      field: "iva",
      headerName: "IVA (€)",
      align: "right",
      headerAlign: "right",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total (€)",
      align: "right",
      headerAlign: "right",
      flex: 1,
    },
    {
      field: "estado",
      headerName: "Estado",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "acciones",
      type: "actions",
      headerName: "Acciones",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Editar"
          onClick={() => abrirDialogoEdicion(params.row)}
        />,
        <GridActionsCellItem
          icon={<PictureAsPdfIcon sx={{ color: "#f44336" }} />}
          label="Ver PDF"
          onClick={() => handleOpenPDF(params.row)}
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
    const res = await fetch(
      `http://localhost:3000/api/presupuestos/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setReload(!reload);
    }
  };

  const abrirDialogoEdicion = (presupuesto) => {
    const productosLimpios = presupuesto.items.map((item) => ({
      ...item,
      cantidad: safeNumber(item.cantidad, 1),
      precio_unitario: safeNumber(item.precio_unitario),
      descuento: safeNumber(item.descuento),
      descuento_porcentaje: safeNumber(item.descuento_porcentaje),
    }));

    setPresupuestoSeleccionado({
      ...presupuesto,
      iva_porcentaje: safeNumber(presupuesto.iva_porcentaje, 21),
      productos: productosLimpios,
    });

    setOpenEditarDialog(true);
  };

  const safeNumber = (value, fallback = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  const handleActualizarPresupuesto = async () => {
    try {
      const {
        id,
        cliente_id,
        nombre_cliente_manual,
        direccion_instalacion,
        poblacion_instalacion,
        codigo_postal,
        iva_porcentaje,
        fecha,
        estado,
        productos,
      } = presupuestoSeleccionado;

      // Calcular subtotal seguro
      const totalBruto = calcularSubtotalModificado(productos);
      const ivaPorcentaje = safeNumber(iva_porcentaje);

      // Calcular IVA
      const totalIva = ((totalBruto * ivaPorcentaje) / 100).toFixed(2);

      // Objeto final del presupuesto
      const presupuestoActualizado = {
        id,
        num_presupuesto: presupuestoSeleccionado.num_presupuesto,
        cliente_id: cliente_id || null,
        direccion_instalacion: direccion_instalacion || null,
        poblacion_instalacion: poblacion_instalacion || null,
        codigo_postal: codigo_postal || null,
        iva: safeNumber(totalIva),
        iva_porcentaje: ivaPorcentaje,
        total_bruto: safeNumber(totalBruto),
        total: safeNumber(totalBruto + safeNumber(totalIva)),
        fecha,
        estado,
      };

      // Mapear items con protección
      const items = presupuestoSeleccionado.productos.map((p) => {
        const cantidad = safeNumber(p.cantidad, 1);
        const precio = safeNumber(
          p.precio_unitario || p.precio || p.precioOriginal
        );
        const descuento = safeNumber(p.descuento);
        const descuento_porcentaje = safeNumber(p.descuento_porcentaje);

        return {
          tipo_producto: p.tipo_producto,
          producto_id: p.productoId ? parseInt(p.productoId) : null,
          nombre: p.nombre || "",
          descripcion: p.descripcion || "",
          cantidad,
          precio_unitario: precio,
          total: precio * cantidad,
          descuento,
          descuento_porcentaje,
        };
      });

      console.log("Datos enviados:", {
        presupuesto: presupuestoActualizado,
        items,
      });

      const res = await fetch(
        `http://localhost:3000/api/presupuestos/update/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ presupuesto: presupuestoActualizado, items }),
        }
      );

      if (res.ok) {
        setPresupuestoSeleccionado(null);
        setOpenEditarDialog(false);
        setReload(!reload);
      }
    } catch (error) {
      console.error("Error al actualizar el presupuesto:", error);
    }
  };

  const generarYDescargarPDF = (presupuesto) => {
    // Datos del cliente
    const nombreCliente =
      presupuesto.nombre_cliente_manual ||
      `${presupuesto.nombre} ${presupuesto.apellidos}`;
    const direccionInstalacion = presupuesto.direccion_instalacion || "";
    const poblacionInstalacion = presupuesto.poblacion_instalacion || "";
    const codigoPostal = presupuesto.codigo_postal || "";

    // Datos del presupuesto
    const num_presupuesto = presupuesto.num_presupuesto || "—";
    const fecha = new Date(presupuesto.fecha).toLocaleDateString("es-ES");
    const totalBruto =
      parseFloat(presupuesto.total_bruto).toFixed(2).replace(".", ",") + " €";
    const iva = parseFloat(presupuesto.iva).toFixed(2).replace(".", ",") + " €";
    const total =
      parseFloat(presupuesto.total).toFixed(2).replace(".", ",") + " €";
    const iva_porcentaje = parseFloat(presupuesto.iva_porcentaje) || 0;
    const descuento =
      calcularDescuento(presupuesto.items).toFixed(2).replace(".", ",") + " €";

    // Items del presupuesto
    const itemsHtml = presupuesto.items
      .map((item) => {
        const precioUnitario =
          parseFloat(item.precio_unitario).toFixed(2).replace(".", ",") + " €";
        const totalItem =
          parseFloat(item.total).toFixed(2).replace(".", ",") + " €";

        return `
        <tr>
          <td style="font-size: 8px; border-left: none; border-top: none; border-right: 0.1px solid #000;">${
            item.nombre
          }</td>
          <td style="text-align: left; font-size: 8px;  border-left: none; border-top: none; border-right: 0.1px solid #000;">${
            item.descripcion || ""
          }</td>
          <td style="font-size: 8px; border-left: none; border-top: none; border-right: 0.1px solid #000;">${
            item.cantidad
          }</td>
          <td style=" text-align: right; font-size: 8px;  border-left: none; border-top: none; border-right: 0.1px solid #000;">${
            precioUnitario != "0,00 €" ? precioUnitario : ""
          }</td>
          <td style=" text-align: right; font-size: 8px; border: none;">${
            totalItem != "0,00 €" ? totalItem : ""
          }</td>
        </tr>`;
      })
      .join("");

    const contenido = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Presupuesto ${num_presupuesto}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 40px;
        color: #000;
      }

      .header img {
        height: 80px;
        float: right;
      }

      .info-table,
      .main-table {
        width: 100%;
        margin-top: 20px;
        border: 1px solid #000;
        border-collapse: collapse;
        text-color: #000;
      }
      .info-table {
        border-color: #fd8700;
      }

      .info-table td {
        padding: 2px;
        font-size: 10px;
      }

      .main-table th,
      .main-table td {

        padding: 8px;
        text-align: center;
        vertical-align: top;
        font-size: 10px;
      }
      
      .main-table td {
        text-align: center;
      }

      .main-table thead tr th {
        background-color: #8a8a8a3b;
        font-weight: 900;
        padding: 0px;
      }

      .main-table tbody tr {
        page-break-inside: avoid;
      }

      .main-table tbody tr:not(:last-child) td {
        border-bottom: none !important;
      }

      .main-table tbody tr.total-fila td {
        font-weight: bold;
        background-color: #ffffff;
        border-top: 1px solid #000;
        padding: 1px;
        font-size: 8px;
      }

      .section-title {
        background-color: #8a8a8a3b;
        font-weight: 900;
        padding: 0px;
        text-align: center;
        margin-top: 30px;
        font-size: 11px;
        border: 1px solid #000
      }

      .conditions {
        margin-top: 30px;
        font-size: 10px;
      }

      .footer {
        margin-top: 50px;
        font-size: 10px;
        text-align: center;
        border: 1px solid #fd8700;
      }
    </style>
  </head>
  <body>
    <!-- CABECERA -->
    <div class="header">
      <table class="info-table">
        <tr>
          <td><strong>Presupuesto nº:</strong> ${num_presupuesto}</td>
          <td rowspan="6" style="text-align: right; padding-right: 25px;">
            <img src="/neorenovables_logo.png" alt="Logo Neo Renovables" />
          </td>
        </tr>
        <tr>
          <td><strong>Fecha:</strong> ${fecha}</td>
        </tr>
        <tr>
          <td><strong>Cliente:</strong> ${nombreCliente}</td>
        </tr>
        <tr>
          <td><strong>Dirección:</strong> ${direccionInstalacion}</td>
        </tr>
        <tr>
          <td><strong>Población:</strong> ${poblacionInstalacion}</td>
        </tr>
        <tr>
          <td><strong>Teléfono:</strong></td>
        </tr>
      </table>

      <div class="section-title">Instalación Fotovoltaica</div>
    </div>

    <!-- TABLA DE PRODUCTOS Y TOTALES UNIFICADOS -->
    <table class="main-table">
      <thead>
        <tr>
          <th style="border: none; border-bottom: 0.5px solid #000; border-right: 0.5px solid #000; width: 100px">Descripción</th>
          <th style="border: none; border-bottom: 0.5px solid #000; border-right: 0.5px solid #000;">Especificación Técnica</th>
          <th style="border: none; border-bottom: 0.5px solid #000; border-right: 0.5px solid #000; width: 20px ">Und.</th>
          <th style="border: none; border-bottom: 0.5px solid #000; border-right: 0.5px solid #000; width: 60px">Precio</th>
          <th style="border: none; border-bottom: 0.5px solid #000; width: 70px">Total</th>
        </tr>
      </thead>
      <tbody style="height: 40vh;">
        ${itemsHtml}
      </tbody>
      <tbody>

        <!-- FILA DE TOTALES DENTRO DE LA MISMA TABLA -->
        <tr class="total-fila">
          <td
            colspan="1"
            style="border-top: 1px solid #000; border-right: 1px solid #000; border-left: 1px solid #000;"
          ></td>
          <td
            colspan="1"
            style="border-top: 1px solid #000;"
          ></td>
          <td
            colspan="1"
            style="border-top: 1px solid #000; "
          ></td>
          <td style="text-align: right; background-color: #ffffff; border-right: 1px solid #000; font-weight: 900;">Importe:</td>
          <td style="text-align: right; background-color: #ffffff; font-weight: 900; border-right: 1px solid #000;">
            ${totalBruto}
          </td>
        </tr>
        ${
          descuento !== "0,00 €"
            ? `<tr class="total-fila">
          <td
            colspan="1"
            style="border: none; border-right: 1px solid #000; border-left: 1px solid #000;"
          ></td>
          <td
            colspan="1"
            style="border: none;"
          ></td>
          <td
            colspan="1"
            style="border: none; "
          ></td>
          <td style="text-align: right; background-color: #ffffff; border-right: 1px solid #000; border-top: none;">Descuento:</td>
          <td style="text-align: right; background-color: #ffffff; border-top: none; border-right: 1px solid #000;">
            ${descuento}
          </td>
        </tr>`
            : ``
        }
        <tr class="total-fila">
          <td
            colspan="1"
            style="border: none; border-right: 1px solid #000; border-left: 1px solid #000;"
          ></td>
          <td
            colspan="1"
            style="border: none;"
          ></td>
          <td
            colspan="1"
            style="border: none;"
          ></td>
          <td style="text-align: right; background-color: #ffffff; border-right: 1px solid #000; border-top: none;">
            IVA (${iva_porcentaje}%):
          </td>
          <td style="text-align: right; background-color: #ffffff; border-top: none; border-right: 1px solid #000;">${iva}</td>
        </tr>
        <tr class="total-fila">
          <td
            colspan="1"
            style="border: none; border-right: 1px solid #000; border-bottom: 1px solid; border-left: 1px solid #000"
          ></td>
          <td
            colspan="1"
            style="border: none; border-bottom: 1px solid;"
          ></td>
          <td
            colspan="1"
            style="border: none; border-bottom: 1px solid;"
          ></td>
          <td
            style="
              text-align: right;
              background-color: #ffffff;
              font-weight: 900;
              border-right: 1px solid #000;
              border-top: none;
              border-bottom: 1px solid
            "
          >
            TOTAL:
          </td>
          <td
            style="
              text-align: right;
              background-color: #ffffff;
              font-weight: 900;
              border-right: 1px solid #000;
              border-bottom: 1px solid
            "
          >
            ${total}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- CONDICIONES FINALES -->
    <div class="conditions">
      <strong>Condiciones generales:</strong><br />
      - Forma de pago:<br />
      &nbsp;&nbsp;50% en la aceptación del presupuesto.<br />
      &nbsp;&nbsp;50% en la finalización de la instalación (pruebas de
      funcionamiento y entrega de certificados, memorias o proyectos).<br />
      - Cuenta bancaria BBVA: ES52 0182 7881 3201 6201 644610<br />
      - No incluye cualquier material o trabajos no especificados en el presente
      presupuesto (obras civiles o movimientos de tierras).<br />
      - La licencia de obra deberá estar tramitada e ir a cargo de la propiedad,
      siendo solo la empresa instaladora la que aportará toda la documentación
      necesaria para dicha tramitación.<br />
      - Comienzo aproximado de la instalación en 15 días posteriores a la
      aceptación (plazo variable según carga de trabajo).<br />
      - Oferta válida 15 días desde la fecha del presupuesto.
    </div>

    <!-- PIE -->
    <div class="footer" style="clear: both">
      <p>
        <strong>SOLAR SANTOS GONZALEZ S.L.</strong><br />
        Carretera de Cártama, 38, Alhaurín El Grande CIF: B56218951<br />
        Móvil: 722 781 541<br />
        email: info@neorenovables.com
      </p>
    </div>
  </body>
</html>

`;

    // Generamos el PDF
    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `${num_presupuesto}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3, // Aumenta la escala (equivale a DPI)
          dpi: 600, // Resolución de 600 DPI
          letterRendering: true,
          useCORS: true, // Si cargas imágenes externas
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(contenido)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.output("dataurlnewwindow");
      });
    // .then((pdf) => {
    //   //Abrimos el PDF con nombre personalizado
    //   const blob = pdf.output("blob");
    //   const url = URL.createObjectURL(blob);

    //   const win = window.open("", "_blank");
    //   win.document.write(
    //     `<iframe src="${url}" style="border: none; width: 100%; height: 100vh;"></iframe>`
    //   );
    //   win.document.title = `Presupuesto ${num_presupuesto}`;
    //   win.document.close();
    // });
  };

  const handleOpenPDF = (presupuesto) => {
    console.log(presupuesto);
    generarYDescargarPDF(presupuesto);
  };

  // const handleOpenAddCliente = (open) => {
  //   setOpenAddCliente(open);
  // };

  const columnasVisibles = isMobile
    ? columns.filter((col) =>
        ["fecha", "num_presupuesto", "acciones"].includes(col.field)
      )
    : columns;

  const CustomFooter = ({ checked, onChange }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 0,
          backgroundColor: "#d3f7ff",
          borderTop: "1px solid #757575",
          fontSize: "12px",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox size="small" checked={checked} onChange={onChange} />
          }
          label="Ver solo mis presupuestos"
          sx={{ fontSize: "12px" }}
        />
        <GridFooter />
      </Box>
    );
  };

  console.log(presupuestoSeleccionado);
  console.log(nuevoPresupuesto);
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
          columns={columnasVisibles}
          getRowId={(row) => row.id}
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
              borderColor: dataToken.role == "usuario" && "#757575",
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
          slots={
            dataToken.role == "usuario"
              ? {}
              : {
                  footer: () => (
                    <CustomFooter
                      checked={verSoloMisPresupuestos}
                      onChange={(e) =>
                        setVerSoloMisPresupuestos(e.target.checked)
                      }
                    />
                  ),
                }
          }
        />
        {/* COMPONENTE OCULTO PARA GENERAR EL PDF */}
        {presupuestoSeleccionado && (
          <PdfPresupuesto presupuesto={presupuestoSeleccionado} />
        )}
      </Box>

      {/* Dialog de creación */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle fontWeight="bold">Nuevo Presupuesto</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4.26}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: "12px" }}>
                  Cliente existente
                </InputLabel>
                <Select
                  value={nuevoPresupuesto.clienteId}
                  label="Cliente existente"
                  onChange={(e) =>
                    setNuevoPresupuesto((prev) => ({
                      ...prev,
                      clienteId: e.target.value,
                    }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre + " " + c.apellidos}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={7.74}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<AddRoundedIcon />}
                onClick={() => setOpenAddCliente(true)}
                size="small"
              >
                Crear Cliente
              </Button>
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
            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                label="Codigo Postal"
                type="number"
                value={nuevoPresupuesto.codigoPostal}
                onChange={(e) =>
                  setNuevoPresupuesto((prev) => ({
                    ...prev,
                    codigoPostal: e.target.value,
                  }))
                }
                fullWidth
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

            <Grid item xs={12} sm={2}>
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
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: "12px" }}>IVA</InputLabel>
                <Select
                  value={nuevoPresupuesto.iva}
                  label="IVA"
                  onChange={(e) =>
                    setNuevoPresupuesto((prev) => ({
                      ...prev,
                      iva: parseInt(e.target.value),
                    }))
                  }
                  sx={{ fontSize: "12px" }}
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
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <InputLabel sx={{ fontSize: "12px" }}>Categoría</InputLabel>
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
                          descuento: "",
                          descuento_porcentaje: "",
                          descripcion: "",
                          cantidad: 1,
                        }))
                      }
                      sx={{ fontSize: "12px" }}
                    >
                      <MenuItem value="paneles">Panel Solar</MenuItem>
                      <MenuItem value="inversores">Inversor</MenuItem>
                      <MenuItem value="baterias">Batería</MenuItem>
                      <MenuItem value="manual">Otro (manual)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {productoSeleccionado.categoria !== "manual" && (
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      disabled={!productoSeleccionado.categoria}
                      size="small"
                      fullWidth
                    >
                      <InputLabel sx={{ fontSize: "12px" }}>
                        Producto
                      </InputLabel>
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
                            descripcion: productos[
                              productoSeleccionado.categoria
                            ]
                              ?.find((p) => p.id === parseInt(e.target.value))
                              ?.descripcion?.toString(),
                          }))
                        }
                        sx={{ fontSize: "12px" }}
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
                  <Grid item xs={12} sm={12}>
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
                )}
              </Grid>
            </Grid>
            {productoSeleccionado.categoria !== "manual" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  disabled={!productoSeleccionado.categoria}
                  value={productoSeleccionado.descripcion}
                  label="Descripción completa"
                  fullWidth
                  multiline
                  rows={4}
                  onChange={(e) =>
                    setProductoSeleccionado((prev) => ({
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
            )}
            {productoSeleccionado.categoria === "manual" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  multiline
                  rows={4}
                  value={productoSeleccionado.descripcion}
                  label="Descripción completa"
                  fullWidth
                  onChange={(e) =>
                    setProductoSeleccionado((prev) => ({
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
            <Grid item xs={6} sm={1}>
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
            <Grid item xs={12} sm={1}>
              <TextField
                size="small"
                label="Dto.(%)"
                type="number"
                value={productoSeleccionado.descuento_porcentaje}
                onChange={(e) =>
                  setProductoSeleccionado((prev) => ({
                    ...prev,
                    descuento_porcentaje: parseInt(e.target.value),
                  }))
                }
                fullWidth
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

            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddProductoNuevo}>
                Añadir Producto
              </Button>
            </Grid>
          </Grid>

          {/* Tabla de productos añadidos */}

          <>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Dto (%)</TableCell>
                    <TableCell align="right">Dto (€)</TableCell>

                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nuevoPresupuesto.productos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell align="right">{item.cantidad}</TableCell>
                      <TableCell align="right">
                        {(parseFloat(item.precioOriginal) || 0).toFixed(2)} €
                      </TableCell>
                      <TableCell align="right">
                        {item.descuento_porcentaje} %
                      </TableCell>
                      <TableCell align="right">
                        {(parseFloat(item.descuento) || 0).toFixed(2)} €
                      </TableCell>
                      <TableCell align="right">
                        {(
                          parseFloat(item.precio) * parseInt(item.cantidad)
                        ).toFixed(2)}{" "}
                        €
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => eliminarItem(item.id, false)}
                        >
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
              <Typography variant="h6" fontWeight="bold">
                Resumen del Presupuesto
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body1">
                Importe sin IVA:{" "}
                <strong>
                  {calcularSubtotal(nuevoPresupuesto.productos).toFixed(2)} €
                </strong>
              </Typography>
              <Typography variant="body1">
                Dto.:{" "}
                <strong>
                  {calcularDescuento(nuevoPresupuesto.productos).toFixed(2)} €
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => resetFormulario()}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleGuardarPresupuesto}
            color="success"
            disabled={
              nuevoPresupuesto.clienteId == "" ||
              nuevoPresupuesto.productos.length <= 0
                ? true
                : false
            }
          >
            Guardar Presupuesto
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog de edición */}
      <Dialog
        open={openEditarDialog}
        onClose={() => setOpenEditarDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DialogTitle fontWeight="bold" fontSize={{ xs: "14px", sm: "16px" }}>
            Editar Presupuesto Nº: {presupuestoSeleccionado?.num_presupuesto}
          </DialogTitle>
        </Box>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4.26}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: "12px" }}>
                  Cliente existente
                </InputLabel>
                <Select
                  value={presupuestoSeleccionado?.cliente_id || ""}
                  label="Cliente existente"
                  onChange={(e) =>
                    setPresupuestoSeleccionado((prev) => ({
                      ...prev,
                      cliente_id: e.target.value,
                    }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre + " " + c.apellidos}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Dirección Instalación"
                value={presupuestoSeleccionado?.direccion_instalacion || ""}
                onChange={(e) =>
                  setPresupuestoSeleccionado((prev) => ({
                    ...prev,
                    direccion_instalacion: e.target.value,
                  }))
                }
                fullWidth
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
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                label="Población Instalación"
                value={presupuestoSeleccionado?.poblacion_instalacion || ""}
                onChange={(e) =>
                  setPresupuestoSeleccionado((prev) => ({
                    ...prev,
                    poblacion_instalacion: e.target.value,
                  }))
                }
                fullWidth
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
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                label="Codigo Postal"
                type="number"
                value={presupuestoSeleccionado?.codigo_postal || ""}
                onChange={(e) =>
                  setPresupuestoSeleccionado((prev) => ({
                    ...prev,
                    codigo_postal: e.target.value,
                  }))
                }
                fullWidth
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
            <Grid item xs={12} sm={2}>
              <TextField
                size="small"
                label="Fecha"
                type="date"
                value={presupuestoSeleccionado?.fecha.split("T")[0] || ""}
                onChange={(e) =>
                  setPresupuestoSeleccionado((prev) => ({
                    ...prev,
                    fecha: e.target.value,
                  }))
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: {
                    fontSize: "12px", // Tamaño del texto del label
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "12px", // Tamaño del texto dentro del input
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: "12px" }}>IVA</InputLabel>
                <Select
                  value={presupuestoSeleccionado?.iva_porcentaje || 10}
                  label="IVA"
                  onChange={(e) =>
                    setPresupuestoSeleccionado((prev) => ({
                      ...prev,
                      iva_porcentaje: parseInt(e.target.value),
                    }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem value={10}>10%</MenuItem>
                  <MenuItem value={21}>21%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Campo para editar estado */}
            <Grid item xs={12} sm={2}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: "12px" }}>Estado</InputLabel>
                <Select
                  value={presupuestoSeleccionado?.estado || "Pendiente"}
                  label="Estado"
                  onChange={(e) =>
                    setPresupuestoSeleccionado((prev) => ({
                      ...prev,
                      estado: e.target.value,
                    }))
                  }
                  sx={{ fontSize: "12px" }}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="aceptado">Aceptado</MenuItem>
                  <MenuItem value="rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Añadir Producto al Presupuesto
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <InputLabel sx={{ fontSize: "12px" }}>Categoría</InputLabel>
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
                          descuento_porcentaje: "",
                          descripcion: "",
                          cantidad: 1,
                        }))
                      }
                      sx={{ fontSize: "12px" }}
                    >
                      <MenuItem value="paneles">Panel Solar</MenuItem>
                      <MenuItem value="inversores">Inversor</MenuItem>
                      <MenuItem value="baterias">Batería</MenuItem>
                      <MenuItem value="manual">Otro (manual)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {productoSeleccionado.categoria !== "manual" && (
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      disabled={!productoSeleccionado.categoria}
                      size="small"
                      fullWidth
                    >
                      <InputLabel sx={{ fontSize: "12px" }}>
                        Producto
                      </InputLabel>
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
                            descripcion: productos[
                              productoSeleccionado.categoria
                            ]
                              ?.find((p) => p.id === parseInt(e.target.value))
                              ?.descripcion?.toString(),
                          }))
                        }
                        sx={{ fontSize: "12px" }}
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
                  <Grid item xs={12} sm={12}>
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
                )}
              </Grid>
            </Grid>
            {productoSeleccionado.categoria !== "manual" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  disabled={!productoSeleccionado.categoria}
                  value={productoSeleccionado.descripcion}
                  label="Descripción completa"
                  fullWidth
                  multiline
                  rows={4}
                  onChange={(e) =>
                    setProductoSeleccionado((prev) => ({
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
            )}
            {productoSeleccionado.categoria === "manual" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  multiline
                  rows={4}
                  disabled={!productoSeleccionado.categoria}
                  value={productoSeleccionado.descripcion}
                  label="Descripción completa"
                  fullWidth
                  onChange={(e) =>
                    setProductoSeleccionado((prev) => ({
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
            <Grid item xs={6} sm={1}>
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
            <Grid item xs={12} sm={1}>
              <TextField
                size="small"
                label="Dto.(%)"
                type="number"
                value={productoSeleccionado.descuento_porcentaje}
                onChange={(e) =>
                  setProductoSeleccionado((prev) => ({
                    ...prev,
                    descuento_porcentaje: parseInt(e.target.value),
                  }))
                }
                fullWidth
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
            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddProductoEdicion}>
                Añadir Producto
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Dto (%)</TableCell>
                  <TableCell align="right">Dto (€)</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {presupuestoSeleccionado?.productos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell align="right">{item.cantidad}</TableCell>
                    <TableCell align="right">
                      {(
                        parseFloat(
                          item.precioOriginal || item.precio_unitario
                        ) || 0
                      ).toFixed(2)}{" "}
                      €
                    </TableCell>
                    <TableCell align="right">
                      {item.descuento_porcentaje} %
                    </TableCell>
                    <TableCell align="right">
                      {(parseFloat(item.descuento) || 0).toFixed(2)} €
                    </TableCell>
                    <TableCell align="right">
                      {(
                        parseFloat(
                          item.precio_unitario || item.precioOriginal
                        ) *
                          parseInt(item.cantidad) -
                        parseFloat(item.descuento || 0)
                      ).toFixed(2)}{" "}
                      €
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => eliminarItem(item.id, true)}>
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
            <Typography variant="h6" fontWeight="bold">
              Resumen del Presupuesto
            </Typography>
            <Divider sx={{ mb: 1 }} />

            <Typography variant="body1">
              Importe sin IVA:{" "}
              <strong>
                {calcularSubtotalModificado(
                  presupuestoSeleccionado?.productos || []
                ).toFixed(2)}{" "}
                €
              </strong>
            </Typography>
            <Typography variant="body1">
              Descuento:{" "}
              <strong>
                {calcularDescuento(
                  presupuestoSeleccionado?.productos || []
                ).toFixed(2)}{" "}
                €
              </strong>
            </Typography>
            <Typography variant="body1">
              IVA ({presupuestoSeleccionado?.iva_porcentaje || 0}%):{" "}
              <strong>
                {(
                  (calcularSubtotalModificado(
                    presupuestoSeleccionado?.productos || []
                  ) *
                    (presupuestoSeleccionado?.iva_porcentaje || 0)) /
                  100
                ).toFixed(2)}{" "}
                €
              </strong>
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              Total con IVA:{" "}
              <strong>
                {calcularTotalConIVAModificado(
                  presupuestoSeleccionado || {}
                ).toFixed(2)}{" "}
                €
              </strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cerrarDialogoEdicion()}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleActualizarPresupuesto}
            color="success"
            disabled={
              presupuestoSeleccionado?.productos.length <= 0 ? true : false
            }
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      <AddCliente
        open={openAddCliente}
        onClose={(clienteGuardado) => {
          setOpenAddCliente(false);

          // Si se guardó un cliente, recarga la lista
          if (clienteGuardado) {
            setReload(!reload);
          }
        }}
      />
    </Box>
  );
}
