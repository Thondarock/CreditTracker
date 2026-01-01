import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CreditCard, Transaction } from '../types';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    where,
    getDocs,
    writeBatch
} from 'firebase/firestore';

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
    const [cards, setCards] = useState<CreditCard[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Real-time Sync for Cards
    useEffect(() => {
        const q = query(collection(db, 'cards'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cardsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CreditCard[];
            setCards(cardsData);
        });
        return () => unsubscribe();
    }, []);

    // Real-time Sync for Transactions
    useEffect(() => {
        const q = query(collection(db, 'transactions'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const txData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[];
            // Sort by date descending
            txData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTransactions(txData);
        });
        return () => unsubscribe();
    }, []);

    const addCard = async (cardData: Omit<CreditCard, 'id' | 'used' | 'available'>) => {
        const newCard = {
            ...cardData,
            used: 0,
            available: cardData.limit,
        };
        await addDoc(collection(db, 'cards'), newCard);
    };

    const deleteCard = async (id: string) => {
        // Delete the card
        await deleteDoc(doc(db, 'cards', id));

        // Delete all associated transactions
        const q = query(collection(db, 'transactions'), where('cardId', '==', id));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    };

    const addTransaction = async (txData: Omit<Transaction, 'id' | 'date'> & { date?: string }) => {
        const newTx = {
            ...txData,
            date: txData.date || new Date().toISOString(),
        };

        // Add Transaction
        await addDoc(collection(db, 'transactions'), newTx);

        // Update Card Balance
        const cardRef = doc(db, 'cards', txData.cardId);
        const card = cards.find(c => c.id === txData.cardId);

        if (card) {
            if (txData.type === 'Expense') {
                const newUsed = card.used + txData.amount;
                await updateDoc(cardRef, {
                    used: newUsed,
                    available: card.limit - newUsed
                });
            } else if (txData.type === 'Payment') {
                const newUsed = Math.max(0, card.used - txData.amount);
                await updateDoc(cardRef, {
                    used: newUsed,
                    available: card.limit - newUsed
                });
            }
        }
    };

    const settleTransaction = async (id: string) => {
        const tx = transactions.find(t => t.id === id);
        if (!tx || tx.status === 'Paid') return;

        // Mark Transaction as Paid
        const txRef = doc(db, 'transactions', id);
        await updateDoc(txRef, { status: 'Paid' });

        // Update Card Balance (Reduce Used Amount)
        const card = cards.find(c => c.id === tx.cardId);
        if (card) {
            const cardRef = doc(db, 'cards', tx.cardId);
            const newUsed = Math.max(0, card.used - tx.amount);
            await updateDoc(cardRef, {
                used: newUsed,
                available: card.limit - newUsed
            });
        }
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
