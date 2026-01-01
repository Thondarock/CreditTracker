
export interface CreditCard {
    id: string;
    name: string;
    bank: string;
    last4: string;
    limit: number;
    used: number;
    available: number;
    billDay: number;
    theme: string; // css class for gradients
}

export type TransactionCategory = 'Shopping' | 'Food' | 'Travel' | 'EMI' | 'Online' | 'Utilities' | 'Other';

export interface Transaction {
    id: string;
    cardId: string;
    spentBy: string;
    description: string;
    category: TransactionCategory;
    amount: number;
    date: string; // ISO string
    status: 'Paid' | 'Unpaid';
    type: 'Expense' | 'Payment';
}
