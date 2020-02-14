import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";

// handle click and post request
const handleClickPost = (
  event,
  startTime,
  endTime,
  calendarId,
  calendarName,
  job
) => {
  event.preventDefault();
  fetch(
    `http://localhost:3000/calendar/${calendarId}/${startTime}/${endTime}`,
    {
      method: "POST",
      body: JSON.stringify({
        job_id: job.id
      })
    }
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
    .then(res => window.location.href = "/calendar");
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
      <view align="center">
        <ProgressBar
          now={100}
          variant="success"
          label="Step 3/3"
          style={{ height: "35px", fontSize: "25px", marginTop: "0.8rem" }}
        />
      </view>
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
      <Button variant="primary" size="lg" style={{marginRight: "0.8rem", marginTop: "0.8rem"}} href="http://localhost:3000/calendar/calendar_submission">
        Back
      </Button>

      <Button variant="primary" size="lg" style={{marginTop: "0.8rem"}} href="http://localhost:3000/calendar">
        Home
      </Button>
    </div>
  );
};

export default Events;
