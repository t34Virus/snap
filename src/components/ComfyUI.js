import React, { useEffect, useState, useRef } from 'react';
import { generateUUID } from '../common/utils';

const ComfyUIWebSocket = () => {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const client_id = generateUUID(); 
  useEffect(() => {
    const server_address = "127.0.0.1:8188";
    connectWebSocket(server_address, client_id);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = (server_address, client_id) => {
    ws.current = new WebSocket(`ws://${server_address}/ws?clientId=${client_id}`);

    ws.current.onopen = () => {
      console.log('ComfyUI Connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log('Message from server to ComfyUI', message);
    };

    ws.current.onerror = (error) => {
      console.log('ComfyUI Error: ', error);
    };

    ws.current.onclose = (e) => {
      console.log('ComfyUI Disconnected: ', e.reason);
      setIsConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => connectWebSocket(server_address, client_id), 5000);
    };
  };

  const handleSendPrompt = async () => {
    if (isConnected && ws.current) {
      const promptData = {
        number: Date.now(), 
        client_id: client_id, 
        "prompt": {
          "3": {
            "inputs": {
              "seed": 712659071398148,
              "steps": 20,
              "cfg": 8,
              "sampler_name": "euler",
              "scheduler": "normal",
              "denoise": 1,
              "model": [
                "4",
                0
              ],
              "positive": [
                "6",
                0
              ],
              "negative": [
                "7",
                0
              ],
              "latent_image": [
                "11",
                0
              ]
            },
            "class_type": "KSampler",
            "_meta": {
              "title": "KSampler"
            }
          },
          "4": {
            "inputs": {
              "ckpt_name": "v1-5-pruned-emaonly.ckpt"
            },
            "class_type": "CheckpointLoaderSimple",
            "_meta": {
              "title": "Load Checkpoint"
            }
          },
          "6": {
            "inputs": {
              "text": "anime",
              "clip": [
                "4",
                1
              ]
            },
            "class_type": "CLIPTextEncode",
            "_meta": {
              "title": "CLIP Text Encode (Prompt)"
            }
          },
          "7": {
            "inputs": {
              "text": "",
              "clip": [
                "4",
                1
              ]
            },
            "class_type": "CLIPTextEncode",
            "_meta": {
              "title": "CLIP Text Encode (Prompt)"
            }
          },
          "8": {
            "inputs": {
              "samples": [
                "3",
                0
              ],
              "vae": [
                "4",
                2
              ]
            },
            "class_type": "VAEDecode",
            "_meta": {
              "title": "VAE Decode"
            }
          },
          "9": {
            "inputs": {
              "filename_prefix": "ComfyUI",
              "images": [
                "8",
                0
              ]
            },
            "class_type": "SaveImage",
            "_meta": {
              "title": "Save Image"
            }
          },
          "10": {
            "inputs": {
              "image": "example1.jpg",
              "upload": "image"
            },
            "class_type": "LoadImage",
            "_meta": {
              "title": "Load Image"
            }
          },
          "11": {
            "inputs": {
              "pixels": [
                "10",
                0
              ],
              "vae": [
                "4",
                2
              ]
            },
            "class_type": "VAEEncode",
            "_meta": {
              "title": "VAE Encode"
            }
          }
        }
      };
  
    // Sending the prompt data over the WebSocket connection
    ws.current.send(JSON.stringify(promptData));
    console.log('Prompt sent successfully via WebSocket');
  } else {
    console.log('WebSocket not connected.');
  }

  };

  return (
    <div>
      <button className={'captureButton'} onClick={handleSendPrompt}>Send Prompt to ComfyUI</button>
    </div>
  );
};

export default ComfyUIWebSocket;
