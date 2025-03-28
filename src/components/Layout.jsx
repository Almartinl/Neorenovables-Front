import * as React from "react";
import { Outlet } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "../components/AppNavbar";
import Header from "../components/Header";
import MainGrid from "../components/MainGrid";
import SideMenu from "../components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
// import {
//   chartsCustomizations,
//   dataGridCustomizations,
//   datePickersCustomizations,
//   treeViewCustomizations,
// } from "../theme/customizations";
import MapCustom from "../components/MapCustom";
import CustomizedDataGrid from "../components/CustomizedDataGrid";
import Grid from "@mui/material/Grid2";

// const xThemeComponents = {
//   ...chartsCustomizations,
//   ...dataGridCustomizations,
//   ...datePickersCustomizations,
//   ...treeViewCustomizations,
// };

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // backgroundColor: "#0367c3",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url('/neo-slide3.jpg')",
          backgroundSize: "cover",
          overflow: "auto",
          height: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
