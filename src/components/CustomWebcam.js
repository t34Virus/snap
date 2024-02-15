// CustomWebcam.js

import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CustomWebcam = ({ onImageUploadSuccess }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);

        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append("image", file);

                fetch(`${process.env.REACT_APP_SERVER_IP}:3001/upload`, {
                    method: "POST",
                    body: formData,
                })
                .then(data => {
                    console.log('Success:', data);
                    onImageUploadSuccess(imageSrc);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
    }, [webcamRef, onImageUploadSuccess]);

    const retake = () => {
        setImgSrc(null);
    };

    return (
        <div className="container">
            {imgSrc ? (
                <img src={imgSrc} alt="webcam" />
            ) : (
                <Webcam height={600} width={600} ref={webcamRef} />
            )}
            <div className="btn-container">
                {imgSrc ? (
                    <button onClick={retake}>Retake photo</button>
                ) : (
                    <button onClick={capture}>Capture photo</button>
                )}
            </div>
        </div>
    );
};

export default CustomWebcam;
