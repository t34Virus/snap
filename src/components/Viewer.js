import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import CustomWebcam from './CustomWebcam';
import '../App.css'

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const Viewer = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const countdownInterval = useRef(null);
    const [countdown, setCountdown] = useState(5);
    const [showCountdown, setShowCountdown] = useState(false);
    const [triggerCapture, setTriggerCapture] = useState(false);

    useEffect(() => {
        if (triggerCapture) {
            socket.emit('capture');
            setTriggerCapture(false);
            setShowCountdown(false);
            setCountdown(5);
        }
        return () => {};
    }, [triggerCapture]);

    useEffect(() => {
        socket.connect();

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
        
        socket.on('controllerConnected', () => {
            setSocketConnected(true)
            console.log('controllerConnected');
        })
    
        socket.on('countdown', () => {
            clearInterval(countdownInterval.current);
            let counter = countdown;
            setShowCountdown(true);
            countdownInterval.current = setInterval(() => {
                counter--
                if (counter <= 0) {
                    clearInterval(countdownInterval.current);
                    console.log('emitting capture');
                    setTriggerCapture(true);
                }
                setCountdown(counter);
            },1000)
        })

        return () => {};
    }, [countdown]);

    return (
        <>
            <div className='viewerContainer'>
                {socketConnected &&
                <div className='webcamContainer'>
                    {showCountdown &&
                        <div className='countdown'>
                            <p>
                                {countdown}
                            </p>
                        </div>
                    }
                    <CustomWebcam  />
                </div>
                }
            </div>
        </>
    );
};

export default Viewer;
