import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";


function Dashboard() {

    const navigate = useNavigate();

    const [cookie, , removeCookie] = useCookies([]);

    useEffect(() => {
        const verifyUser = async () => {
            if (!cookie.jwt) {
                navigate("/login");
            } else {
                const { data } = await axios.post("http://localhost:4000/api/dashboard", {}, { withCredentials: true });

                if (!data.status) {
                    removeCookie("jwt");
                    navigate("/login");
                } else {
                    toast(`Hi ${data.user}`, { theme: "dark" });
                }
            }
        };
        verifyUser();
    }, [cookie, navigate, removeCookie]);

    const logOut = () => {
        removeCookie("jwt");
        navigate('/login');
    };


    return (
        <>
            <div className="private">
                <h1>Dashboard</h1>
                <button onClick={logOut}>Déconnexion</button>
            </div>
            <ToastContainer />
        </>
    )
}

export default Dashboard;