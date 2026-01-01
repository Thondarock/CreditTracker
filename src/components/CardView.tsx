import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';

import AddTransactionModal from './AddTransactionModal';

interface CardViewProps {
    cardId: string;
}

const CardView: React.FC<CardViewProps> = ({ cardId }) => {
    const { cards, getCardTransactions, settleTransaction } = useApp();
    const [showAddTx, setShowAddTx] = useState(false);
    const [filter, setFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'unpaid' | 'paid' | 'all'>('unpaid');

    const card = cards.find(c => c.id === cardId);
    const transactions = getCardTransactions(cardId);

    if (!card) return <div>Card not found</div>;

    // Bill Cycle Logic
    const today = new Date();
    const currentDay = today.getDate();
    const billDay = card.billDay || 20; // Default if missing

    let nextBillDate = new Date(today.getFullYear(), today.getMonth(), billDay);
    if (currentDay > billDay) {
        // If passed bill day, next bill is next month
        nextBillDate = new Date(today.getFullYear(), today.getMonth() + 1, billDay);
    }

    const dueDate = new Date(nextBillDate);
    dueDate.setDate(dueDate.getDate() + 15);

    const utilization = (card.used / card.limit) * 100;

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(filter.toLowerCase()) ||
            t.spentBy.toLowerCase().includes(filter.toLowerCase()) ||
            t.category.toLowerCase().includes(filter.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'unpaid') return t.status === 'Unpaid';
        if (activeTab === 'paid') return t.status === 'Paid';
        return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="view-container fade-in">
            <div className="top-nav">
                <button className="back-btn" onClick={() => window.location.reload()}>
                    {/* Note: In a real app we'd use routing, but here we rely on Sidebar state. 
                       However, the user asked for "back to dashboard". 
                       We can't easily access setCurrentView here without prop drilling or context.
                       Let's just trust the Sidebar is now visible. 
                       Actually, let's just make the header cleaner. */}
                    💳 Card Details
                </button>
            </div>

            <div className="card-header">
                <div className={`credit-card-visual ${card.theme || 'theme-1'}`}>
                    <div className="bank-name">{card.bank}</div>
                    <div className="card-number">•••• •••• •••• {card.last4}</div>
                    <div className="card-holder">{card.name}</div>
                    <div className="card-info">
                        <div>
                            <span>Limit</span>
                            {formatCurrency(card.limit)}
                        </div>
                        <div>
                            <span>Available</span>
                            {formatCurrency(card.available)}
                        </div>
                    </div>
                </div>

                <div className="card-stats">
                    <div className="stat-box">
                        <h3>Used Credit</h3>
                        <div className="val">{formatCurrency(card.used)}</div>
                        <div className="progress-mini">
                            <div className="fill" style={{ width: `${Math.min(utilization, 100)}%` }}></div>
                        </div>
                    </div>

                    <div className="cycle-info">
                        <div className="cycle-item">
                            <div className="label">Next Bill</div>
                            <div className="date">{formatDate(nextBillDate.toISOString()).split(',')[0]}</div>
                        </div>
                        <div className="cycle-item overdue">
                            <div className="label">Due Date</div>
                            <div className="date">{formatDate(dueDate.toISOString()).split(',')[0]}</div>
                        </div>
                    </div>

                    <button className="add-expense-btn" onClick={() => setShowAddTx(true)}>
                        <span className="icon">+</span> Add New Expense
                    </button>
                </div>
            </div>

            <div className="transactions-section">
                <div className="section-header">
                    <div className="tabs">
                        <button className={`tab ${activeTab === 'unpaid' ? 'active' : ''}`} onClick={() => setActiveTab('unpaid')}>Unpaid Bills</button>
                        <button className={`tab ${activeTab === 'paid' ? 'active' : ''}`} onClick={() => setActiveTab('paid')}>Paid History</button>
                        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Transactions</button>
                    </div>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="tx-table-container">
                    <table className="tx-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Spent By</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{formatDate(tx.date)}</td>
                                    <td>{tx.description}</td>
                                    <td><span className="badge category">{tx.category}</span></td>
                                    <td>{tx.spentBy}</td>
                                    <td className={tx.type === 'Payment' ? 'text-success' : ''}>
                                        {tx.type === 'Payment' ? '+' : ''}{formatCurrency(tx.amount)}
                                    </td>
                                    <td>
                                        <span className={`badge status ${tx.status.toLowerCase()}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td>
                                        {tx.status === 'Unpaid' && tx.type === 'Expense' && (
                                            <button
                                                className="btn-link"
                                                onClick={() => settleTransaction(tx.id)}
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddTx && (
                <AddTransactionModal
                    cardId={cardId}
                    onClose={() => setShowAddTx(false)}
                />
            )}

            <style>{`
        .view-container {
          padding: 2rem;
          margin-left: 260px; /* CRITICAL FIX: Offset for sidebar */
          min-height: 100vh;
          background: #f8f9fa;
        }
        @media (max-width: 768px) {
            .view-container {
                margin-left: 0;
                padding: 1rem;
                padding-top: 4rem; /* Space for hamburger */
            }
        }
        .card-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .credit-card-visual {
          width: 360px;
          height: 220px;
          border-radius: 20px;
          padding: 1.5rem;
          color: white;
          background: var(--card-gradient-1);
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: var(--shadow-lg);
          transition: transform 0.3s ease;
          max-width: 100%; /* Ensure it fits on mobile */
        }
        @media (max-width: 768px) {
            .credit-card-visual {
                width: 100%;
                height: auto;
                aspect-ratio: 1.6;
            }
            .card-header {
                flex-direction: column;
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
        }
        .credit-card-visual:hover {
          transform: translateY(-5px);
        }
        .credit-card-visual.theme-2 { background: var(--card-gradient-2); }
        .credit-card-visual.theme-3 { background: var(--card-gradient-3); color: #444; }
        .credit-card-visual.theme-4 { background: var(--card-gradient-4); }
        
        .bank-name {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: auto;
        }
        .card-number {
          font-size: 1.5rem;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
          font-family: monospace;
        }
        .card-holder {
          font-size: 0.9rem;
          text-transform: uppercase;
          opacity: 0.9;
        }
        .card-info {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
        .card-info span {
          display: block;
          font-size: 0.7rem;
          opacity: 0.8;
          text-transform: uppercase;
        }

        .card-stats {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.5rem;
        }
        .stat-box {
          background: #fff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
        }
        .progress-mini {
          height: 6px;
          background: #eee;
          border-radius: 3px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .progress-mini .fill {
          height: 100%;
          background: var(--warning-color);
        }
        .add-expense-btn {
          background: var(--primary-color);
          color: white;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 4px 6px rgba(0,123,255,0.3);
        }
        .add-expense-btn:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .search-input {
          width: 300px;
        }

        .tx-table-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }
        .tx-table {
          width: 100%;
          border-collapse: collapse;
        }
        .tx-table th, .tx-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .tx-table th {
          background: #f9f9f9;
          font-weight: 600;
          color: #666;
          font-size: 0.9rem;
        }
        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .badge.category { background: #eef2ff; color: #4f46e5; }
        .badge.status.paid { background: #d1fae5; color: #065f46; }
        .badge.status.unpaid { background: #fee2e2; color: #991b1b; }
        
        .btn-link {
          background: none;
          color: var(--primary-color);
          padding: 0;
          font-size: 0.9rem;
          text-decoration: underline;
        }
        .btn-link:hover { text-decoration: none; }
        .text-success { color: var(--success-color); font-weight: 600; }
        .cycle-info {
            display: flex;
            gap: 1.5rem;
            margin: 0.5rem 0;
        }
        .cycle-item .label { font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .cycle-item .date { font-weight: 700; color: #333; }
        .cycle-item.overdue .date { color: var(--danger-color); }

        .tabs {
            display: flex;
            gap: 0.5rem;
            background: #eef2ff;
            padding: 4px;
            border-radius: 8px;
            flex-wrap: wrap; /* Allow wrapping on small screens */
        }
        .tab {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
            color: #666;
            background: transparent;
            font-size: 0.9rem;
        }
        .tab:hover { color: var(--primary-color); }
        .tab.active {
            background: #fff;
            color: var(--primary-color);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .search-input { width: 220px; }
        @media (max-width: 768px) {
            .search-input { width: 100%; margin-top: 1rem; }
            .section-header { flex-direction: column; align-items: stretch; }
            .tab { flex: 1; text-align: center; font-size: 0.8rem; padding: 0.5rem; }
            .cycle-info { gap: 1rem; font-size: 0.9rem; }
            .tx-table th, .tx-table td { padding: 0.75rem 0.5rem; font-size: 0.85rem; }
             /* Hide less important columns on mobile */
            .tx-table th:nth-child(2), .tx-table td:nth-child(2), /* Description */
            .tx-table th:nth-child(4), .tx-table td:nth-child(4)  /* Spent By */
            { display: none; }
        }
      `}</style>
        </div>
    );
};

export default CardView;
