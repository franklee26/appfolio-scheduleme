import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import CardColumns from "react-bootstrap/CardColumns";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";

const CalendarSubmission = props => {

  const [state, setState] = useState({
    error: null,
    show: false
  });

  //handle click and post request
  const handleClickPost = (event, job_id, calendarID) => {
    event.preventDefault();
    fetch(
      `http://localhost:3000/calendar/post/${job_id}/${calendarID}`)
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
            job_id: job_id
          })
        })
      );
  };

  console.log(props.calendars);
  console.log(props.user);
  console.log(props.job_id);

  const {
    error,
    show
  } = state;
  if (error) {
    return <div>Error in mount: {error.message}</div>;
  }
  return (
    <div>
      <header className="bg-dark py-3">
        <h1 align="center" className="display-3 text-white mt-5 mb-2">
          Select a Calendar
        </h1>
      <h5 align="center" className="display-6 text-white mb-2">The job request will be added to the Google Calendar that you select.</h5>

      </header>
      <div className="container">
        <view align="center">
          <ProgressBar
            now={100}
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
          {props.calendars.map(calendar => (
            <a style={{ cursor: "pointer" }} onClick={e => handleClickPost(e, props.job_id, calendar.id)}>
              <Card border="info" style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{calendar.summary}</Card.Title>
                  <Card.Text>Timezone: {calendar.time_zone}</Card.Text>
                </Card.Body>
              </Card>
            </a>
          ))}
        </CardColumns>
          <Button style={{ marginRight: "0.8rem" }} href={`/calendar/events/${props.vendor_id}`}>
          Back
        </Button>
        <Button href="/calendar">Home</Button>

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

export default CalendarSubmission;
