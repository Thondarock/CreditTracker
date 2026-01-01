import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CardView from './components/CardView';
import AddCardModal from './components/AddCardModal';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | string>('dashboard');
  const [showAddCard, setShowAddCard] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowAddCard={setShowAddCard}
      />

      <main className="main-content">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <CardView cardId={currentView} />
        )}
      </main>

      {showAddCard && (
        <AddCardModal onClose={() => setShowAddCard(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
