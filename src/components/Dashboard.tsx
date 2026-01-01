import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { cards, totalOutstanding, transactions } = useApp();

  // Simple analytics
  const totalLimit = cards.reduce((acc, c) => acc + c.limit, 0);
  const utilization = totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0;

  // Recent transactions (last 5)
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="view-container fade-in">
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card total-outstanding">
          <h3>Total Outstanding</h3>
          <div className="value">{formatCurrency(totalOutstanding)}</div>
          <div className="sub">Across {cards.length} Cards</div>
        </div>

        <div className="stat-card">
          <h3>Total Credit Limit</h3>
          <div className="value">{formatCurrency(totalLimit)}</div>
        </div>

        <div className="stat-card">
          <h3>Utilization</h3>
          <div className="value">{utilization.toFixed(1)}%</div>
          <div className="progress-bar">
            <div className="fill" style={{ width: `${Math.min(utilization, 100)}%`, background: utilization > 30 ? 'var(--warning-color)' : 'var(--success-color)' }}></div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Recent Activity</h2>
        {recentTransactions.length === 0 ? (
          <p className="empty-state">No recent transactions.</p>
        ) : (
          <div className="transaction-list">
            {recentTransactions.map(tx => {
              const card = cards.find(c => c.id === tx.cardId);
              return (
                <div key={tx.id} className="tx-item">
                  <div className="tx-icon">{tx.category[0]}</div>
                  <div className="tx-details">
                    <div className="tx-desc">{tx.description}</div>
                    <div className="tx-meta">{tx.spentBy} • {card?.name}</div>
                  </div>
                  <div className="tx-amount">
                    {tx.type === 'Payment' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .view-container {
          padding: 2rem;
          margin-left: 260px;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
            .view-container {
                margin-left: 0;
                padding: 1rem;
                padding-top: 4rem;
            }
        }
        .page-title {
          margin-bottom: 2rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
        }
        .stat-card h3 {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 0.5rem;
        }
        .stat-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-color);
        }
        .total-outstanding .value {
          color: var(--danger-color);
        }
        .progress-bar {
          height: 6px;
          background: #eee;
          border-radius: 3px;
          margin-top: 1rem;
          overflow: hidden;
        }
        .progress-bar .fill {
          height: 100%;
          border-radius: 3px;
        }
        
        .transaction-list {
          background: #fff;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }
        .tx-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .tx-item:last-child {
          border-bottom: none;
        }
        .tx-icon {
          width: 40px;
          height: 40px;
          background: #f0f2f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 1rem;
        }
        .tx-details {
          flex: 1;
        }
        .tx-desc {
          font-weight: 500;
        }
        .tx-meta {
          font-size: 0.85rem;
          color: #888;
        }
        .tx-amount {
          font-weight: 600;
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
