import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AddCardModalProps {
  onClose: () => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ onClose }) => {
  const { addCard } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    last4: '',
    limit: 0,
    billDay: 20, // Default to 20th
    theme: 'theme-1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCard(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in-up">
        <h2>Add New Card</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Name (Alias)</label>
            <input
              required
              type="text"
              placeholder="e.g. My HDFC Card"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bank Name</label>
              <input
                required
                type="text"
                placeholder="HDFC"
                value={formData.bank}
                onChange={e => setFormData({ ...formData, bank: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Last 4 Digits</label>
              <input
                required
                type="text"
                maxLength={4}
                placeholder="1234"
                value={formData.last4}
                onChange={e => setFormData({ ...formData, last4: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Credit Limit</label>
            <input
              required
              type="number"
              placeholder="50000"
              value={formData.limit || ''}
              onChange={e => setFormData({ ...formData, limit: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label>Bill Generation Day (1-31)</label>
            <input
              required
              type="number"
              min="1"
              max="31"
              placeholder="20"
              value={formData.billDay}
              onChange={e => setFormData({ ...formData, billDay: Number(e.target.value) })}
            />
            <small style={{ color: '#888', fontSize: '0.8rem' }}>The day of the month when your bill is generated.</small>
          </div>

          <div className="form-group">
            <label>Card Theme</label>
            <div className="theme-selector">
              {['theme-1', 'theme-2', 'theme-3', 'theme-4'].map(theme => (
                <div
                  key={theme}
                  className={`theme-option ${theme} ${formData.theme === theme ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, theme })}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Add Card</button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 16px;
          width: 400px;
          box-shadow: var(--shadow-lg);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        .btn-cancel {
          background: #f0f2f5;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }
        .btn-submit {
          background: var(--primary-color);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
        }
        .theme-selector {
          display: flex;
          gap: 0.5rem;
        }
        .theme-option {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
        }
        .theme-option.selected {
          border-color: #333;
          transform: scale(1.1);
        }
        .theme-option.theme-1 { background: var(--card-gradient-1); }
        .theme-option.theme-2 { background: var(--card-gradient-2); }
        .theme-option.theme-3 { background: var(--card-gradient-3); }
        .theme-option.theme-4 { background: var(--card-gradient-4); }

        .fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AddCardModal;
