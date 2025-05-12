import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const categorias = [
  {
    id: "paneles",
    nombre: "Paneles Solares",
    imagen: "/paneles.jpg",
  },
  {
    id: "inversores",
    nombre: "Inversores",
    imagen: "/inversores.webp",
  },
  {
    id: "micro-inversores",
    nombre: "Micro Inversores",
    imagen: "/micro-inversores.webp",
  },
  {
    id: "baterias",
    nombre: "Baterías",
    imagen: "/baterias.webp",
  },
  {
    id: "estructuras",
    nombre: "Estructuras",
    imagen: "/estructuras.webp",
  },
  {
    id: "otros",
    nombre: "Otros",
    imagen: "/otros.webp",
  },
];

export default function Productos() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{ p: 4 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color="white"
        mb={4}
        textAlign="center"
        mt={{ xs: 8, md: 0 }}
      >
        Categorías de Productos
      </Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ overflowY: "auto" }}
      >
        {categorias.map((cat) => (
          <Box key={cat.id}>
            <Card
              sx={{
                height: { xs: "150", sm: "450px" },
                borderRadius: 2,
                boxShadow: 4,
                width: { xs: "150", sm: "400px" },
                p: 2,
              }}
              onClick={() => navigate(`/dashboard/productos/${cat.id}`)}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={cat.imagen}
                  alt={cat.nombre}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" align="center">
                    {cat.nombre}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
