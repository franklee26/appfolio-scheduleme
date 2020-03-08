import React from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";

const CalendarSubmission = props => {
  console.log(props.calendar);
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
            animated
            now={66}
            variant="success"
            label="Step 1/4"
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
            <a style={{ cursor: "pointer" }} href={`/calendar/vendor_selection/${calendar.id}`}>
              <Card border="info" style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{calendar.summary}</Card.Title>
                  <Card.Text>Timezone: {calendar.time_zone}</Card.Text>
                </Card.Body>
              </Card>
            </a>
          ))}
        </CardColumns>
        <Button href="/calendar">Home</Button>
      </div>
    </div>
  );
};

export default CalendarSubmission;
