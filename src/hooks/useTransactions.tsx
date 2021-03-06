import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type Transaction = {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

type TransactionProviderProps = {
    children: ReactNode;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

type TransactionContextData = {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>
}

const TransactionsContext = createContext<TransactionContextData>({} as TransactionContextData);





export function TransactionsProvider(props: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput, createdAt: new Date()
        });
        const { transaction } = response.data;

        setTransactions([
            ...transactions, transaction
        ]);
    }

    useEffect(() => {
        api.get('/transactions')
            .then(response => setTransactions(response.data.transactions));
    }, []);

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {props.children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext);

    return context;
}