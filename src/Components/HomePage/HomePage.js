import {Card, CardActions, CardContent, CardMedia, Fab} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import * as React from 'react';
import Navbar from "../Navbar/Navbar";
import './HomePage.css';
import {useEffect} from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import {Link, useLocation} from "react-router-dom";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {useContext} from "react";
import { CardActionArea } from '@mui/material';
import {UserContext} from "../../context/UserContext";

const  HomePage= (props) => {
    const [userContext] = useContext(UserContext);

    let [startDate, setStartDate] = React.useState(null);
    let [endDate, setEndDate] = React.useState(null);
    let [person, setPerson] = React.useState('');

    const [rooms, setRooms] = React.useState([]);
    let [freeRooms, setFreeRooms] = React.useState([]);
    let [personRooms, setPersonRooms] = React.useState([]);

    const [reservs, setReservs] = React.useState([]);

    const handleDateChange = (date) => {
        setStartDate(date);
        startDate = date;
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
        endDate = date;
    };
    const handlePersonChange = (event) => {
        setPerson(event.target.value)

    };
    const convertToDate = (date) => {
        let parts = date.split('/');
        let dateString = "" + parts[1] + "/" + parts[0] + "/" + parts[2];
        return new Date(dateString);
    };
    const convertToString = (date)=>{
        let giorno;
        let mese;
        const dDate = date.toDate();
        if(dDate.getDate()<10)
            giorno = "0"+dDate.getDate();
        else
            giorno = dDate.getDate();

        if(dDate.getMonth()+1<10)
            mese = `0${dDate.getMonth()+1}`;
        else
            mese = dDate.getMonth()+1;

        return `${giorno}/${mese}/${dDate.getFullYear()}`;
    }

    const searchRooms = () => {
        setFreeRooms([]);
        let resDate = [];
        setPersonRooms([]);
        const inpDate1 = new Date(startDate);
        const inpDate2 = new Date(endDate);
        let isFree = false;
        rooms.forEach((room, index) => {
            if (room.n_person === parseInt(person)) {
                personRooms.push(room);
            }
        });

        personRooms.forEach((room) => {
            reservs.forEach((res) => {
                const date1 = convertToDate(res.startDate);
                const date2 = convertToDate(res.endDate);

                if (room.n_room === parseInt(res.n_room)) {
                    resDate.push({startDate: date1, endDate: date2});
                }
            })
            resDate.forEach((period) => {
                if (((inpDate1 < period.startDate) && (inpDate2 < period.startDate)) || (inpDate1 > period.endDate))
                    isFree = true;
                freeRooms.forEach((r) => {
                    if (r.n_room === room.n_room) {
                        isFree = false;
                    }
                })
            })
            if (isFree) {
                freeRooms.push(room);
            }
        })

        setRooms(freeRooms);
        console.log(freeRooms);
    };

    const getAllReservations = () => {
        fetch("http://localhost:8080/getAllReservations", {
            "method": "GET",
        })
            .then(res => res.json())
            .then(result => {
                    setReservs(result);
                },
                (error) => {
                    console.log(error)
                }
            )
    };
    const deleteRoom = (event, param) => {
        fetch("http://localhost:8080/deleteRoom", {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({n_room: param})
        })


    };
    const bookingRoom = (event, param) =>{
        console.log(userContext.details);
        fetch("http://localhost:8080/createReservation", {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                n_person: person.toString(),
                n_room: param.n_room.toString(),
                startDate: convertToString(startDate),
                endDate: convertToString(endDate),
                email: userContext.details?.username,
                price: param.price.toString()})
        })

    };
    const getRoom = () => {
        fetch("http://localhost:8080/getRooms", {})
            .then(res => res.json())
            .then(
                (result) => {
                    setRooms(result);
                    getAllReservations();
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    const removeFilters = () =>{
        setEndDate(null);
        setStartDate(null);
        setPerson("");
        setFreeRooms([]);

    };

    useEffect(() => {
        fetch("http://localhost:8080/getRooms", {
    })
        .then(res => res.json())
        .then(
            (result) => {
                setRooms(result);
                getAllReservations();
            },
            (error) => {
                console.log(error)
            }
        )
    },[]);

    return(
        <div>
            <Navbar/>
            <div>
                <Stack className={"stackSearchBar"}
                    direction={{ xs: 'row', sm: 'row' }}
                    spacing={{ xs: 1, sm: 1, md: 2 }}
                    justifyContent="center"
                    alignItems="center"
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label='Arrivo'
                            inputFormat="DD/MM/YYYY"
                            minDate={new Date()}
                            value={startDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label='Partenza'
                            inputFormat="DD/MM/YYYY"
                            minDate={startDate}
                            value={endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': {width: '10ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="outlined-basic"
                                   label="Persone"
                                   variant="outlined"
                                   value={person}
                                   onChange={handlePersonChange}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={searchRooms}
                        sx={ {
                            bgcolor: '#9296F0',
                            marginTop: '100px'
                        }}>
                        CERCA
                    </Button>
                    <Button
                        variant="contained"
                        onClick={removeFilters}
                        sx={ {
                            bgcolor: '#9296F0',
                            marginTop: '100px'
                        }}>
                        RIMUOVI FILTRI
                    </Button>
                </Stack>

            </div>
            <div className={"listContainer"}>
                <div className={"list"} style={{width: "95%", height: "95%"}}>
                    <Grid container spacing={2} style={{padding: "10px"}}>
                        {
                            rooms.map((room) => (
                                <Grid item xs={3} key={room._id}>
                                    <CardActionArea component="span">
                                    <Card style={{width: "95%", height: "95%"}}>
                                        { userContext.details?.type === "admin"  &&
                                            <Stack direction="row" spacing={2} >
                                                <Button variant="outlined" color="error"
                                                onClick={event => deleteRoom(event, room.n_room)}>
                                                    Rimuovi
                                                </Button>
                                            </Stack>
                                        }

                                        <CardMedia
                                            component="img"
                                            image={room.image}
                                        />
                                        <CardContent unselectable={"on"}>
                                            <Typography gutterBottom variant="h5" >
                                                {room.name}
                                            </Typography>
                                            <Typography variant="h5">
                                                {room.price} €
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {room.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {room.n_person} Persone
                                            </Typography>
                                        </CardContent >
                                        <CardActions style={{float: "right", display: "flex", flexDirection: "column"}}>
                                            <Box
                                                sx={{
                                                    color: 'action.active',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    '& > *': {
                                                        marginBottom: 2,
                                                    },
                                                    '& .MuiBadge-root': {
                                                        marginRight: 4,
                                                    },
                                                }}
                                            >
                                            </Box>
                                            <Button   onClick={event => bookingRoom(event, {n_room: room.n_room, price: room.price })} size="small" color="primary">
                                                Prenota
                                            </Button>
                                        </CardActions>
                                    </Card>
                                        </CardActionArea>
                                </Grid>
                            ))
                        }
                    </Grid>
                </div>
            </div>
        </div>
    )



}

export default HomePage;