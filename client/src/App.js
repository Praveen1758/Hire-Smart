// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Component/Home';
import Header from './Component/Header';
import Footer from './Component/Footer';
import Register from './Component/Register';
import Login from './Component/Login';
import Job from './Component/Job';
import SingleJob from './Component/SinlgeJob'
import AppliedJob from './Component/AppliedJob';
import MyProfile from './Component/MyProfile';
import About from './Component/About';
import ChatWidget from './Component/ChatWidget';
// import About from './User/Component/About';



// This wrapper allows useLocation inside App
function AppContent() {

  const location = useLocation();
  const noAppbarRoutes = ['/register', '/login'];
  const noFooterRoutes = ['/register', '/login'];

  return (
    <>
      {/* Conditional Header */}
      {!noAppbarRoutes.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/job" element={<Job />} />
        <Route path="/singlejob/:id" element={<SingleJob />} />
        <Route path="/applications" element={<AppliedJob />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/ChatWidget" element={<ChatWidget />} />

      </Routes>

      {/* Always show Footer, or make this conditional like Header */}
      {!noFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
