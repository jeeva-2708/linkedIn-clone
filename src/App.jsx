import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import PrivateRoute from './pages/PrivateRoute';


function App() {
  return (
    <Routes>
      <Route path='/' element={   
              <Home />
            }/>
      <Route path='/profile' element={  
              <Profile />
            }/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Redirect unknown paths to Login for now */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;