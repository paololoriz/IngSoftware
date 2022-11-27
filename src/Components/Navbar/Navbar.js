import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import {Link, Outlet} from "react-router-dom";
import "./Navbar.css";
import {useEffect, useContext, useCallback, useRef} from "react";
import {UserContext} from "../../context/UserContext";

const Navbar = (props) => {

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [userContext, setUserContext] = useContext(UserContext);
    const [isLogged, setLogin] = React.useState(!!userContext.token);

    const handleOpenUserMenu = ( event ) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const logout = () => {
        fetch("http://localhost:8080/logout", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async response => {
            setUserContext(oldValues => {
                return { ...oldValues, details: undefined, token: null }
            })
            window.localStorage.setItem("logout", Date.now())
        })
    };

    const fetchUserDetails = useCallback(() => {
        fetch("http://localhost:8080/me", {
            method: "GET",
            credentials: "include",
            // Pass authentication token as bearer token in header
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async response => {
            if (response.ok) {
                const data = await response.json()
                setUserContext(oldValues => {
                    return { ...oldValues, details: data }
                })
            } else {
                if (response.status === 401) {

                } else {
                    setUserContext(oldValues => {
                        return { ...oldValues, details: null }
                    })
                }
            }
        })
    }, [setUserContext, userContext.token])

    useEffect(() => {
        setLogin(!!userContext.token)
        if (!userContext.details) {
            fetchUserDetails()
        }
    }, [userContext.details, fetchUserDetails])

    function LoginSettings ( props ) {
        if ( props.isLogged ) {
            return (
            <Link to={"/login"} style={ { color: 'black', display: 'block', fontFamily: "Secular One, sans-serif", fontSize: "18px", textDecoration: "none"} }>
                <MenuItem key="logout" onClick={logout}>
                    <Typography textAlign="center">logout</Typography>
                </MenuItem>
            </Link>
            );
        }
        return (
        <Link to="/login" style={ { color: 'black', display: 'block', fontFamily: "Secular One, sans-serif", fontSize: "18px", textDecoration: "none"} }>
            <MenuItem key="login">
                <Typography textAlign="center">login</Typography>
            </MenuItem>
        </Link>
        );
    }

    return (
        <AppBar position="static" style={ {background: '#5B63B7'} }>
            <Container maxWidth={"100%"} style={{margin: "0px"}}>
                <Toolbar disableGutters>
                    <Link to="/" style={ { color: 'white', display: 'block', fontFamily: "Secular One, sans-serif", fontSize: "18px", textDecoration: "none"} }>
                    <Typography
                        variant="h4"
                        noWrap
                        sx={ {
                            textDecoration: 'none',
                            fontFamily: "Lobster, cursive"
                        } }
                        style={ {color: '#F9D923'} }
                    >
                        HotelPoliba
                    </Typography>
                    </Link>
                    <div style={{display: "flex", width:"100%"}}>
                        { userContext.details?.type == "customer"  &&
                        <Box sx={ {flexGrow: 1, display: {xs: 'none', md: 'flex'}} } style={{paddingLeft: "5%", paddingTop: "18px"}}>
                            <Link to="/reservations" state={{ cart: props.cart, totalArticles: props.totalArticles }} style={ { color: 'white', display: 'block', fontFamily: "Secular One, sans-serif", fontSize: "18px", textDecoration: "none"} }>
                                PRENOTAZIONI
                            </Link>
                        </Box> }
                        { userContext.details?.type == "admin"  &&
                            <Box sx={ {flexGrow: 1, display: {xs: 'none', md: 'flex'}} } style={{paddingLeft: "5%", paddingTop: "18px"}}>
                                <Link to="/adminPanel" state={{ cart: props.cart }} style={ { color: 'white', display: 'block', fontFamily: "Secular One, sans-serif", fontSize: "18px", textDecoration: "none"} }>
                                    PRENOTAZIONI CAMERE
                                </Link>
                            </Box>}
                                <Box sx={ {flexGrow: 0} }>
                                <IconButton onClick={ handleOpenUserMenu }>
                                    <Avatar alt={"PoliHotel"}>{ userContext.details?.username[0].toUpperCase() }</Avatar>
                                </IconButton>
                                <Menu
                                    sx={ {mt: '45px'} }
                                    id="menu-appbar"
                                    anchorEl={ anchorElUser }
                                    anchorOrigin={ {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    } }
                                    keepMounted
                                    transformOrigin={ {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    } }
                                    open={ Boolean(anchorElUser) }
                                    onClose={ handleCloseUserMenu }
                                >
                                    <LoginSettings isLogged={isLogged}/>
                                </Menu>
                            </Box>
                    </div>
                </Toolbar>
            </Container>

            <Outlet />
        </AppBar>

    );

};

export default Navbar;