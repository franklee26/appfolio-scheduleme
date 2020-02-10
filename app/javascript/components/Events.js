import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

// handle click and post request
const handleClickPost = (
  event,
  startTime,
  endTime,
  calendarId,
  calendarName,
  job,
  user_type
) => {
  event.preventDefault();
  fetch(
    `http://localhost:3000/calendar/${calendarId}/${startTime}/${endTime}`,
    { method: "POST", body: JSON.stringify({
      user_type: user_type,
      job_id: job.id,
    }) }
  )
    .then(res => res.json())
    .then(
      res => {
        alert(
          `Successfully added event starting at ${shortFormatDate(
            startTime
          )} to ${calendarName}! (status: ${res["status"]})`
        );
      },
      error => {
        alert(`Failed to add event to calendar with error ${error}`);
      }
    )
    .then(res =>
      fetch("http://localhost:3000/jobs/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: job
        })
      })
    )
    .then(res => window.location.reload(false));
};

// date formatter helper
export const shortFormatDate = date => {
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
    isLoaded2: false,
    calendarResponse: null,
    tenantResponse: null
  });

  // fetches calendar information, but this maybe overkill since all we want is the name...
  useEffect(() => {
    fetch(`http://localhost:3000/calendar/${props.calendar_id}/response`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(
        result => {
          setState(prevState => ({
            ...prevState,
            isLoaded: true,
            calendarResponse: result
          }));
        },
        error => {
          setState(prevState => ({
            ...prevState,
            isLoaded: true,
            error: error
          }));
        }
      )
      .then(res => fetch(`http://localhost:3000/tenants/${props.id}`), {
        method: "GET"
      })
      .then(res => res.json())
      .then(res => {
        setState(prevState => ({
          ...prevState,
          tenantResponse: res,
          isLoaded2: true
        }));
      });
  }, []);

  const {
    error,
    isLoaded,
    calendarResponse,
    tenantResponse,
    isLoaded2
  } = state;
  if (error) {
    return <div>Error in mount: {error.message}</div>;
  } else if (!isLoaded || !isLoaded2) {
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
      {tenantResponse.jobs
        .filter(job => job.status === "LANDOWNER APPROVED")
        .map(job => (
          <a
            href="#"
            onClick={e =>
              handleClickPost(
                e,
                job.start,
                job.end,
                props.calendar_id,
                calendarResponse["summary"],
                job
              )
            }
          >
            <li key={job.id}>
              Approved job: {job.content} from {shortFormatDate(job.start)} to{" "}
              {shortFormatDate(job.end)}
            </li>
          </a>
        ))}
      <Button variant="primary" size="lg" href="http://localhost:3000/calendar">
        Back
      </Button>
      {/*
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
            */}
    </div>
  );
};

export default Events;
