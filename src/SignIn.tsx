import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth  } from "./TokenContext";

export default function SignIn() {
  const [errorState, setErrorState] = useState<null | string>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const username = email;

    const payload = {
      username,
      password,
    };

    await axios
      .post(
        "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/login",
        payload
      )
      .then((response) => {
        if (response.data.error_code) {
          if (response.data.error_code === 2004) {
            setErrorState("Ошибка авторизации");
          }
  
          console.error("Login error:", response.data);

          return;
        }

        console.log("Login successful:", response.data);
        if (response.data.data) {
          login(response.data.data.token);
          navigate("/table");
        }
      })
  };

  return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 3,
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Добро пожаловать!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Чтобы войти в свой аккаунт, введите ваши учетные данные.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Логин или e-mail"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Запомнить меня"
            />
            {errorState && (
              <Typography variant="subtitle1" color="error" gutterBottom>
                {errorState}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Забыли пароль?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}






   

