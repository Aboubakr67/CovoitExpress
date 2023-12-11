const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const authRoutes = require("./Routes/AuthRoutes");
const app = express();
const port = 4000;
const cookieParser = require("cookie-parser");

app.listen(port, () => {
    console.log("Le serveur est démarrer sur le port", port);
});

mongoose.connect("mongodb://localhost:27017/covoiturage", {
})
    .then(() => {
        console.log("Connexion réussi à la BDD");
    }).catch((err) => {
        console.log(err.message);
    });

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);


app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes);