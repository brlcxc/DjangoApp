import React, { createContext, useState, useEffect } from 'react';
import api from './api'; // Ensure the path is correct

export const TransactionContext = createContext();

const TransactionProvider = ({ groupUUIDs, children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(groupUUIDs);

    const fetchTransactions = async () => {
        setLoading(true);
        //Here is where I will check the string to see if it is empty before a get request occurs
        try {
            // if (groupUUIDs.length != 0){
                const response = await api.get(`/api/transactions/${groupUUIDs}/`);
                console.log("test 7");

                console.log(response);
                setTransactions(response.data);
            // }
            // else{
            //     console.log("help")
            //     setError("test");
            // }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {
    console.log()
    console.log(groupUUIDs)
    if (groupUUIDs && groupUUIDs.length > 0) {
        fetchTransactions();
    } else {
        setTransactions([]); // Clear transactions if no selected groups
    }
}, [groupUUIDs]);

    const addTransaction = async (newTransaction) => {
        try {
            const response = await api.post(`/api/groups/${groupUUIDs}/transactions/`, newTransaction, {
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
