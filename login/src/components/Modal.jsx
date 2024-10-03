// src/components/Modal.jsx
import React from 'react';
import '../styles/Modal.css';  // Estilos CSS para el modal

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">X</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-close-btn">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
