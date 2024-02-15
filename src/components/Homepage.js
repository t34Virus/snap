// HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const HomePage = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Connection Status: {connected ? 'Connected' : 'Disconnected'}</h1>
      {connected && (
        <div>
          <Link to="/controller">Go to Controller</Link>
          <br />
          <Link to="/viewer">Go to Viewer</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
