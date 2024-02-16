import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';
import '../App.css'

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const CustomWebcam = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);

            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    const formData = new FormData();
                    formData.append("image", file);

                    fetch('http://localhost:3001/upload', {
                        method: "POST",
                        body: formData,
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        socket.emit('imageUploaded', imageSrc);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                });
        }
    }, []);

    useEffect(() => {
        socket.on('capture', capture);
        
        socket.on('retake', () => {
            console.log('retake image!');
            setImgSrc(null);
        });

        return () => {
            socket.off('capture', capture);
            socket.off('retake');
        };
    }, [capture]);

    return (
        <div className="container">
            <Webcam style={{ opacity: imgSrc ? 0 : 1 }} height={1000} width={1000} ref={webcamRef} screenshotFormat="image/jpeg" />
            {imgSrc && <img src={imgSrc} alt="Captured" className="capturedImage" />}    

        </div>
    );
};

export default CustomWebcam;
