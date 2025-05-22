/* eslint-disable no-unused-vars */
import React from "react";
import html2pdf from "html2pdf.js";

const PdfPresupuesto = ({ presupuesto }) => {
  const generarPDF = () => {
    const element = document.getElementById("presupuesto-pdf");
    const opciones = {
      margin: 0,
      filename: `${presupuesto.num_presupuesto}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: "#fff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opciones).from(element).save();
  };

  if (!presupuesto || !Array.isArray(presupuesto.productos)) return null;

  // Calculamos los totales
  const calcularSubtotal = (items) => {
    return items.reduce((sum, item) => {
      const precio = parseFloat(item.precio) || 0;
      const cantidad = parseInt(item.cantidad) || 0;
      return sum + precio * cantidad;
    }, 0);
  };

  const subtotal = calcularSubtotal(presupuesto.productos);
  const iva_porcentaje = parseFloat(presupuesto.iva_porcentaje) || 21;
  const totalIva = ((subtotal * iva_porcentaje) / 100).toFixed(2);
  const total = (subtotal + parseFloat(totalIva)).toFixed(2);

  return (
    <div style={{ width: "100%", display: "none" }}>
      <div
        id="presupuesto-pdf"
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "20px",
          fontFamily: "Arial",
          border: "1px solid #000",
        }}
      >
        {/* ENCABEZADO */}
        <div
          style={{
            borderBottom: "1px solid #000",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
            SOLAR SANTOS GONZALEZ S.L.
          </h2>
          <p style={{ margin: "0 0 5px 0" }}>
            Carretera de Cártama, 38, Alhaurín el Grande
          </p>
          <p style={{ margin: "0" }}>
            CIF: B56218951 | Móvil: 722 781 541 | email: info@neorenovables.com
          </p>
        </div>

        {/* DATOS DEL CLIENTE */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
            Datos del Cliente
          </h4>
          <p style={{ margin: "0" }}>
            <strong>
              {presupuesto.nombre_cliente_manual ||
                `${presupuesto.cliente?.nombre} ${presupuesto.cliente?.apellidos}`}
            </strong>
            <br />
            {presupuesto.direccion_instalacion},{" "}
            {presupuesto.poblacion_instalacion}, {presupuesto.codigo_postal}
          </p>
        </div>

        {/* DATOS DEL PRESUPUESTO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <p>
              <strong>Nº Presupuesto:</strong> {presupuesto.num_presupuesto}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(presupuesto.fecha).toLocaleDateString("es-ES")}
            </p>
            <p>
              <strong>Validez:</strong> 30 días
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>
              <strong>Estado:</strong> {presupuesto.estado}
            </p>
            <p>
              <strong>Población:</strong> {presupuesto.poblacion_instalacion}
            </p>
            <p>
              <strong>Código Postal:</strong> {presupuesto.codigo_postal}
            </p>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            border: "1px solid #000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                Cant.
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                Descripción
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                Precio Unitario
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {presupuesto.productos.map((item, index) => {
              const cantidad = parseInt(item.cantidad) || 0;
              const precio = parseFloat(item.precio) || 0;
              const totalItem = (cantidad * precio).toFixed(2);
              return (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {cantidad}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {item.nombre}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      textAlign: "right",
                    }}
                  >
                    {precio.toFixed(2)} €
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      textAlign: "right",
                    }}
                  >
                    {totalItem} €
                  </td>
                </tr>
              );
            })}

            {/* TOTALES */}
            <tr style={{ borderTop: "1px solid #000" }}>
              <td
                colSpan="3"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  borderRight: "1px solid #000",
                }}
              >
                Subtotal
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  border: "1px solid #000",
                }}
              >
                {subtotal.toFixed(2)} €
              </td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  borderRight: "1px solid #000",
                }}
              >
                IVA ({iva_porcentaje}%)
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  border: "1px solid #000",
                }}
              >
                {totalIva} €
              </td>
            </tr>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <td
                colSpan="3"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  borderRight: "1px solid #000",
                }}
              >
                TOTAL
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  border: "1px solid #000",
                }}
              >
                {total} €
              </td>
            </tr>
          </tbody>
        </table>

        {/* NOTAS FINALES */}
        <div style={{ marginTop: "30px" }}>
          <p>
            <strong>Presupuesto no vinculante:</strong> El presente presupuesto
            no constituye oferta comercial ni contrato vinculante.
          </p>
          <p>
            <strong>Forma de pago:</strong> 50% al inicio, 50% al finalizar la
            instalación.
          </p>
          <p>
            <strong>Plazo de ejecución:</strong> 15 días laborables desde
            aceptación.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfPresupuesto;
