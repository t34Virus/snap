import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../App.css';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const Controller = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [step, setStep] = useState(0);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Controller connected from server');
            socket.emit('controllerConnected');
            setSocketConnected(true)
        });

        socket.on('newImage', (imageData) => {
          console.log('new image!')
          setImageSrc(imageData);
          setStep(5);
      });

        socket.on('disconnect', () => {
            console.log('Controller Disconnected from server');
            setSocketConnected(false);
            setStep(0);
        });

        socket.on('viewerConnected', () => {
          // setSocketConnected(true)
          console.log('viewerConnected');
        })

        return () => {};
    }, []);

    const nextStep = () => {
      setStep(step + 1);
    }

    const prevStep = () => {
      setStep(step - 1);
    }

    const countdown = () => {
        socket.emit('countdown');
        nextStep();
    };

    const retake = (step) => {
        socket.emit('retake');
        setImageSrc(null);
        setStep(step ? step : 1);
    };

    return (
      <>
          {(step > 0 && step !== 4) && 
            <div className='header'>
              <button className={'headerButton'} onClick={prevStep}>
                {/* <img src={'../icons/back.png'} alt="webcam" /> */}
                Back
              </button>
              <button className={'headerButton'} onClick={() => {
                setStep(0);
              }}>
                {/* <img src={'../icons/home.png'} alt="webcam" /> */}
                Start Over
              </button>
            </div>
          }
        <div className='controllerContainer'>
            { step === 0 && 
              <div style={{fontSize: '30px', color: 'white'}}>
                {!socketConnected && 
                <div>
                  <p>
                  This is the Controller and websockets are not connected
                  </p>
                  <button onClick={ () => window.location.reload()}>Reconnect</button>
                </div>
                }
                  
                  {(socketConnected) &&
                  <>
                    <button className='startButton' onClick={nextStep}>
                      <img src={'../logo512.png'} alt="webcam" />
                      <div>Begin</div>
                    </button>
                  </>
                  }
              </div>
            }
            {
              step === 1 && 
              <>
                <div className='themeContainer'>
                  <button className='title'>Choose your theme</button>
                  <div className='themeButtons'>
                    <button className={'defaultButton'} onClick={nextStep}>🧙‍♀️ Fantasy 🧙‍♂️</button>
                    <button className={'defaultButton'} onClick={nextStep}>🦸‍♀️ Action Hero 🦸‍♂️</button>
                    <button className={'defaultButton'} onClick={nextStep}>⏳ Time Travel ⌛</button>
                    <button className={'defaultButton'} onClick={nextStep}>🍀 Holiday 🍀</button>
                  </div>
                </div>
                  <input className={'input'} placeholder={'Input your own'}/>
              </>
            }
            {
              step === 2 && 
              <div className='themeContainer'>
                <div className='styleButtons'>
                  <button onClick={nextStep}>
                    <img src={'../images/him.png'} alt="webcam" />
                  </button>
                  <button onClick={nextStep}>
                    <img src={'../images/her.png'} alt="webcam" />
                  </button>
                  <button onClick={nextStep}>
                    Skip this step
                  </button>
                </div>
              </div>
            }
            {
              step === 3 && 
                <button className='captureButton' onClick={countdown}>Capture</button>
            }
            {
              step === 4 && 
                <div className='countdownText'>
                    Counting down...
                </div>
            }
            {(imageSrc && step === 5) && (
                <div className='previewContainer'>
                  <img src={imageSrc} alt="Shared Content" />
                  <button className={'captureButton'} onClick={() => retake(3)}>Retake</button>
                </div>
              ) 
            }
        </div>
      </>
    );
};

export default Controller;
