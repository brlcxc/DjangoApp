import React, { useState, useMemo, useContext } from 'react';
import { TransactionContext } from '../TransactionContext'; // Adjust the path as necessary
import { GroupContext } from '../GroupContext'; // Import GroupContext
//the issue is that I am using group context and not the group here for the selection


const TransactionAdd = () => {
    const { addTransaction, transactions } = useContext(TransactionContext);
    const { groups } = useContext(GroupContext); // Access groups from GroupContext

    const [newTransaction, setNewTransaction] = useState({
        date: '',
        description: '',
        type: '',
        amount: '',
        status: 'Pending',
        group: '', // Add group field to transaction data
    });

    const [customCategory, setCustomCategory] = useState('');
    const [isCustomSelected, setIsCustomSelected] = useState(false);

    // Use unique categories or default options
    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(transactions.map((t) => t.category || 'Uncategorized')),
        ];
        return uniqueCategories.length > 0
            ? uniqueCategories
            : ['Direct Payment', 'Deposit'];
    }, [transactions]);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        const transactionAmount = parseFloat(newTransaction.amount);
        const category = isCustomSelected ? customCategory : newTransaction.type;

        const transactionData = {
            category,
            amount: transactionAmount,
            description: newTransaction.description,
            start_date: newTransaction.date,
            end_date: null,
            is_recurrent: false,
            frequency: 0,
            group: newTransaction.group, // Include the selected group in the transaction data
        };

        console.log(newTransaction.group);

        await addTransaction(transactionData); // Use the context's addTransaction function

        console.log(newTransaction.group);
        // Reset the form
        setNewTransaction({
            date: '',
            description: '',
            type: '',
            amount: '',
            status: 'Pending',
            group: '', // Reset group field
        });
        setCustomCategory('');
        setIsCustomSelected(false);
    };

    return (
        <div className="max-w-full">
            <form onSubmit={handleAddTransaction}>
                <h1 className="text-2xl font-bold mb-5 text-black">Add New Transaction</h1>
                <div className="grid grid-cols-5 gap-4 items-start">
                    <input
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) =>
                            setNewTransaction({ ...newTransaction, date: e.target.value })
                        }
                        required
                        className="border rounded p-2 bg-white text-black"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newTransaction.description}
                        onChange={(e) =>
                            setNewTransaction({
                                ...newTransaction,
                                description: e.target.value,
                            })
                        }
                        required
                        className="border rounded p-2 bg-white text-black"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newTransaction.amount}
                        onChange={(e) =>
                            setNewTransaction({ ...newTransaction, amount: e.target.value })
                        }
                        className="border rounded p-2 bg-white text-black"
                    />
                     <select
                        value={newTransaction.group}
                        onChange={(e) => setNewTransaction({ ...newTransaction, group: e.target.value })}
                        className="border rounded p-2 bg-white text-black w-full"
                    >
                        {console.log(newTransaction.group)}
                        <option value="" disabled>
                            Select Group
                        </option>
                        {groups.map((group) => (
                            <option key={group.group_id} value={group.group_id}>
                                {group.group_name}
                            </option>
                        ))}
                    </select>
                    <div className="relative">
                        <select
                            value={newTransaction.type}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNewTransaction({ ...newTransaction, type: value });
                                setIsCustomSelected(value === 'custom');
                            }}
                            className="border rounded p-2 bg-white text-black w-full"
                        >
                            <option value="" disabled>
                                Select Category
                            </option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                            <option value="custom">Add Custom Category</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mt-4 items-center">
                   
                    <button
                        type="submit"
                        className="bg-green-300 hover:bg-green-400 text-black px-8 py-2 rounded col-span-4"
                    >
                        Add Transaction
                    </button>

                    {isCustomSelected && (
                        <input
                            type="text"
                            placeholder="Custom Category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="border rounded p-2"
                        />
                    )}
                </div>
            </form>
        </div>
    );
};

export default TransactionAdd;

