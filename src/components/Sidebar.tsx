import React from 'react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
    currentView: 'dashboard' | string;
    setCurrentView: (view: 'dashboard' | string) => void;
    setShowAddCard: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, setShowAddCard }) => {
    const { cards } = useApp();

    return (
        <div className="sidebar">
            <div className="logo">
                <h2>💳 CreditTracker</h2>
            </div>

            <div className="nav-menu">
                <button
                    className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setCurrentView('dashboard')}
                >
                    <span>📊</span> Dashboard
                </button>

                <div className="nav-section-title">MY CARDS</div>

                {cards.map(card => (
                    <button
                        key={card.id}
                        className={`nav-item ${currentView === card.id ? 'active' : ''}`}
                        onClick={() => setCurrentView(card.id)}
                    >
                        <span>💳</span> {card.name}
                        <small style={{ marginLeft: 'auto', fontSize: '0.8em', opacity: 0.7 }}>{card.bank}</small>
                    </button>
                ))}

                <button className="add-card-btn" onClick={() => setShowAddCard(true)}>
                    + Add New Card
                </button>
            </div>

            <style>{`
        .sidebar {
          width: 260px;
          background: #fff;
          height: 100vh;
          border-right: 1px solid #eee;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: fixed;
          left: 0;
          top: 0;
        }
        .logo {
          margin-bottom: 2rem;
          color: var(--primary-color);
        }
        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .nav-section-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #888;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          color: #555;
          text-align: left;
          background: transparent;
        }
        .nav-item:hover {
          background: #f5f7fa;
          color: var(--primary-color);
        }
        .nav-item.active {
          background: #e6f0ff;
          color: var(--primary-color);
        }
        .add-card-btn {
          margin-top: 1rem;
          background: transparent;
          border: 1px dashed #ccc;
          color: #666;
          padding: 0.75rem;
          border-radius: 8px;
          width: 100%;
        }
        .add-card-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
      `}</style>
        </div>
    );
};

export default Sidebar;
