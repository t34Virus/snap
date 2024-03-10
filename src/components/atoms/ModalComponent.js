import React, { useState } from 'react';
import '../../App.css';
import CMS from "../../common/cms.json"

const Modal = ({ isOpen, onClose, children, exit }) => {
    if (!isOpen) return null;
    const [prompt, setPrompt] = useState({ theme: '' });

    const handleInputChange = (e) => {
        if (e.target.value === null) return;
        setPrompt({...prompt, theme: e.target.value})
    }
    const handleOnClose = () => {
      onClose(prompt)
    }

    return (
    <div className="modal-overlay" onClick={exit}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className='closeModalButton' onClick={exit}>✕</button>
            {children}
            <input type={'text'} className={'input'} value={prompt.theme} onChange={handleInputChange} placeholder={CMS.assets['Theme Button'].input}/>
            <button className={'defaultButton submit'} onClick={handleOnClose}>Submit</button>
        </div>
    </div>
    );
};

export default Modal;
