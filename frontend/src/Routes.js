import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';

const RoutesFunc = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={< App />} />
                <Route exact path='/signup' element={< Signup />} />
                <Route exact path='/signin' element={< Signin />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RoutesFunc;