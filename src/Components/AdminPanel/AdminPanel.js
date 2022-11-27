import * as React from 'react';
import {Backdrop, ButtonGroup, Fade, Modal, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Navbar from "../Navbar/Navbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useEffect} from "react";
import "./AdminPanel.css";
import Box from "@mui/material/Box";
import {useContext} from "react";
import {UserContext} from "../../context/UserContext";
import axios from "axios";
import {useState} from "react";

const AdminPanel= () =>
{
    const [reservs, setReservs] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [userContext, setUserContext] = useContext(UserContext);
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [n_person, setPerson] = useState(0);
    const [n_room, setNRoom] = useState(0);
    const [description, setDescription] = useState("");
    const [imagePath, setImagePath] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: 10,
        p: 4,
        width: "50%",
        height: "30%"
    };



    useEffect(() => {
        fetch("http://localhost:8080/getAllReservations/")
            .then(res => res.json())
            .then(
                (result) => {
                    setReservs(result);
                },
                (error) => {
                    console.log(error)
                }
            )
    }, [])

    const createRoom = () => {
        const data = {
            name: name,
            image: image.get('camera').name,
            email: userContext.details.username,
            price: price,
            n_room: n_room,
            n_person : n_person,
            description: description
        }
        console.log(data);
        axios.post('http://localhost:8080/image-upload', image)
            .then(res => {
                console.log(res);
            });

        fetch("http://localhost:8080/addRoom", {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        })
        handleClose();
    }

    const getFileInfo = (e) => {
        const formData = new FormData();
        formData.append('camera',e.target.files[0], "camera_"+e.target.files[0].name)
        setImage(formData);
    }

    return (
        <div>
            <Navbar />
            <div className={"listContainer"}>
                <div className={"list"}>
                    {
                        reservs.map((res) => (
                            <Grid container spacing={2} style={{padding: "30px", width:"auto", height: "auto"}} key={res._id}>
                            <Grid item xs={2} >
                                    <Typography variant="h5" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Utente : {res.email}
                                    </Typography>
                                    <Typography variant="h5" component="div" style={{fontFamily: "Secular One, sans-serif", width: "300px"}}>
                                        Camera : {res.n_room}
                                    </Typography>
                                    <Typography variant="h5" component="div" style={{fontFamily: "Secular One, sans-serif" , width: "300px"}}>
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
                <button className={"button"} onClick={handleOpen}>Aggiungi Stanza</button>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <Box
                            style={{'& > :not(style)': { m: 1, width: '25ch'}}}
                            component="form"
                            sx={ style }
                            noValidate
                            autoComplete="off"
                        >
                            <div style={{marginTop: "5px", padding: "10"}}>
                                <TextField value={n_room} onChange={(e) => setNRoom(e.target.value)} id="outlined-basic" label="Numero Stanza" variant="outlined" style={{width: "48%", marginRight: "2%"}}/>
                                <TextField value={name} onChange={(e) => setName(e.target.value)} id="outlined-basic" label="Nome" variant="outlined" style={{width: "48%", marginRight: "2%"}}/>
                                <TextField value={n_person} onChange={(e) => setPerson(e.target.value)} id="outlined-basic" label="Numero Persone" variant="outlined" style={{width: "48%", marginRight: "2%"}}/>
                                <TextField value={description} onChange={(e) => setDescription(e.target.value)} id="outlined-basic" label="Descrizione" variant="outlined" style={{width: "48%", marginRight: "2%"}}/>
                                <TextField value={price} onChange={(e) => setPrice(e.target.value)} id="outlined-basic" label="Prezzo" variant="outlined" style={{width: "48%",marginRight: "2%"}}/>
                                <div>
                                    <input type="file" onChange={getFileInfo}/>
                                </div>
                                <Button size="small" color="primary" style={{width: "100%", marginRight: "2%"}}>
                                    Aggiungi stanza
                                </Button>
                            </div>

                        </Box>
                    </Fade>
                </Modal>
            </div>
        </div>
    );

}

export default AdminPanel;

