import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList";

function ChartList() {
    const fakeTransactions = [
        {
          id: 1,
          date: '2024-10-20',
          description: 'Grocery Store',
          type: 'Direct Payment',
          amount: -50.25,
          balance: 949.75,
          status: 'Completed'
        },
        {
          id: 2,
          date: '2024-10-22',
          description: 'Paycheck Deposit',
          type: 'Deposit',
          amount: 1200.00,
          balance: 2149.75,
          status: 'Completed'
        },
        {
          id: 3,
          date: '2024-10-23',
          description: 'Coffee Shop',
          type: 'Direct Payment',
          amount: -5.75,
          balance: 2144.00,
          status: 'Completed'
        },
        {
          id: 4,
          date: '2024-10-25',
          description: 'Rent Payment',
          type: 'Direct Payment',
          amount: -800.00,
          balance: 1344.00,
          status: 'Completed'
        },
        {
          id: 5,
          date: '2024-10-26',
          description: 'Gym Membership',
          type: 'Direct Payment',
          amount: -60.00,
          balance: 1284.00,
          status: 'Completed'
        },
      ];
    
    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-6xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
            {/* List Section */}
            <div>
                <TransactionList transactions={fakeTransactions}/>
            </div>
            {/* Chart Section */}
            <div>
                <Charts />
            </div>
            {/* Form Section */}
            <div className="col-span-2">
                <TransactionAdd />
            </div>
        </div>
    );
}

export default ChartList;
