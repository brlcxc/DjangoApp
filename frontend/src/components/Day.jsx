// Day.js
import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { TransactionContext } from '../context/TransactionContext';

function Day({ day, row }) {
    const { transactions } = useContext(TransactionContext);

    function getCurrentDay() {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
            ? "bg-dodger-blue w-8 h-8 rounded-full text-white"
            : "";
    }

    const dayString = day.toDate().toLocaleDateString();

    const dayTransactions = transactions.filter((transaction) => {
        const transactionDateString = transaction.start_date
            ? new Date(transaction.start_date).toLocaleDateString()
            : null;
        return transactionDateString === dayString;
    });

    return (
        <div className="border border-gray-200 flex flex-col items-center text-lg relative">
            {row === 0 && (
                <div className="mt-2 text-center">
                    <p>{day.format('dddd')}</p>
                </div>
            )}
            <p className={`mt-2 text-center ${getCurrentDay()}`}>{day.format('DD')}</p>
            {dayTransactions.length > 0 && (
                <div className="mt-1 text-center text-sm">
                    {dayTransactions.map((transaction, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer"
                        >
                            <span className="text-blue-600 underline">
                                {transaction.description || "No description"}
                            </span>
                            <div
                                className={`absolute ${
                                    row === 0 ? 'top-full mt-2' : 'bottom-full mb-2'
                                } left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50`}
                            >
                                {/* Up arrow */}
                                {row === 0 && (
                                    <div className="w-3 h-3 -mb-1 -rotate-45 bg-gray-800"></div>
                                )}
                                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-no-wrap">
                                    <p>
                                        <strong>Description:</strong>{' '}
                                        {transaction.description || 'No description'}
                                    </p>
                                    <p>
                                        <strong>Amount:</strong>{' '}
                                        {transaction.amount
                                            ? `$${parseFloat(transaction.amount).toFixed(2)}`
                                            : '$0.00'}
                                    </p>
                                    <p>
                                        <strong>Category:</strong>{' '}
                                        {transaction.category || 'No category'}
                                    </p>
                                    <p>
                                        <strong>Group:</strong>{' '}
                                        {transaction.group_name || 'No group'}
                                    </p>
                                </div>
                                {/* Down arrow */}
                                {row !== 0 && (
                                    <div className="w-3 h-3 -mt-1 rotate-45 bg-gray-800"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Day;
