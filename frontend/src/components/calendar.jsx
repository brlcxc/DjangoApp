import React, { useState, useEffect } from 'react';

// Helper function to get dates for the current week
const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday - Saturday : 0 - 6
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date.toISOString().slice(0, 10),
    };
  });
};

const Calendar = () => {
  const [weekDates, setWeekDates] = useState(getWeekDates());
  const [events, setEvents] = useState({});

  useEffect(() => {
    setWeekDates(getWeekDates());
  }, []);

  const addEvent = (date, event) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [date]: [...(prevEvents[date] || []), event],
    }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      {weekDates.map((day) => (
        <div key={day.fullDate} style={{ border: '1px solid #ddd', padding: '10px', width: '120px' }}>
          <h4>{day.day}</h4>
          <p>{day.date}</p>
          <ul>
            {(events[day.fullDate] || []).map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
          <button onClick={() => addEvent(day.fullDate, prompt('Enter event'))}>Add Event</button>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
