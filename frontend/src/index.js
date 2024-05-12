import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/lux/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./Components/Layout";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Rechercher from "./Pages/Rechercher";
import CreateTrajet from "./Pages/CreateTrajet";
import MyTrajet from "./Pages/MyTrajet";
import TrajetDetails from "./Pages/TrajetDetails";
import CreateVehicule from "./Pages/CreateVehicule";
import MyVehicule from "./Pages/MyVehicule";
import EditVehicule from "./Pages/EditVehicule";
import Profil from "./Pages/Profil";
import Logout from "./Pages/Logout";
import UserProvider from "./context/userContext";
import EditTrajet from "./Pages/EditTrajet";
import VehiculeDetails from "./Pages/VehiculeDetails";
import EditPassword from "./Pages/EditPassword";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "rechercher", element: <Rechercher /> },
      { path: "create-trajet", element: <CreateTrajet /> },
      { path: "mes-trajets", element: <MyTrajet /> },
      { path: "/trajet-details/:id", element: <TrajetDetails /> },
      { path: "/trajet/:id/edit", element: <EditTrajet /> },
      { path: "create-vehicule", element: <CreateVehicule /> },
      { path: "mes-vehicules", element: <MyVehicule /> },
      { path: "/vehicule-details/:id", element: <VehiculeDetails /> },
      { path: "/vehicule/:id/edit", element: <EditVehicule /> },
      { path: "profil", element: <Profil /> },
      { path: "change-password", element: <EditPassword /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
