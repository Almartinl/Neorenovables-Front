import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DOCUMENTOS_POR_ROL = {
  cliente: [
    { key: "doc_dni", label: "DNI (delante y detrás)" },
    { key: "doc_factura_luz", label: "Factura de la luz" },
    { key: "doc_reg_catastral", label: "Registro catastral" },
    { key: "doc_declaracion_responsable", label: "Declaración responsable" },
    { key: "doc_tasa_aytmo", label: "Pago tasas ayuntamiento" },
  ],
  perito: [
    { key: "doc_reg_licencia_obra", label: "Registro de licencia de obra" },
    { key: "doc_cert_energ_previo", label: "Certificado energético previo" },
    {
      key: "doc_cert_energ_posterior",
      label: "Certificado energético posterior",
    },
  ],
  tecnico: [
    { key: "doc_legalizacion", label: "Documentación de legalización" },
  ],
};

const renderDato = (label, type, value) => (
  <Grid item xs={12} sm={4}>
    <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "13px" }}>
      {label}
    </Typography>
    {type !== "img" ? (
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontSize: "13px" }}
      >
        {value || "-"}
      </Typography>
    ) : type === "img" && value !== null ? (
      <img
        src={`https://almartindev.com/api${value}`}
        alt="No disponible"
        style={{
          height: "auto",
          maxHeight: "100px",
          objectFit: "contain",
        }}
      />
    ) : (
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontSize: "13px" }}
      >
        -
      </Typography>
    )}
  </Grid>
);

const renderCheckItem = (label, value) => (
  <Grid item xs={12} sm={4}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Checkbox checked={Boolean(value)} disabled />
      <Typography variant="body2">{label}</Typography>
    </Box>
  </Grid>
);

const DialogDetallesPresupuesto = ({
  open,
  onClose,
  presupuestoSeleccionado,
  calcularSubtotalModificado,
  calcularDescuento,
  calcularTotalConIVAModificado,
  clientes = [],
}) => {
  const cliente = clientes.find(
    (c) => c.id === presupuestoSeleccionado?.cliente_id
  );

  const totalConIVA = calcularTotalConIVAModificado(
    presupuestoSeleccionado || {}
  );
  const aCuenta = parseFloat(presupuestoSeleccionado?.a_cuenta || 0);
  const aCuentaPorcentaje = parseFloat(
    presupuestoSeleccionado?.a_cuenta_porcentaje ||
      ((aCuenta / totalConIVA) * 100).toFixed(2)
  );
  const totalPendiente = totalConIVA - aCuenta;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        fontWeight="bold"
        fontSize={{ xs: "14px", sm: "16px" }}
      >
        Detalles del Presupuesto Nº: {presupuestoSeleccionado?.num_presupuesto}
        <IconButton color="error" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Datos generales */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Información General
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {renderDato(
            "Título",
            "text",
            presupuestoSeleccionado?.titulo_presupuesto
          )}
          {renderDato(
            "Cliente",
            "text",
            cliente
              ? `${cliente.nombre} ${cliente.apellidos}`
              : "Cliente no encontrado"
          )}
          {renderDato(
            "Fecha",
            "text",
            presupuestoSeleccionado?.fecha?.split("T")[0]
          )}
          {renderDato(
            "Estado",
            "text",
            presupuestoSeleccionado?.estado?.toUpperCase()
          )}
          {renderDato(
            "Teléfono",
            "text",
            presupuestoSeleccionado?.tel_contacto
          )}
          {renderDato(
            "Colaborador",
            "text",
            presupuestoSeleccionado?.colaborador
          )}
          {renderDato(
            "Logo Colaborador",
            "img",
            presupuestoSeleccionado?.logo_colaborador
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Dirección instalación */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Dirección de Instalación
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {renderDato(
            "Dirección",
            "text",
            presupuestoSeleccionado?.direccion_instalacion
          )}
          {renderDato(
            "Población",
            "text",
            presupuestoSeleccionado?.poblacion_instalacion
          )}
          {renderDato(
            "Código Postal",
            "text",
            presupuestoSeleccionado?.codigo_postal
          )}
          {renderDato(
            "IVA (%)",
            "text",
            `${presupuestoSeleccionado?.iva_porcentaje || 0} %`
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Productos */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Productos Incluidos
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Dto (%)</TableCell>
                <TableCell align="right">Dto (€)</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(presupuestoSeleccionado?.productos || []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell align="center">{item.descripcion} </TableCell>
                  <TableCell align="right">{item.cantidad}</TableCell>
                  <TableCell align="right">
                    {parseFloat(
                      item.precio_unitario || item.precioOriginal || 0
                    ).toFixed(2)}{" "}
                    €
                  </TableCell>
                  <TableCell align="right">
                    {item.descuento_porcentaje} %
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(item.descuento || 0).toFixed(2)} €
                  </TableCell>
                  <TableCell align="right">
                    {(
                      parseFloat(
                        item.precio_unitario || item.precioOriginal || 0
                      ) *
                        parseInt(item.cantidad) -
                      parseFloat(item.descuento || 0)
                    ).toFixed(2)}{" "}
                    €
                  </TableCell>
                </TableRow>
              ))}
              {presupuestoSeleccionado?.productos?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay productos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totales */}
        <Box sx={{ textAlign: "right", pr: 2, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Resumen del Presupuesto
          </Typography>
          <Divider sx={{ mb: 1 }} />

          <Typography variant="body2">
            Importe sin IVA:{" "}
            <strong>
              {calcularSubtotalModificado(
                presupuestoSeleccionado?.productos || []
              ).toFixed(2)}{" "}
              €
            </strong>
          </Typography>
          <Typography variant="body2">
            Descuento:{" "}
            <strong>
              {calcularDescuento(
                presupuestoSeleccionado?.productos || []
              ).toFixed(2)}{" "}
              €
            </strong>
          </Typography>
          <Typography variant="body2">
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
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
            Total con IVA: <strong>{totalConIVA.toFixed(2)} €</strong>
          </Typography>
        </Box>

        {/* A cuenta y pendiente */}
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Información Económica
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {renderDato(
            "Cantidad a cuenta (€)",
            "text",
            `${aCuenta.toFixed(2)} €`
          )}
          {renderDato(
            "% A cuenta",
            "text",
            `${aCuentaPorcentaje.toFixed(2)} %`
          )}
          {renderDato(
            "Total pendiente",
            "text",
            `${totalPendiente.toFixed(2)} €`
          )}
        </Grid>

        {/* Documentos */}
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Documentación Recibida
        </Typography>

        {Object.entries(DOCUMENTOS_POR_ROL).map(([rol, docs]) => (
          <Box key={rol} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              {rol.charAt(0).toUpperCase() + rol.slice(1)}
            </Typography>
            <Grid container spacing={1}>
              {docs.map((doc) =>
                renderCheckItem(doc.label, presupuestoSeleccionado?.[doc.key])
              )}
            </Grid>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetallesPresupuesto;
