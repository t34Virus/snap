// Viewer.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CustomWebcam from './CustomWebcam';
// const socket = io('http://localhost:3001', { transports: ['websocket', 'polling'] });
const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });
// const socket = io('http://localhost:3001');

const Viewer = () => {
    // const socket = io(`${window.location.host}:3001`);

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

    socket.on('urdad', () => {
        // setSocketConnected(false)
        console.log('Viewer is looking at your dad')
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });
    
    useEffect(() => {
        socket.connect();

        return () => {
            // socket.disconnect();
        };
    }, []);

    const handleImageUploadSuccess = (imageSrc) => {
        console.log('imageUploaded!')
        socket.emit('urmom');
    };

    return (
        <div>
            <div style={{fontSize: '36px'}}>
                This is the Viewer and websockets are {socketConnected ? 'connected' : 'not connected'}
            </div>
            <button onClick={ () => window.location.reload()}>Refresh</button>
            <CustomWebcam onImageUploadSuccess={handleImageUploadSuccess} />
        </div>
    );
};

export default Viewer;
