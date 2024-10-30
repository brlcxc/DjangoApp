import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const TransactionContext = createContext();

const TransactionProvider = ({ groupUUIDs, children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/transactions/${groupUUIDs}/`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {

    if (groupUUIDs && groupUUIDs.length > 0) {
        fetchTransactions();
    } else {
        setTransactions([]); // Clear transactions if no selected groups
    }
}, [groupUUIDs]);

    const addTransaction = async (newTransaction) => {
        try {
            const response = await api.post(`/api/groups/${newTransaction.group}/transactions/`, newTransaction, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Assuming the API responds with the created transaction
            setTransactions((prevTransactions) => [...prevTransactions, response.data]);
        } catch (error) {
            console.error('Failed to add transaction:', error);
            setError(error);
        }
    };

    const contextValue = {
        transactions,
        loading,
        error,
        addTransaction,
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
};

export { TransactionProvider };
