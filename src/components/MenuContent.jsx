import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { useNavigate } from "react-router-dom";
import { Box, Divider, Typography, Button } from "@mui/material";

const mainListItems = [
  { text: "Clientes", icon: <GroupsRoundedIcon />, url: "/dashboard/clientes" },
  {
    text: "Estudios",
    icon: <AnalyticsRoundedIcon />,
    url: "/dashboard/estudios",
  },
  {
    text: "Presupuestos",
    icon: <AssignmentRoundedIcon />,
    url: "/dashboard/presupuestos",
  },
  {
    text: "Agenda",
    icon: <CalendarMonthRoundedIcon />,
    url: "/dashboard/agenda",
  },
];

const itemList = [
  {
    text: "Productos",
    icon: <CategoryRoundedIcon />,
    url: "/dashboard/productos",
  },

  {
    text: "Colaboradores",
    icon: <BusinessRoundedIcon />,
    url: "/dashboard/colaboradores",
  },
];

const secondaryListItems = [
  { text: "Opciones", icon: <SettingsRoundedIcon /> },
  { text: "Sobre la App", icon: <InfoRoundedIcon /> },
  { text: "Ayuda", icon: <HelpRoundedIcon /> },
];

export default function MenuContent({ drawerOpen }) {
  const navigate = useNavigate();
  function Linkto(ruta) {
    drawerOpen(false)();
    navigate(ruta);
  }
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Clientes
        </Typography>
        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={location.pathname === item.url}
                onClick={() => Linkto(item.url)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Empresa
        </Typography>
        <List dense>
          {itemList.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={location.pathname === item.url}
                onClick={() => Linkto(item.url)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <List dense>
        <ListItem key={0} sx={{ display: "block" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            onClick={() => Linkto("/dashboard")}
          >
            Ver Dashboard
          </Button>
        </ListItem>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index + 1} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
