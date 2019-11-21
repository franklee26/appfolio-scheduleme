import React from "react";

/*
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
*/

// how do you tab lol
function tabbing() {
  return (
    <td>
      <td>
        <td>
          <td></td>
        </td>
      </td>
    </td>
  );
}

function shortFormatDate(date) {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
}

// handle click and post request
function handleClickPost(event, startTime, endTime) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `http://localhost:3000/calendar/hvmm4e43mi5cvhqc6uun07r7mo@group.calendar.google.com/${startTime}/${endTime}`
  );
  xhr.send();
  alert("Posted!");
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
      <h2> Freetimes for the next two weeks </h2>
      {props.free_times.map(timeHash => (
        <table>
          <td>
            <a
              href="#"
              onClick={e => {
                handleClickPost(e, timeHash["start"], timeHash["end"]);
              }}
            >
              From {shortFormatDate(timeHash["start"])} to{" "}
              {shortFormatDate(timeHash["end"])}{" "}
            </a>
          </td>
        </table>
      ))}
      <h2> Freebusy calls </h2>
      <table>
        {props.busy_times.map(timeHash => (
          <tr>
            <td>Start: {shortFormatDate(timeHash["start"])}</td>
            {tabbing()}
            <td> End: {shortFormatDate(timeHash["end"])}</td>{" "}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default CalendarIndex;
