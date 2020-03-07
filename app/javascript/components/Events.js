import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

// date formatter helper
export const shortFormatDate = date => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  return theDate;
};

export const shortFormatDateAll = date => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
};

export const shortFormatTime = date => {
  var theDate = new Date(Date.parse(date)).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return theDate;
};

export const dayExporter = date => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    day: "numeric",
  });
  return theDate;
};

const Events = props => {
  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    isLoaded2: false,
    calendarResponse: null,
    tenantResponse: null,
    show: false
  });

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
          setState({ ...state, show: true });
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
      );
  };

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
    isLoaded2,
    show
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
  console.log(props.vendor_id);
  return (
    <div>
      <header class="bg-dark py-3">
        <h1 align="center" class="display-3 text-white mt-5">
          Pick a Date & Time
        </h1>
        <h5 align="center" class="display-6 text-white mb-2">
          This will be added to the calendar called "
          {calendarResponse["summary"]}"
        </h5>
      </header>
      <div className="container">
        <view align="center">
          <ProgressBar
            animated
            now={100}
            variant="success"
            label="Step 4/4"
            style={{
              height: "35px",
              fontSize: "25px",
              marginTop: "0.8rem",
              marginBottom: "0.8rem"
            }}
          />
        </view>
        <CardColumns>
          {tenantResponse.jobs
            .filter(job => job.status === "LANDOWNER APPROVED" && job.vendor_id == props.vendor_id) 
            .map(job => (
              <Card ml-3 border="primary">
                <Card.Header as="h6" align="center">
                  {shortFormatDate(job.start)}
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <b>Time: </b> {shortFormatTime(job.start)} to{" "}
                    {shortFormatTime(job.end)} <br />
                    <br />
                    <Button
                      variant="outline-success"
                      size="sm"
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
                      {" "}
                      Add To Calendar{" "}
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
        <Button
          variant="primary"
          size="lg"
          style={{ marginRight: "0.8rem", marginTop: "0.8rem" }}
          href="http://localhost:3000/calendar/calendar_submission"
        >
          Back
        </Button>

        <Button
          variant="primary"
          size="lg"
          style={{ marginTop: "0.8rem" }}
          href="http://localhost:3000/calendar"
        >
          Home
        </Button>

        <Modal show={show}>
          <Modal.Header>
            <Modal.Title>Successfully submitted job!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your job is scheduled! The job event has been added to your calendar
            as a confirmation.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={e => (window.location.href = "/calendar")}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Events;
