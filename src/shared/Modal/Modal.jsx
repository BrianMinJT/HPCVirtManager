import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.scss';

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  subtitle,
  className = ''
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-wrapper">
      <div className="modal-overlay" onClick={onClose} />
      <div className={`modal ${className}`}>
        <button className="modal-close" onClick={onClose}>
          <i className="pi pi-times" />
        </button>
        {(title || subtitle) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
