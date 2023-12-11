import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home';

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/register' element={<Register />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}



export default App;