import React from "react";

function formatDate(date) {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
}

const CalendarIndex = props => {
  return (
    <div>
      <h1 align="center">{props.user_type} Calendar Page</h1>
      <h2>
        {props.user.name}'s list of calendars under email {props.user.email}
      </h2>
      {props.calendars.map(calendar => (
        <li key={calendar.id}>
          <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
        </li>
      ))}
      <h2> Freetimes </h2>
      <h2> Freebusy calls </h2>
      {props.busy_times.map(timeHash => (
        <li>
          Start: {formatDate(timeHash["start"])} End:{" "}
          {formatDate(timeHash["end"])}{" "}
        </li>
      ))}
    </div>
  );
};

export default CalendarIndex;
