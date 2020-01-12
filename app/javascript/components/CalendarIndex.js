import React from "react";

const CalendarIndex = props => {
  return (
    <div className="container">
      <h1 align="center">{props.user_type} Calendar Page</h1>
      <h2>
        {props.user.name}'s list of calendars under email {props.user.email}
      </h2>
      <h2>Please select a calendar below to add an event.</h2>
      {props.calendars.map(calendar => (
        <li key={calendar.id}>
          <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
        </li>
      ))}
      <h2>Your landowner: James Gelb</h2>
      <h2>
        <a href="/landowner">You have submitted several jobs</a>
      </h2>
    </div>
  );
};

export default CalendarIndex;
