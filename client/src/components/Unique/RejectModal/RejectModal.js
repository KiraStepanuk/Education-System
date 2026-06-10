import React, { useState } from 'react';
import './RejectModal.css';

const RejectModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Відхилити заявку</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <label className="modal-label">Причина відхилення</label>
          <textarea
            className="modal-textarea"
            placeholder="Введіть коментар..."
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <div className="char-count">{reason.length} / 500 символів</div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className="confirm-btn">
              Відхилити та додати коментар
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectModal;