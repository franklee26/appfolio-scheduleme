import React from "react";

const CalendarIndex = props => {
  return (
    <div>
      <h1>My list of calendars for user {props.email}:</h1>
      {props.calendars.map(calendar => (
        <li key={calendar.id}><a href={`/calendar/${calendar.id}`}>{calendar.summary}</a></li>
      ))}
    </div>
  );
};

export default CalendarIndex;
