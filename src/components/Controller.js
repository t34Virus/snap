import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:3001');
// const socket = io('http://localhost:3001', { transports: ['websocket', 'polling'] });
// const socket = io(`http://192.168.1.20:3001`, { transports: ['websocket', 'polling'] });
const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const Controller = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Controller connected from server');
            socket.emit('controllerConnected');
        });

        socket.on('newImage', (imageData) => {
          console.log('new image!')
        setImageSrc(imageData);
      });

        socket.on('disconnect', () => {
            console.log('Controller Disconnected from server');
            setSocketConnected(false);
        });

        socket.on('viewerConnected', () => {
          // setImageSrc(imageData);
          setSocketConnected(true)
        })

        socket.on('newImage', (imageData) => {
          setImageSrc(imageData);
        })

        return () => {
            // socket.off('connect');
            // socket.off('disconnect');
        };
    }, []);

    const capture = () => {
        socket.emit('capture');
    };

    const retake = () => {
        socket.emit('retake');
        setImageSrc(null);
    };

    return (
        <div>
            <div style={{fontSize: '36px'}}>
                This is the Controller and websockets are {socketConnected ? 'connected' : 'not connected'}
            </div>
            {imageSrc ? (
                <>
                  <img src={imageSrc} alt="Shared Content" />
                  <button onClick={retake}>Retake photo</button>
                </>
              ) : (
                <button onClick={capture}>Capture photo</button>
              )
            }


        </div>
    );
};

export default Controller;
