import dayjs from 'dayjs';

// Utility function to return month matrix using dayjs library:
export function getMonth(month = dayjs().month()) {
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();

    // If dayPtr < 0, last days of previous month will be displayed in first row of calendar
    // Ex. January begins on Tue, Sun + Mon of row 1 will be Dec 29 and 30
    // (Similarly, if dayPtr > end of month, first days of next month displayed in last row)
    let dayPtr = 0 - firstDayOfTheMonth;
    
    // 5 rows (30/7 > 4)
    const daysMatrix = new Array(5).fill([]).map(()=>{
        // 7 columns (days)
        return new Array(7).fill(null).map(()=>{
            dayPtr++;
            return dayjs(new Date(year, month, dayPtr));
        });
    });
    
    return daysMatrix;
}