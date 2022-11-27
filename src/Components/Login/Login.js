import * as React from 'react';
import "./Login.css";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Link} from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useContext, useState} from "react";
import {UserContext} from "../../context/UserContext";

const theme = createTheme();

const Login=()=> {

    const [email, setMail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [userContext, setUserContext] = useContext(UserContext);

    const setEmail = (e) => {
        setMail(e.target.value)
    }

    const setPasswordcbk=(e)=> {
        setPassword(e.target.value)
    }

    const login = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        const genericErrorMessage = "Something went wrong! Please try again later."

        fetch("http://localhost:8080/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password }),
        })
            .then(async response => {
                setIsSubmitting(false)
                if (!response.ok) {
                    if (response.status === 400) {
                        setError("Please fill all the fields correctly!")
                    } else if (response.status === 401) {
                        setError("Invalid email and password combination.")
                    } else {
                        setError(genericErrorMessage)
                    }
                } else {
                    const data = await response.json()
                    setUserContext(oldValues => {
                        return { ...oldValues, token: data.token }
                    })
                }
            })
            .catch(error => {
                setIsSubmitting(false)
                setError(genericErrorMessage)
            })
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <div style={{display: "flex", justifyContent: "center", paddingTop: "50px"}}>
                    <Typography
                        variant="h1"
                        noWrap
                        sx={ {
                            textDecoration: 'none',
                            fontFamily: "Georgia, sans-serif"
                        } }
                        style={ {
                            fontSize: '60px',
                            letterSpacing: '-1px',
                            wordSpacing: '1.2px',
                            color: '#9296F0',
                            fontWeight: '700',
                            fontStyle: 'italic',
                            fontVariant: 'normal',
                            textTransform: 'none'
                    } }
                    >
                        HotelPoliba
                    </Typography>
                </div>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#9296F0' }} >
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" >
                        Accesso
                    </Typography>
                    <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={setEmail}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={setPasswordcbk}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#9296F0'}}
                            onClick={login}
                        >
                            <Link to={"/"}>
                                Accedi
                            </Link>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to={"/"} variant="body2">
                                    Password dimenticata?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/signUp">
                                    <Typography textAlign="center">{"Registrati qui"}</Typography>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export  default  Login;