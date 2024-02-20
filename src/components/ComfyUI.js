import React, { useEffect, useState, useRef } from 'react';
import { generateUUID, generatePromptData } from '../common/utils';

const ComfyUIWebSocket = ({promptText, triggerPrompt, handleTriggered}) => {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const client_id = generateUUID(); 
  useEffect(() => {
    const server_address = "127.0.0.1:8188";
    connectWebSocket(server_address, client_id);

    return () => {
      if (ws.current) {
        // ws.current.close();
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
    handleTriggered();
    if (isConnected && ws.current) {
      const promptData = generatePromptData(client_id, promptText.theme, promptText.gender);
  
      ws.current.send(JSON.stringify(promptData));
      console.log('Prompt sent successfully via WebSocket');
    } else {
      console.log('WebSocket not connected.');
    }

  };

  useEffect(() => {
    if (triggerPrompt) {
      handleSendPrompt();
    }
  }, [triggerPrompt]);
  
  useEffect(() => {
    if (promptText) {
      console.log(promptText);
    }
  }, [promptText]);

  return (
    <div>
      {/* <button className={'captureButton'} onClick={handleSendPrompt}>Send Prompt to ComfyUI</button> */}
    </div>
  );
};

export default ComfyUIWebSocket;
