// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import Viewer from './components/Viewer';
// import CustomWebcam from './components/CustomWebcam';
import Controller from './components/Controller';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/controller" element={<Controller />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
