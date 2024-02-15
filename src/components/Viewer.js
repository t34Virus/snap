import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_SERVER_IP}:3001`);

const Viewer = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    socket.on('newImage', (imageData) => {
        console.log('new image!')
      setImageSrc(imageData);
    });

    socket.on('connect', () => {
        console.log('Viewer Connected to server');
    });

    return () => {
    //   socket.off('newImage');
    };
  }, []);

  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="Shared Content" />}
    </div>
  );
};

export default Viewer;
