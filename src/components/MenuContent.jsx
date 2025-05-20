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
import { useNavigate } from "react-router-dom";

const mainListItems = [
  { text: "Estudios", icon: <AnalyticsRoundedIcon />, url: "/dashboard" },
  {
    text: "Productos",
    icon: <CategoryRoundedIcon />,
    url: "/dashboard/productos",
  },
  { text: "Colaboradores", icon: <PeopleRoundedIcon /> },
  {
    text: "Presupuestos",
    icon: <AssignmentRoundedIcon />,
    url: "/dashboard/presupuestos",
  },
];

const secondaryListItems = [
  { text: "Opciones", icon: <SettingsRoundedIcon /> },
  { text: "Sobre la App", icon: <InfoRoundedIcon /> },
  { text: "Ayuda", icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  function Linkto(ruta) {
    navigate(ruta);
  }
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
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
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
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
