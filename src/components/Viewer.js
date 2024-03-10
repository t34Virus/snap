import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import CustomWebcam from './CustomWebcam';
import '../App.css'
import CMS from '../common/cms.json'
import { useNavigate } from 'react-router-dom';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const Viewer = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const countdownInterval = useRef(null);
    const [countdown, setCountdown] = useState(5);
    const [showCountdown, setShowCountdown] = useState(false);
    const [triggerCapture, setTriggerCapture] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            console.log('Viewer connected to server');
            socket.emit('viewerConnected');
            setSocketConnected(true)
        });

        socket.on('retake', () => {
            setTriggerCapture(false);
            setShowCountdown(false);
            setCountdown(5);            
        })
    
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

        socket.on('output_completed', (outputImage) => {
            if (triggerCapture) {
                setTriggerCapture(false);
                setShowCountdown(false);
                setCountdown(5);
            }
        })

        socket.on('countdown', () => {
            clearInterval(countdownInterval.current);
            let counter = 5;
            setShowCountdown(true);
            countdownInterval.current = setInterval(() => {
                counter--
                if (counter <= -1) {
                    clearInterval(countdownInterval.current);
                    console.log('emitting capture');
                    setTriggerCapture(true);
                    socket.emit('capture');
                }
                setCountdown(counter);
            },1000)
        })

        socket.on('confirm', () => {
            setTimeout(() => {
                navigate('/gallery', {state: {from: 'viewer'}});
            }, 2500)
        })

        return () => {};
    }, []);

    return (
        <>
            <div className='viewerContainer'>
                <div className='webcamContainer'>
                    {showCountdown &&
                        <div className={`countdown ${countdown === 1 || countdown === 0 ? 'flash' : ''}`}>
                            <p>
                                {countdown >= 0 ? countdown : CMS.assets['Processing'].title}
                            </p>
                        </div>
                    }
                    <CustomWebcam  />
                </div>
            </div>
        </>
    );
};

export default Viewer;
