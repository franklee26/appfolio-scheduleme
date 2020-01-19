import React, { useState, useEffect } from "react";

// handle click and post request
const handleClickPost = (
  event,
  startTime,
  endTime,
  calendarId,
  calendarName
) => {
  event.preventDefault();
  fetch(
    `http://localhost:3000/calendar/${calendarId}/${startTime}/${endTime}`,
    { method: "POST" }
  )
    .then(res => res.json())
    .then(
      res => {
        alert(
          `Successfully added event starting at ${shortFormatDate(
            startTime
          )} to ${calendarName}! (status: ${res["status"]})`
        );
        window.location.reload(false);
      },
      error => {
        alert(`Failed to add event to calendar with error ${error}`);
      }
    );
};

// date formatter helper
const shortFormatDate = date => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
};

const Events = props => {
  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    calendarResponse: null
  });

  // fetches calendar information, but this maybe overkill since all we want is the name...
  useEffect(() => {
    fetch(`http://localhost:3000/calendar/${props.calendar_id}/response`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          setState({ ...state, isLoaded: true, calendarResponse: result });
        },
        error => {
          setState({ ...state, isLaoded: true, error: error });
        }
      );
  }, []);

  const { error, isLoaded, calendarResponse } = state;
  if (error) {
    return <div>Error in mount: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <h1>Loading and scheduling times...</h1>
      </div>
    );
  } else if (calendarResponse["error"]) {
    return (
      <div>
        <h1>
          Error code {calendarResponse["error"]["code"]} in API call:{" "}
          {calendarResponse["error"]["message"]}
        </h1>
      </div>
    );
  }
  return (
    <div className="container">
      <h1 align="center">Selected Calendar: {calendarResponse["summary"]}</h1>
      <h4>
        {" "}
        Submit your free times (pulled from the last two weeks from everyone's
        calendars):{" "}
      </h4>
      {props.free_times.map(timeHash => (
        <table>
          <td>
            <a
              href="#"
              onClick={e => {
                handleClickPost(
                  e,
                  timeHash["start"],
                  timeHash["end"],
                  props.calendar_id,
                  calendarResponse["summary"]
                );
              }}
            >
              From {shortFormatDate(timeHash["start"])} to{" "}
              {shortFormatDate(timeHash["end"])}{" "}
            </a>
          </td>
        </table>
      ))}
      {props.events.length ? (
        <h1 align="center">
          Calendar events for {calendarResponse["summary"]}:
        </h1>
      ) : (
        `No events in ${calendarResponse["summary"]} calendar`
      )}
      <ul>
        {props.events.map(event => (
          <li key={event.id}>
            {event.summary} starting at{" "}
            {new Date(Date.parse(event.end.date_time)).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit"
              }
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
