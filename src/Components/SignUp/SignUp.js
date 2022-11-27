import * as React from 'react';
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

const SignUp=() =>{

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [email, setMail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userContext, setUserContext] = useContext(UserContext)

    const setEmail = (e) => {
        setMail(e.target.value)
    }

    const setPasswordcbk=(e)=> {
        setPassword(e.target.value)
    }

    const signup = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        const genericErrorMessage = "Something went wrong! Please try again later."

        fetch("http://localhost:8080/signUp", {
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
                    } else if (response.status === 500) {
                        console.log(response)
                        const data = await response.json()
                        if (data.message) setError(data.message || genericErrorMessage)
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Typography
                        variant="h1"
                        noWrap
                        sx={ {
                            textDecoration: 'none',
                            fontFamily: "Lobster, cursive"
                        } }
                        style={ {color: '#5B63B7'} }
                    >
                        PoliHotel
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
                    <Avatar sx={{ m: 1, bgcolor: '#9296F0' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={setEmail}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={setPasswordcbk}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#9296F0'}}
                            onClick={signup}
                        >
                            <Link to={"/"}>
                                Sign Up
                            </Link>
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to={"/login"} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export  default SignUp;