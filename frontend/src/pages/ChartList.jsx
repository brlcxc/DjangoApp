import Charts from "../components/Charts";
import TransactionAdd from "../components/TransactionAdd";
import TransactionList from "../components/TransactionList2";

function ChartList() {
    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-6xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
            {/* List Section */}
            <div>
                <TransactionList />
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
