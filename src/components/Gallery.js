import React, { useEffect } from 'react';
import '../App.css'
import CMS from '../common/cms.json';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const Gallery = () => {
    // const navigate = useNavigate();
    const location = useLocation();
    const from = location.state.from;
    useEffect(() => {
        console.log('check state: ', location.state)
        socket.on('connect', () => {
            console.log('Gallery connected to servers');
        });

        socket.on('retake', () => {
            setTimeout(() => {
                navigate(`/${from}`)
            },2500)
        })

    },[])

    const navigate = useNavigate();

    return (
    <div className="modal-overlay">
        <img src={'output/GPU1.png'}/>
        <img src={CMS.assets['Processing'].imagePath}/>
        <button className={'defaultButton'} onClick={() => socket.emit('retake')}>{CMS.assets['Retake Button'].title}</button>
    </div>
    );
};

export default Gallery;
