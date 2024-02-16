import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CustomWebcam from './CustomWebcam';
const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const Viewer = () => {
    const [socketConnected, setSocketConnected] = useState(false);

    socket.on('connect', () => {
        console.log('Viewer connected to server');
        socket.emit('viewerConnected');
        setSocketConnected(true)
    });

    socket.on('disconnect', () => {
        console.log('Viewer disconnected from server');
        setSocketConnected(false)
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });
    
    useEffect(() => {
        socket.connect();

        return () => {};
    }, []);

    return (
        <div>
            <div style={{fontSize: '36px'}}>
                This is the Viewer and websockets are {socketConnected ? 'connected' : 'not connected'}
            </div>
            <button onClick={ () => window.location.reload()}>Refresh</button>
            <CustomWebcam  />
        </div>
    );
};

export default Viewer;
