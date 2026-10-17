import React from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';
import { playClick, playPaper } from '../../audio/soundEngine';

export default function DocumentModal({ 
  title, 
  content, 
  onClose, 
  onMarkRead,
  isRead = false 
}) {
  const handleMarkRead = () => {
    playClick();
    if (onMarkRead) onMarkRead();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <FileText size={18} color="var(--accent-cyan)" />
            <span className="modal-title-text">{title}</span>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => {
              playClick();
              onClose();
            }}
            aria-label="Zamknij"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="paper-document">
            <div className="paper-stamp">POUFNE / 2007</div>
            <h3 className="paper-heading">{title}</h3>
            <div className="paper-text">{content}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn-primary" onClick={handleMarkRead}>
              <CheckCircle size={16} />
              <span>{isRead ? 'Zamknij podgląd' : 'Zbadano i zapamiętano'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
