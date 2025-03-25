import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import Header from "../components/Header";
import CustomizedDataGrid from "../components/CustomizedDataGrid";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Estudios() {
  const navigate = useNavigate();
  function Linkto(ruta) {
    navigate(ruta);
  }
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        mx: 3,
        pb: 5,
        mt: { xs: 8, md: 0 },
      }}
    >
      <Stack
        direction="row"
        sx={{
          display: { xs: "flex" },
          width: "100%",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "flex-end",
          maxWidth: { sm: "100%", md: "1700px" },
          pt: { xs: 3, sm: 4, md: 2 },
          pb: 0,
        }}
        spacing={2}
      >
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            variant="contained"
            color="warning"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => Linkto("/crear-estudio")}
          >
            Crear Nuevo Estudio
          </Button>
        </Stack>
      </Stack>
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%" },
          backgroundColor: "white",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.59)",
          borderRadius: 3,
        }}
      >
        <Grid size={{ xs: 12 }}>
          <CustomizedDataGrid />
        </Grid>
      </Box>
    </Stack>
  );
}
