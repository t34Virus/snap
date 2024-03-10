import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../App.css';
import CMS from '../common/cms.json'
import Modal from './atoms/ModalComponent';
import { useNavigate } from 'react-router-dom';

const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`, { transports: ['websocket', 'polling'] });

const Controller = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [displayOutput, setDisplayOutput] = useState(false);
    const [step, setStep] = useState(0);
    const [prompt, setPrompt] = useState({
      theme: '',
      gender: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);

    const closeModal = (modalPrompt) => {
      // setPrompt(modalPrompt);
      setPrompt({...prompt, theme: modalPrompt})
      console.log('Input modal value: ', modalPrompt)
      nextStep();
      setIsModalOpen(false);
    };

    const exitModal = () => {
      setIsModalOpen(false);
    }

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Controller connected from servers');
            socket.emit('controllerConnected');
            setSocketConnected(true)
        });

        socket.on('newImage', (imageData) => {
          console.log('new image!')
          setImageSrc(imageData);
          setStep(5);
        });

        socket.on('output_completed', (outputImage) => {
          setDisplayOutput(true);
          setStep(6);
        })

        socket.on('disconnect', () => {
            console.log('Controller Disconnected from server');
            // setSocketConnected(false);
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

    const chooseTheme = (theme) => {
      setPrompt(currentPrompt => ({ ...currentPrompt, theme }));
      nextStep();
    };

    const chooseGender = (gender) => {
        setPrompt(currentPrompt => ({ ...currentPrompt, gender }));
        nextStep();
    };

    const countdown = () => {
      socket.emit('countdown', prompt); 
      nextStep();
    };

    const confirm = () => {
      socket.emit('confirm'); 
      setTimeout(() => {
        navigate('/gallery', {state: {from: 'controller'}});
      }, 2500)
    }

    const retake = (step) => {
      socket.emit('retake');
      setImageSrc(null);
      setStep(step ? step : 1);
      setPrompt({
        theme: '',
        gender: ''
      })
      setDisplayOutput(false);
    };

    const begin = () => {
      nextStep();
      socket.emit('retake');
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
                {/* {!socketConnected && 
                <div>
                  <p>
                  This is the Controller and websockets are not connected
                  </p>
                  <button onClick={ () => window.location.reload()}>Reconnect</button>
                </div>
                }
                  
                  {(socketConnected) && */}
                  <>
                    <button className='startButton' onClick={begin}>
                      <img src={CMS.assets['Start Button'].imagePath} alt="webcam" />
                      <div>{CMS.assets['Start Button'].title}</div>
                      {/* <img src={'/output/ComfyUI.png'} alt="Captured" className="capturedImage" /> */}
                    </button>
                  </>
                  {/* } */}
              </div>
            }
            {
                step === 1 && 
                <div className='themeContainer'>
                    <button className='title'>{CMS.assets['Theme Buttons'].title}</button>
                    <div className='themeButtons'>
                      {CMS.assets['Theme Buttons'].buttons.map((button, index) =>
                        <button
                          key={`themeButtons${index}`}
                          className={''} onClick={() => chooseTheme(button.title)}
                        >
                          <img src={button.imagePath} alt="webcam" />
                        </button>
                      )}
                        <div className='customInput'>
                          {/* <input className={'input'} value={prompt.theme} onChange={(e) => setPrompt({...prompt, theme: e.target.value})} placeholder={CMS.assets['Theme Button'].input}/> */}
                          <button className={'defaultButton input'} onClick={openModal}>{CMS.assets['Theme Buttons']['Submit Button']}</button>
                        </div>
                    </div>
                </div>
            }
            {
              step === 2 && 
                <div className='themeContainer'>
                    <div className='styleButtons'>
                        {Object.entries(CMS.assets['Gender Buttons']).map(([gender, imagePath]) =>
                            <button
                                key={gender}
                                className={'defaultButton'} 
                                onClick={() => chooseGender(gender)}
                            >
                                <img src={imagePath} alt={gender.charAt(0).toUpperCase() + gender.slice(1)} />
                            </button>
                        )}
                        <button className={'defaultButton'} onClick={() => nextStep()}>
                          {CMS.assets['Skip Button'].title}
                        </button>
                    </div>
                </div>
            }
            {
              step === 3 && 
                <button className='captureButton' onClick={countdown}>
                  <img src={CMS.assets['Capture Button'].imagePath} alt={CMS.assets['Capture Button'].title} />
                </button>
            }
            {
              step === 4 && 
                <div className='countdownText'>
                    {CMS.assets['Countdown'].title}
                </div>
            }
            {(imageSrc && step === 5) && (
                <div className='previewContainer'>
                  <img src={imageSrc} alt="Shared Content" />
                  <div>
                    <button className={'defaultButton'} onClick={confirm}>{CMS.assets['Confirm Button'].title}</button>
                    <button className={'defaultButton'} onClick={() => retake(3)}>{CMS.assets['Retake Button'].title}</button>
                  </div>
                </div>
              ) 
            }
            {(displayOutput && step === 6) && (
                <div className='previewContainer'>
                  <img src={'/output/ComfyUI.png'} alt="Captured" className="capturedImage" />
                </div>
              ) 
            }
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} exit={exitModal} />

      </>
    );
};

export default React.memo(Controller);
