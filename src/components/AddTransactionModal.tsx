import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { TransactionCategory } from '../types';

interface AddTransactionModalProps {
    cardId: string;
    onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ cardId, onClose }) => {
    const { addTransaction } = useApp();
    const [formData, setFormData] = useState({
        spentBy: '',
        description: '',
        category: 'Shopping' as TransactionCategory,

        amount: '',
        status: 'Unpaid' as 'Paid' | 'Unpaid',
        date: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount) return;

        addTransaction({
            cardId,
            spentBy: formData.spentBy,
            description: formData.description,
            category: formData.category,
            amount: Number(formData.amount),
            status: formData.status,
            type: 'Expense',
            date: formData.date ? new Date(formData.date).toISOString() : undefined
        });
        onClose();
    };

    const categories: TransactionCategory[] = ['Shopping', 'Food', 'Travel', 'EMI', 'Online', 'Utilities', 'Other'];

    return (
        <div className="modal-overlay">
            <div className="modal-content fade-in-up">
                <h2>Add Expense</h2>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            required
                            type="number"
                            placeholder="0.00"
                            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            autoFocus
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date & Time (Optional)</label>
                            <input
                                type="datetime-local"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Spent By</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. John"
                                value={formData.spentBy}
                                onChange={e => setFormData({ ...formData, spentBy: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description / Purpose</label>
                        <input
                            required
                            type="text"
                            placeholder="Dinner at Place"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Status (Initial)</label>
                        <div className="radio-group">
                            <label className={`radio-option ${formData.status === 'Unpaid' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="Unpaid"
                                    checked={formData.status === 'Unpaid'}
                                    onChange={() => setFormData({ ...formData, status: 'Unpaid' })}
                                /> Unpaid
                            </label>
                            <label className={`radio-option ${formData.status === 'Paid' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="Paid"
                                    checked={formData.status === 'Paid'}
                                    onChange={() => setFormData({ ...formData, status: 'Paid' })}
                                /> Paid
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Add Expense</button>
                    </div>
                </form>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal-content {
          background: #fff;
          padding: 2.5rem;
          border-radius: 20px;
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-height: 90vh; /* Prevent overflow on small screens */
          overflow-y: auto;
        }
        
        @media (max-width: 768px) {
            .modal-content { padding: 1.5rem; }
            .form-row { flex-direction: column; gap: 0; }
            .btn-submit, .btn-cancel { padding: 0.8rem 1rem; }
        }
        h2 { margin-bottom: 2rem; color: #1f2937; }
        
        .form-group { margin-bottom: 1.5rem; }
        .form-row { display: flex; gap: 1.5rem; }
        .form-row .form-group { flex: 1; }
        
        label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-size: 0.9rem; 
            font-weight: 600; 
            color: #4b5563;
        }
        
        input, select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.2s;
            background: #f9fafb;
        }
        input:focus, select:focus {
            outline: none;
            border-color: var(--primary-color);
            background: #fff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }
        
        .radio-group {
          display: flex;
          gap: 1rem;
          background: #f3f4f6;
          padding: 0.5rem;
          border-radius: 12px;
        }
        .radio-option {
           border: none;
           padding: 0.75rem 1rem;
           border-radius: 8px;
           cursor: pointer;
           flex: 1;
           text-align: center;
           font-weight: 500;
           color: #6b7280;
           transition: all 0.2s;
        }
        .radio-option.active {
          background: #fff;
          color: var(--primary-color);
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .radio-option input { display: none; }
        
        .form-actions {
            margin-top: 2.5rem;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }
        .btn-cancel {
            padding: 0.8rem 1.5rem;
            background: transparent;
            color: #6b7280;
            font-weight: 600;
        }
        .btn-cancel:hover { color: #1f2937; background: #f3f4f6; border-radius: 8px; }
        
        .btn-submit {
            padding: 0.8rem 2rem;
            background: var(--primary-color);
            color: white;
            border-radius: 10px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0, 123, 255, 0.2);
        }
        .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 8px rgba(0, 123, 255, 0.25); }

        .fade-in-up { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AddTransactionModal;
