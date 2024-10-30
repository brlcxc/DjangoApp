import dayjs from "dayjs";

function Day({day,row}){
    function getCurrentDay(){
        return day.format("DD-MM-YY")===dayjs().format("DD-MM-YY")?"bg-dodger-blue w-8 h-8 rounded-full text-white":"";
    }
    return(
        <div className="border border-gray-200 flex flex-col items-center text-lg">
            {row === 0 && (
                <div className="mt-2 text-center">
                    <p>{day.format('dddd')}</p>
                </div>
            )}
            <p className={`mt-2 text-center ${getCurrentDay()}`}>{day.format('DD')}</p>
        </div>
    )
}

export default Day;