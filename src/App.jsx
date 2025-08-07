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
      <Route path='/' element={   <PrivateRoute>
              <Home />
            </PrivateRoute>}/>
      <Route path='/profile' element={  <PrivateRoute>
              <Profile />
            </PrivateRoute>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Redirect unknown paths to Login for now */}
     
    </Routes>
  );
}

export default App;