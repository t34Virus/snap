// Controller.js

import React, { useEffect } from 'react';
import io from 'socket.io-client';
import CustomWebcam from './CustomWebcam';

// const socket = io(`${process.env.REACT_APP_SERVER_IP}:3001`);
const socket = io('http://localhost:3001');

const Controller = () => {
    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('urmom');
            console.log('Controller Connected to server');
        });
    
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleImageUploadSuccess = (imageSrc) => {
        console.log('imageUploaded!')
        // socket.emit('imageUploaded', imageSrc);
        socket.emit('urmom');
    };

    return (
        <div>
            <CustomWebcam onImageUploadSuccess={handleImageUploadSuccess} />
        </div>
    );
};

export default Controller;
