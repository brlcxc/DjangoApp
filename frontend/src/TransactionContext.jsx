import React, { createContext, useState, useEffect } from 'react';
import api from './api';

export const TransactionContext = createContext();

export const TransactionProvider = ({ groupUUIDs, children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get(`/api/transactions/${groupUUIDs}/`);
                setTransactions(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [groupUUIDs]);

    return (
        <TransactionContext.Provider value={{ transactions, loading, error }}>
            {children}
        </TransactionContext.Provider>
    );
};
