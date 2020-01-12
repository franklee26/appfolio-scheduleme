import React from "react";

// handle click and post request
const handleClickPost = (event, startTime, endTime, calendarId) => {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `http://localhost:3000/calendar/${calendarId}/${startTime}/${endTime}`
  );
  xhr.send();
  alert(`Successfully added event starting at ${shortFormatDate(startTime)} to calendar!`);
}

const shortFormatDate = (date) => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
}

const Events = props => {
  return (
    <div>
      {props.events.length ? (
        <h1 align="center">
          Calendar events for {props.events[0].organizer.display_name}:
        </h1>
      ) : (
        "No events in this calendar"
      )}
      <h4> Submit your free times (pulled from the last two weeks from everyone's calendars): </h4>
      {props.free_times.map(timeHash => (
        <table>
          <td>
            <a
              href="#"
              onClick={e => {
                handleClickPost(e, timeHash["start"], timeHash["end"], props.calendar_id);
              }}
            >
              From {shortFormatDate(timeHash["start"])} to{" "}
              {shortFormatDate(timeHash["end"])}{" "}
            </a>
          </td>
        </table>
      ))}
      <ul>
        {props.events.map(event => (
          <li key={event.id}>
            {event.summary} starting at{" "}
            {new Date(Date.parse(event.end.date_time)).toLocaleDateString(
              "en-US",
              { weekday: "long", hour: "2-digit", minute: "2-digit" }
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
