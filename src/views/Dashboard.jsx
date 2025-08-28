import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  // Datos de prueba (luego los reemplazas con tu API)
  const stats = {
    presupuestos: 120,
    clientes: 45,
    productos: 85,
    colaboradores: 12,
    estudios: 34,
  };

  const presupuestosEstado = [
    { name: "Aceptados", value: 50 },
    { name: "Rechazados", value: 30 },
    { name: "Pendientes", value: 40 },
  ];

  const clientesPorMes = [
    { mes: "Ene", clientes: 5 },
    { mes: "Feb", clientes: 8 },
    { mes: "Mar", clientes: 12 },
    { mes: "Abr", clientes: 10 },
    { mes: "May", clientes: 15 },
  ];

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Cards con totales */}
      {Object.entries(stats).map(([key, value]) => (
        <Grid item xs={12} sm={6} md={2.4} key={key}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Gráfico de estados de presupuestos */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Estados de Presupuestos
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={presupuestosEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {presupuestosEstado.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Gráfico de clientes por mes */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Nuevos Clientes por Mes
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={clientesPorMes}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clientes" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
