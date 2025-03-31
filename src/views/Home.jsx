/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import SavingsIcon from "@mui/icons-material/Savings";
import AnalyticsIcon from "@mui/icons-material/Analytics"; // Para gráficas de consumo
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        bgcolor: "white", // Fondo blanco
        px: 2,
        overflow: "hidden",
      }}
    >
      {/* LOGO y Botón de Iniciar Sesión */}
      <Box
        sx={{
          width: "100%",
          padding: 2,
          top: 0,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "white",
          zIndex: 1000,
        }}
      >
        <Box display="flex" alignItems="center">
          <img
            src="../../logocalcsolaris.PNG" // Aquí debes poner la ruta de tu logo
            alt="Logo de CalcSolaris"
            style={{ maxHeight: "50px" }}
          />
          <Typography variant="h3" fontFamily="fantasy">
            CalcSolaris
          </Typography>
        </Box>
        <Link to="/login">
          <Button variant="contained" color="warning" size="large">
            Iniciar Sesión
          </Button>
        </Link>
      </Box>

      {/* CARRUSEL DE IMAGEN DE FONDO */}
      <Box
        sx={{
          width: "100vw",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url('/neo-slide3.jpg')", // Ruta de tu imagen
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Imagen de fondo */}
        <motion.div
          initial={{ opacity: 1, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ zIndex: 1 }}
        >
          <Typography
            variant="h4"
            fontFamily="fantasy"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            CalcSolaris
          </Typography>
          <Typography variant="h5" sx={{ color: "white", mt: 2 }}>
            La mejor solucion para la realizacion de Estudios Fotovoltaicos
          </Typography>
        </motion.div>
      </Box>

      {/* FUNCIONALIDADES */}
      <Box sx={{ width: "100%", mt: 8, px: 2 }}>
        <Typography
          variant="h4"
          fontFamily="fantasy"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          🌍 ¿Qué hacemos por ti?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              icon: (
                <SavingsIcon
                  sx={{
                    fontSize: 50,
                    color: "#4CAF50",
                    filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))",
                  }}
                />
              ),
              title: "Consumo Anual",
              description:
                "Calculamos tu consumo energético anual para determinar el uso actual de electricidad en tu hogar o empresa.",
            },
            {
              icon: (
                <SolarPowerRoundedIcon
                  sx={{
                    fontSize: 50,
                    color: "#FFA726",
                    filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))",
                  }}
                />
              ),
              title: "Instalación Fotovoltaica",
              description:
                "Calculamos la instalación de paneles solares y su capacidad de generar energía para cubrir tu consumo anual.",
            },
            {
              icon: (
                <AnalyticsIcon
                  sx={{
                    fontSize: 50,
                    color: "#2196F3",
                    filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))",
                  }}
                />
              ),
              title: "Ahorro Garantizado",
              description:
                "Te mostramos cómo la instalación fotovoltaica reducirá tu factura eléctrica anual, optimizando el consumo y el gasto.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              >
                <Card
                  sx={{
                    backgroundColor: "rgb(255, 123, 0)", // Fondo con algo de transparencia
                    backdropFilter: "blur(10px)", // Difumina lo que está detrás para simular el cristal
                    color: "white", // Texto en blanco para que resalte
                    p: 3,
                    boxShadow: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    border: "2px solid #001aff", // Borde blanco para simular el marco de la ventana
                    borderRadius: "10px", // Bordes redondeados para mayor estilo
                    position: "relative",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FOOTER */}
      <Box sx={{ mt: 5, mb: 3, opacity: 0.8 }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} CalcSolaris - Todos los derechos
          reservados
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
