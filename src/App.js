// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import Viewer from './components/Viewer';
// import CustomWebcam from './components/CustomWebcam';
import Controller from './components/Controller';
import SimpleCms from './components/SimpleCms';
import Gallery from './components/Gallery';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/controller" element={<Controller />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/cms" element={<SimpleCms />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
