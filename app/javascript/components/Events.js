
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import StarRatings from "react-star-ratings";
import Table from 'react-bootstrap/Table'

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

export const getWeekdayFromDate = date => {
  var theDate = new Date(Date.parse(date)).toLocaleDateString("en-US", {
    weekday: "long"
  });
  return theDate;
};

const Events = props => {
  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    tenantResponse: null,
    new_jobs: null, 
    show: false
  });


  // fetches calendar information, but this maybe overkill since all we want is the name...
  useEffect(() => {
    fetch(`http://localhost:3000/tenants/${props.id}`, {
        method: "GET"
      })
      .then(res => res.json())
      .then(res => {
        var new_jobs = res.jobs.filter(job => job.status === "LANDOWNER APPROVED" && props.vendor_info.id == job.vendor_id);
        setState(prevState => ({
          ...prevState,
          tenantResponse: res,
          isLoaded: true,
          new_jobs: new_jobs
        }));
      });
  }, []);

  const {
    error,
    isLoaded,
    tenantResponse,
    new_jobs,
    show
  } = state;
  if (error) {
    return <div>Error in mount: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <h1>Loading and scheduling times...</h1>
      </div>
    );
  }
  return (
    <div>
      <header class="bg-dark py-3">
        <h1 align="center" class="display-3 text-white mt-5">
          Pick a Date & Time
        </h1>
      </header>  
      <div className="container">
        <view align="center">
          <ProgressBar
            now={75}
            label="Step 3/4"
            style={{
              height: "35px",
              fontSize: "25px",
              marginTop: "0.8rem",
              marginBottom: "0.8rem"
            }}
          />
        </view>
        </div>
<div className="container w-50 mb-4">
<Card border="info">
  <Card.Header as="h6" align="center"> { new_jobs[0].title } </Card.Header>
  <Card.Body>
    <Card.Text>
      <b>Vendor: </b> {props.vendor_info.name} <br/>
      {" "}
                    {
                      <StarRatings
                        rating={parseFloat(props.vendor_info.rating.toFixed(2))}
                        starDimension="17px"
                        starSpacing="2px"
                        starRatedColor="gold"
                        numberOfStars={5}
                        name="rating"
                      />
                    }{" "}
      <br/>
      <b>Description: </b> {new_jobs[0].content}
    </Card.Text>
  </Card.Body>
</Card> 

</div>
<div className="container w-50"> 
<Table hover size="sm" class="table bg-info">
  <thead>
    <tr>
    <th class="text-center">Date</th>
    <th class="text-center">Day</th>
    <th class="text-center">Time</th>
    <th class="text-center"></th>
    </tr>
  </thead>
  <tbody>
  {new_jobs.map(job => (
    <tr>
      <td align="center">{shortFormatDate(job.start)}</td>
      <td align="center">{getWeekdayFromDate(job.start)}</td>
      <td align="center">{shortFormatTime(job.start)} - {shortFormatTime(job.end)}</td>
      <td align="center">                    <Button
                      variant="outline-primary"
                      size="sm"
                      href={`/calendar/calendar_submission/${job.id}`}
                    >
                      {" "}
                      Add To Calendar{" "}
                    </Button></td>

    </tr>

      ))}
  </tbody>
</Table>            
        <Button
          variant="primary"
          size="lg"
          style={{ marginRight: "0.8rem", marginTop: "0.8rem" }}
          href="http://localhost:3000/calendar/vendor_selection"
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
