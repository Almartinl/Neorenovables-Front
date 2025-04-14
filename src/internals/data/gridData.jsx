import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfInforme from "../../components/PdfInforme";

export function renderAvatar(params) {
  if (params.value == null) {
    return "";
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: "24px",
        height: "24px",
        fontSize: "0.85rem",
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const rows = [
  {
    id: 1,
    nombre: "Alejandro Martín",
    direccion: "Calle Puente 1",
    codigoPostal: "29001",
    lugar: "Málaga",
    ultimaModificacion: "25/03/2025",
  },
  {
    id: 2,
    nombre: "Lucía Fernández",
    direccion: "Avenida Sol 23",
    codigoPostal: "28013",
    lugar: "Madrid",
    ultimaModificacion: "20/03/2025",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    direccion: "Paseo del Prado 15",
    codigoPostal: "28014",
    lugar: "Madrid",
    ultimaModificacion: "18/03/2025",
  },
  {
    id: 4,
    nombre: "Sofía López",
    direccion: "Calle Mayor 45",
    codigoPostal: "41001",
    lugar: "Sevilla",
    ultimaModificacion: "15/03/2025",
  },
  {
    id: 5,
    nombre: "Miguel Sánchez",
    direccion: "Plaza Nueva 8",
    codigoPostal: "41002",
    lugar: "Sevilla",
    ultimaModificacion: "10/03/2025",
  },
  {
    id: 6,
    nombre: "Isabel Romero",
    direccion: "Calle Larios 12",
    codigoPostal: "29005",
    lugar: "Málaga",
    ultimaModificacion: "08/03/2025",
  },
  {
    id: 7,
    nombre: "Daniel Pérez",
    direccion: "Gran Vía 5",
    codigoPostal: "28010",
    lugar: "Madrid",
    ultimaModificacion: "05/03/2025",
  },
  {
    id: 8,
    nombre: "Raquel Torres",
    direccion: "Rambla Catalunya 25",
    codigoPostal: "08007",
    lugar: "Barcelona",
    ultimaModificacion: "03/03/2025",
  },
  {
    id: 9,
    nombre: "Javier Moreno",
    direccion: "Avenida Andalucía 30",
    codigoPostal: "29006",
    lugar: "Málaga",
    ultimaModificacion: "01/03/2025",
  },
  {
    id: 10,
    nombre: "Paula Castillo",
    direccion: "Paseo Marítimo 18",
    codigoPostal: "29620",
    lugar: "Torremolinos",
    ultimaModificacion: "27/02/2025",
  },
  {
    id: 11,
    nombre: "Fernando Herrera",
    direccion: "Calle Feria 33",
    codigoPostal: "41003",
    lugar: "Sevilla",
    ultimaModificacion: "25/02/2025",
  },
  {
    id: 12,
    nombre: "Carmen Domínguez",
    direccion: "Plaza España 7",
    codigoPostal: "08008",
    lugar: "Barcelona",
    ultimaModificacion: "20/02/2025",
  },
  {
    id: 13,
    nombre: "José Luis Vega",
    direccion: "Calle Mayor 12",
    codigoPostal: "28020",
    lugar: "Madrid",
    ultimaModificacion: "18/02/2025",
  },
  {
    id: 14,
    nombre: "Beatriz Molina",
    direccion: "Avenida del Mediterráneo 9",
    codigoPostal: "29640",
    lugar: "Fuengirola",
    ultimaModificacion: "15/02/2025",
  },
  {
    id: 15,
    nombre: "Álvaro Navarro",
    direccion: "Calle Real 28",
    codigoPostal: "11001",
    lugar: "Cádiz",
    ultimaModificacion: "10/02/2025",
  },
  {
    id: 16,
    nombre: "Fernando Herrera",
    direccion: "Calle Feria 33",
    codigoPostal: "41003",
    lugar: "Sevilla",
    ultimaModificacion: "25/02/2025",
  },
  {
    id: 17,
    nombre: "Carmen Domínguez",
    direccion: "Plaza España 7",
    codigoPostal: "08008",
    lugar: "Barcelona",
    ultimaModificacion: "20/02/2025",
  },
  {
    id: 18,
    nombre: "José Luis Vega",
    direccion: "Calle Mayor 12",
    codigoPostal: "28020",
    lugar: "Madrid",
    ultimaModificacion: "18/02/2025",
  },
  {
    id: 19,
    nombre: "Beatriz Molina",
    direccion: "Avenida del Mediterráneo 9",
    codigoPostal: "29640",
    lugar: "Fuengirola",
    ultimaModificacion: "15/02/2025",
  },
  {
    id: 20,
    nombre: "Álvaro Navarro",
    direccion: "Calle Real 28",
    codigoPostal: "11001",
    lugar: "Cádiz",
    ultimaModificacion: "10/02/2025",
  },
];
