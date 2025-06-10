import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { dataToken } = useAuthContext();
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Link to={"/"}>
        <Box pt={2}>
          <img src="/calcsolaris.png" alt="logo" width="200px" />
        </Box>
      </Link>

      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        {/* <SelectContent /> */}
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={dataToken.nombre}
          src="/default-avatar.png"
          sx={{ width: 36, height: 36, backgroundColor: "#163b5a" }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {dataToken.nombre + " " + dataToken.apellido}
          </Typography>
          {/* {(dataToken.email.length > 22) & (dataToken.email.lenght < 30) ? (
            <Typography
              variant="caption"
              fontSize={9}
              sx={{ color: "text.secondary" }}
            >
              {dataToken.email}
            </Typography>
          ) : dataToken.email.lenght <= 22 ? (
            <Typography
              variant="caption"
              fontSize={11}
              sx={{ color: "text.secondary" }}
            >
              {dataToken.email}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              fontSize={6}
              sx={{ color: "text.secondary" }}
            >
              {dataToken.email}
            </Typography>
          )} */}
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
