import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const ImageSelectorModal = ({ isOpen, onClose, onSelectImage, title }) => {
    const [images, setImages] = useState([]);

    React.useEffect(() => {
        socket.on('connect', () => {
            console.log('CMS connected from servers');
            socket.emit('cmsConnected');
        });
        
        socket.on('imageList', (imageList) => {
            console.log('imageList', imageList);
            setImages(imageList)
        });
    }, [])
    React.useEffect(() => {
        if (isOpen) {
            socket.emit('getImages');
        }
    },[isOpen])

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-body">
        <h1 className='modal-title'>Select thumbnail for the {title}</h1>
        {images.map((image, index) => (
          <img
            key={index}
            src={`images/${image}`}
            alt={image}
            className="selectable-image thumbnail"
            onClick={() => onSelectImage(`images/${image}`)}
          />
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageSelectorModal;

