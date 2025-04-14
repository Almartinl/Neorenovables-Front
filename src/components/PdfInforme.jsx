// components/PdfInforme.jsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const PdfInforme = ({ datosEstudio }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Resumen del Estudio</Text>
        <Text>
          Cliente: {datosEstudio.cliente.nombre} {datosEstudio.cliente.apellido}
        </Text>
        <Text>Ubicación: {datosEstudio.cliente.ubicacion}</Text>
        <Text>Colaborador: {datosEstudio.cliente.colaborador}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Cálculo del Sistema</Text>
        <Text>
          Potencia Instalada: {datosEstudio.calculos.potenciaInstalada} kWp
        </Text>
        <Text>Ahorro Estimado: {datosEstudio.calculos.ahorro}%</Text>
        <Text>Precio por Vatio: {datosEstudio.calculos.precioPorVatio} €</Text>
      </View>

      {/* Puedes añadir gráficos como imágenes si los generas previamente como base64 */}
    </Page>
  </Document>
);

export default PdfInforme;
