// HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const HomePage = () => {
  const [connected, setConnected] = useState(false);
  // const socket = io(`${window.location.host}:3001`);
  // console.log(socket);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
      socket.connect();
    });
    
    socket.on('retake', () => {
      console.log('retake image!');
    });

    return () => {
      // socket.off('connect');
      // socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Connection Status: {connected ? 'Connected' : 'Disconnected'}</h1>
      <button onClick={ () => window.location.reload()}>Refreshing</button>
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
