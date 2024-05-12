const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();

const authRoutes = require("./Routes/AuthRoutes");
const VehiculeRoute = require("./Routes/VehiculeRoute");
const TrajetRoute = require("./Routes/TrajetRoute");
const UserRoute = require("./Routes/UserRoutes");
const { notFound, errorhandler } = require("./Middlewares/errorMiddleware");

const app = express();

app.use(express.json({ extented: true }));
app.use(express.urlencoded({ extented: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Le serveur web est lancer sur le port 3000

app.use("/api/auth", authRoutes);
app.use("/api", VehiculeRoute, TrajetRoute, UserRoute);

app.use(notFound);
app.use(errorhandler);

connect(process.env.MONGO_URI)
  .then(
    app.listen(process.env.PORT, () =>
      console.log(`Server as running on port : ${process.env.PORT}`)
    )
  )
  .catch((error) => {
    console.log(error);
  });
