import React from "react";

const CalendarIndex = props => {
  return (
    <div>
      <h1>My list of calendars:</h1>
      {props.calendars.map(calendar => (
        <li key={calendar.id}>{calendar.summary}</li>
      ))}
    </div>
  );
};

export default CalendarIndex;
