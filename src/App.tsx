import { FormEvent, useState, useReducer, useEffect } from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  InputLabel,
  Snackbar,
  Alert,
  SnackbarCloseReason,
} from "@mui/material";
import { Edit, CloudUpload, Save } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import api from "./services/api";
import { Modal, ModalContent, ModalHeader } from "./components/Modal";
import { alertReducer, alert_default_value } from "./reducers/alertReducer";

import logo_passe_verde_green from "./assets/logo_passe_verde_green.svg";
import placeholder_logo from "./assets/placeholder_avatar.webp";

export default function App() {
  const [name, setName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [alertState, dispatchAlertState] = useReducer(
    alertReducer,
    alert_default_value
  );

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1); //incrementing the year + 1

  const formatedDateString = oneYearFromNow.toLocaleDateString("pt-br", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await api.get("/user");

      setUserData(user);
    } catch (err: any) { //eslint-disable-line
      dispatchAlertState({
        type: "SHOW",
        payload: {
          open: true,
          alertType: "error",
          message: err.message,
          duration: 2000,
        },
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await api.put(
        "/user/edit",
        {
          name,
          image,
          validUntil: formatedDateString,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatchAlertState({
        type: "SHOW",
        payload: {
          open: true,
          alertType: "success",
          message: "Salvo com sucesso!",
          duration: 2000,
        },
      });

      setOpenModal(false);
      fetchUserData();
    } catch (err: any) { //eslint-disable-line
      dispatchAlertState({
        type: "SHOW",
        payload: {
          open: true,
          alertType: "error",
          message: err.message,
          duration: 2000,
        },
      });
    }
  };

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image")) {
      dispatchAlertState({
        type: "SHOW",
        payload: {
          open: true,
          alertType: "error",
          message: "O arquivo selecionado não é uma imagem válida!",
          duration: 2000,
        },
      });
    } else {
      setImage(file);
    }
  };

  const handleCloseAlert = (
    _: React.SyntheticEvent<any> | Event, //eslint-disable-line
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;

    dispatchAlertState({ type: "HIDE" });
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          borderRadius: { xs: 0, sm: 5 },
          border: 1,
          borderColor: "gray",
          m: { xs: 0, md: 2 },
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          sx={{
            width: { xs: "100vw", sm: 450 },
            height: { xs: "100vh", sm: 650 },
          }}
        >
          <img
            src={logo_passe_verde_green}
            alt="PasseVerde logo"
            style={{ width: 290, marginTop: 15, marginBottom: 15 }}
          />
          <Divider sx={{ width: "100%", borderColor: "gray" }} />
          <Avatar
            alt="Sua foto"
            src={userData ? userData.profileImage : placeholder_logo}
            sx={{
              width: 180,
              height: 180,
              border: 4,
              borderColor: "#149342",
              mt: 5,
              mb: 3,
            }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">Nome</Typography>
            <Typography
              variant="h4"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "400px",
                whiteSpace: "nowrap",
              }}
            >
              {userData ? userData.name : "Seu nome"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h6">Válido até:</Typography>
            <Typography variant="h4">
              {userData ? userData.validUntil : formatedDateString}
            </Typography>
          </Box>
          <Button
            sx={{ mt: 5, borderRadius: 10 }}
            color="success"
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            <Grid container direction={"row"}>
              <Typography mr={2}>Editar dados</Typography>
              <Edit />
            </Grid>
          </Button>
          <Modal
            maxWidth={"xs"}
            open={openModal}
            onClose={() => setOpenModal(false)}
          >
            <ModalHeader closeButtonAction={() => setOpenModal(false)}>
              Editar
            </ModalHeader>
            <ModalContent>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "96%" },
                }}
                noValidate
                autoComplete="off"
                onSubmit={(e) => handleFormSubmit(e)}
              >
                <InputLabel htmlFor="my-input" sx={{ mb: "2px !important" }}>
                  Nome e sobrenome
                </InputLabel>
                <TextField
                  id="my-input"
                  variant="outlined"
                  fullWidth
                  onChange={({ target }) => setName(target.value)} //fast but not optimal solution
                />
                <Typography sx={{ pt: 2 }}>Mudar imagem</Typography>
                <Button
                  color="info"
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  endIcon={<CloudUpload />}
                  sx={{ mt: 1 }}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={({ target }) =>
                      validateFile((target.files as FileList)[0])
                    }
                  />
                </Button>
                <Button
                  style={{ marginTop: 20 }}
                  color="success"
                  variant="contained"
                  type="submit"
                  endIcon={<Save />}
                  name="saveBTN"
                >
                  Salvar
                </Button>
              </Box>
            </ModalContent>
          </Modal>
        </Grid>
      </Paper>
      {alertState.open && (
        <Snackbar
          open={alertState.open}
          autoHideDuration={alertState.duration}
          onClose={handleCloseAlert}
        >
          <Alert
            severity={alertState.alertType}
            sx={{
              width: "100%",
              display: "absolute !important",
              right: "0px !important",
            }}
            variant="filled"
            elevation={6}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  );
}
