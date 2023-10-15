import React from 'react';
import './App.css';

export default function ImageModal ({ imageUrl, onClose })  {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <img src={imageUrl} className='model-image' alt="Full Screen" />
      </div>
    </div>
  );
};

 
