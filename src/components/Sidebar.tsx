import React from 'react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  currentView: 'dashboard' | string;
  setCurrentView: (view: 'dashboard' | string) => void;
  setShowAddCard: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, setShowAddCard }) => {
  const { cards } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo">
          <h2>💳 CreditTracker</h2>
        </div>

        <div className="nav-menu">
          <button
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <span>📊</span> Dashboard
          </button>

          <div className="nav-section-title">MY CARDS</div>

          {cards.map(card => (
            <button
              key={card.id}
              className={`nav-item ${currentView === card.id ? 'active' : ''}`}
              onClick={() => handleNavClick(card.id)}
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
          z-index: 100;
          transition: transform 0.3s ease;
        }
        
        .mobile-menu-btn {
            display: none;
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 101;
            background: white;
            padding: 0.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-size: 1.5rem;
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            }
            .sidebar.open {
                transform: translateX(0);
            }
            .mobile-menu-btn {
                display: block;
            }
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
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
      <style>{`
            .sidebar-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 90;
                display: none;
            }
            @media (max-width: 768px) {
                .sidebar-overlay { display: block; }
            }
        `}</style>
    </>
  );
};

export default Sidebar;
