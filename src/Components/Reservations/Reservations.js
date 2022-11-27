import Navbar from "../Navbar/Navbar";
import * as React from 'react';
import {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useLocation} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../../context/UserContext";


const Reservations= () =>
{
    const [setStatus] = useState('')

    const location = useLocation()
    const [reservs, setReservs] = React.useState([]);
    const [userContext, setUserContext] = useContext(UserContext);


    useEffect(() => {
        fetch("http://localhost:8080/reservations/".concat(userContext.details?.username))
            .then(res => res.json())
            .then(
                (result) => {
                    setReservs(result);
                    console.log(result);
                    console.log(reservs);
                },
                (error) => {
                    console.log(error)
                }
            )
    }, [])

    return(
        <div>
            <Navbar/>
            <div className={"listContainer"}>
                <div className={"list"}>
                    {
                        reservs.map((res) => (
                            <Grid container spacing={1} style={{padding: "30px"}} key={res._id}>
                                <Grid item xs={2}>
                                    <Typography variant="h5" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Camera : {res.n_room}
                                    </Typography>
                                    <Typography variant="h5" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Utente : {res.email}
                                    </Typography>
                                    <Typography variant="h5" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Numero Persone : {res.n_person}
                                    </Typography>
                                    <Typography variant="h6" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Dal : {res.startDate}
                                    </Typography>
                                    <Typography variant="h6" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Al : {res.endDate}
                                    </Typography>
                                    <Typography variant="h6" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Prezzo : {res.price}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))
                    }
                </div>
            </div>
        </div>
    )

}

export default Reservations;