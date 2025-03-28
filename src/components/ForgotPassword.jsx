import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TextField } from "@mui/material";

function ForgotPassword({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>Restablecer Contraseña</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          Introduzca su dirección de correo electrónico y le enviaremos un
          enlace para restablecer su contraseña.
        </DialogContentText>
        <TextField
          autoFocus
          required
          id="email"
          name="email"
          label="Email"
          placeholder="Direccion de Email"
          type="email"
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button color="secondary" variant="contained" type="submit">
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
