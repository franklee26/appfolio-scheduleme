import React from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";

const CalendarSubmission = props => {
  return (
    <div>
      <header class="bg-dark py-3">
        <h1 align="center" class="display-3 text-white mt-5 mb-2">
          Select Calendar
        </h1>
      </header>
      <div className="container">
        <view align="center">
          <ProgressBar
            now={66}
            variant="success"
            label="Step 2/3"
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
            <a style={{ cursor: "pointer" }} href={`/calendar/${calendar.id}`}>
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
