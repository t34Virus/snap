import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';
import '../App.css'
import ComfyUIWebSocket from './ComfyUI';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const CustomWebcam = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [promptText, setPromptText] = useState("")
    const [triggerPrompt, setTriggerPrompt] = useState(false);
    const [resetImage, setResetImage] = useState(false);
    const displayOutput = useRef(false);

    const videoConstraints = {
        width: 1920,
        height: 1080,
        facingMode: "user", 
    };

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

    const handleTriggered = () => {
        setTriggerPrompt(false);
    }

    useEffect(() => {
        socket.on('capture', capture);
        
        socket.on('retake', () => {
            console.log('retake image!');
            setImgSrc(null);
            setResetImage(true);
            displayOutput.current = false;
        });

        socket.on('countdown', (receivedPrompt) => {
            setPromptText(receivedPrompt);
            setImgSrc(null);
            displayOutput.current = false;
            setResetImage(false);
        });

        socket.on('output_completed', (outputImage) => {
            displayOutput.current = true;
            console.log(outputImage);
        })

        socket.on('confirm', () => {
            setTriggerPrompt(true);
        })

        return () => {
            // socket.off('capture', capture);
            // socket.off('retake');
        };
    }, []);

    return (
        <div className="container" height="100vh" width="100vw">
            <ComfyUIWebSocket promptText={promptText} triggerPrompt={triggerPrompt} handleTriggered={handleTriggered}/>
            
            <Webcam
                audio={false}
                height={'1080'}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={'1920'}
                videoConstraints={videoConstraints}
                style={{ position: 'absolute', top: 0, left: 0 }}
            />

            {
                imgSrc && 
                <img style={{ position: 'absolute', top: 0, left: 0, opacity: resetImage ? 0 : 1}} src={imgSrc} alt="Captured" className="capturedImage"/>
            }
        </div>
    );
};

export default React.memo(CustomWebcam);
