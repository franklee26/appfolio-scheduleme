import React from "react";

// date format helper
const shortFormatDate = date => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
};

// handle click and post request
const handleClickPost = (event, startTime, endTime) => {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `http://localhost:3000/calendar/hvmm4e43mi5cvhqc6uun07r7mo@group.calendar.google.com/${startTime}/${endTime}`
  );
  xhr.send();
  alert(
    `Successfully added event starting at ${shortFormatDate(
      startTime
    )} to calendar!`
  );
};

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
