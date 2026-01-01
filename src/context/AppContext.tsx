import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CreditCard, Transaction } from '../types';
import { generateId } from '../utils/helpers';

interface AppContextType {
    cards: CreditCard[];
    transactions: Transaction[];
    addCard: (card: Omit<CreditCard, 'id' | 'used' | 'available'>) => void;
    deleteCard: (id: string) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date?: string }) => void;
    settleTransaction: (id: string) => void;
    getCardTransactions: (cardId: string) => Transaction[];
    totalOutstanding: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load initial state from LocalStorage
    const [cards, setCards] = useState<CreditCard[]>(() => {
        const saved = localStorage.getItem('cards');
        return saved ? JSON.parse(saved) : [];
    });

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to LocalStorage
    useEffect(() => {
        localStorage.setItem('cards', JSON.stringify(cards));
    }, [cards]);

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    const addCard = (cardData: Omit<CreditCard, 'id' | 'used' | 'available'>) => {
        const newCard: CreditCard = {
            ...cardData,
            id: generateId(),
            used: 0,
            available: cardData.limit,
        };
        setCards([...cards, newCard]);
    };

    const deleteCard = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
        setTransactions(transactions.filter(t => t.cardId !== id));
    };

    const addTransaction = (txData: Omit<Transaction, 'id' | 'date'> & { date?: string }) => {
        const newTx: Transaction = {
            ...txData,
            id: generateId(),
            date: txData.date || new Date().toISOString(),
        };

        setTransactions([newTx, ...transactions]);

        // Update Card Balances
        if (txData.type === 'Expense') {
            setCards(prevCards => prevCards.map(card => {
                if (card.id === txData.cardId) {
                    const newUsed = card.used + txData.amount;
                    return { ...card, used: newUsed, available: card.limit - newUsed };
                }
                return card;
            }));
        }
        // Note: If type is 'Payment' (direct payment), logic handles it similarly but usually settlements are linked to expenses. 
        // For this simple app, we might treat 'Payment' as a credit to the card.
        else if (txData.type === 'Payment') {
            setCards(prevCards => prevCards.map(card => {
                if (card.id === txData.cardId) {
                    const newUsed = Math.max(0, card.used - txData.amount); // Prevent negative used
                    return { ...card, used: newUsed, available: card.limit - newUsed };
                }
                return card;
            }));
        }
    };

    const settleTransaction = (id: string) => {
        // Find the transaction
        const tx = transactions.find(t => t.id === id);
        if (!tx || tx.status === 'Paid') return;

        // Mark as Paid
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'Paid' } : t));

        // Reduce the Used amount of the card (Assuming settling means paying it off back to the bank for that specific item, 
        // OR practically, user gets money back from friend and pays the CC bill. 
        // The requirement says: "When user collects payment back and clears the bill: Mark transaction as Paid... Update Credit Limits accordingly"
        // So yes, it reduces the "Used" amount.

        setCards(prevCards => prevCards.map(card => {
            if (card.id === tx.cardId) {
                const newUsed = Math.max(0, card.used - tx.amount);
                return { ...card, used: newUsed, available: card.limit - newUsed };
            }
            return card;
        }));
    };

    const getCardTransactions = (cardId: string) => {
        return transactions.filter(t => t.cardId === cardId);
    };

    const totalOutstanding = cards.reduce((acc, card) => acc + card.used, 0);

    return (
        <AppContext.Provider value={{
            cards,
            transactions,
            addCard,
            deleteCard,
            addTransaction,
            settleTransaction,
            getCardTransactions,
            totalOutstanding
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
