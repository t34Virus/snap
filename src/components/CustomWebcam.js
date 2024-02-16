import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';

// const socket = io('http://localhost:3001');
const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });
// const socket = io(`http://192.168.1.20:3001`, { transports: ['websocket', 'polling'] });

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
            {imgSrc && 
                <img src={imgSrc} alt="webcam" />    
            }
            <Webcam style={{ opacity: imgSrc ? 0 : 1 }} height={600} width={600} ref={webcamRef} screenshotFormat="image/jpeg" />
        </div>
    );
};

export default CustomWebcam;
