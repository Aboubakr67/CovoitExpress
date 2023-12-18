import React, { useState } from "react";
import NavigationBar from "../Components/nav/NavigationBar";
import TrajetSearch from "../Components/TrajetSearch";
import LandingPage from "../Components/LandingPage";


function Home() {

    return (<div>
        <NavigationBar></NavigationBar>
        {/* <TrajetSearch></TrajetSearch> */}
        <LandingPage></LandingPage>
    </div>);
}

export default Home;