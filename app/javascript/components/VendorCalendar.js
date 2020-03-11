import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import CardDeck from "react-bootstrap/CardDeck";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { shortFormatDateAll, dayExporter, shortFormatDate } from "./Events.js";
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} = require("react-google-maps");

const handleAddCalendar = (event, id, calendar_id) => {
  event.preventDefault();
  fetch(`http://localhost:3000/calendar/add_default`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vendor_id: id,
      calendar_id: calendar_id
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.status == 200) {
        alert("Successfully marked calendar as default.");
      } else {
        alert("Failed to mark calendar as default.");
      }
    });
};

const handleCompleteJob = (event, job_id) => {
  event.preventDefault();
  fetch(`http://localhost:3000/jobs/finish/${job_id}`, { method: "PATCH" })
    .then(response => response.json())
    .then(response => {
      if (response.status == 200) {
        alert("Successfully marked job as complete.");
        window.location.reload(false);
      } else {
        alert("Failed to mark job as complete.");
      }
    });
};

const handleCompleteAllJobs = (event, id) => {
  event.preventDefault();
  fetch(`http://localhost:3000/jobs/finishAll`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      vendor_id: id
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.status == 200) {
        alert("Successfully marked all jobs as complete.");
        window.location.reload(false);
      } else {
        alert("Failed to mark all jobs as complete.");
      }
    });
};
export const istoday = date => {
  var today = new Date();
  var jobdate = new Date(date);
  if (
    today.getFullYear() === jobdate.getFullYear() &&
    today.getDay() === jobdate.getDay() &&
    today.getMonth() === jobdate.getMonth()
  ) {
    return true;
  }
  return false;
};

const VendorCalendar = props => {
  var filtered = props.vendorResponse.jobs.filter(
    job => job.status == "COMPLETE" && istoday(job.start)
  );
  const [mapState, setMapState] = useState({
    start_home: true,
    loading_maps: true,
    job_index: props.job_index
  });

  const handleMapBackCycle = () => {
    if (mapState.job_index == 0) {
      alert("Error: Can't cycle back");
    } else {
      setMapState(prevState => ({
        ...prevState,
        job_index: mapState.job_index - 1
      }));
    }
  };

  const handleMapCycle = () => {
    // check current index and see if I can cycle
    const jobs = props.state.vendorResponse.jobs.filter(
      job => job.status == "COMPLETE" && istoday(job.start)
    );
    if (mapState.job_index >= jobs.length - 1) {
      alert("Error: Can't cycle");
    } else {
      // get the current day
      const currentDay = dayExporter(jobs[mapState.job_index].start);
      console.log(currentDay);
      setMapState(prevState => ({
        ...prevState,
        job_index: mapState.job_index + 1
      }));
    }
  };

  const VendorMap = compose(
    withProps({
      googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${props.GOOGLE_MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: (
        <div
          style={{
            height: `700px`,
            marginBottom: "2.0rem",
            marginTop: "1.0rem",
            borderStyle: "solid"
          }}
        />
      ),
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
      componentDidMount() {
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route(
          {
            origin:
              mapState.job_index > 0
                ? props.vendorResponse.jobs.filter(
                    job => job.status == "COMPLETE" && istoday(job.start)
                  )[mapState.job_index - 1].address
                : "1100 Anacapa St, Santa Barbara, CA 93101",
            destination:
              mapState.job_index != null
                ? props.vendorResponse.jobs.filter(
                    job => job.status == "COMPLETE" && istoday(job.start)
                  )[mapState.job_index].address
                : "1100 Anacapa St, Santa Barbara, CA 93101",
            travelMode: google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              this.setState({
                directions: result
              });
            } else {
              console.error(`error fetching directions ${result}`);
            }
          }
        );
      }
    })
  )(props => (
    <GoogleMap
      defaultZoom={7}
      defaultCenter={new google.maps.LatLng(41.85073, -87.65126)}
    >
      {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
  ));

  return (
    <div>
      <header class="bg-dark py-1">
        <h1 align="center" class="display-1 text-white mt-5 mb-2">
          {props.user_type} Homepage
        </h1>
        <p align="center" class="lead text-light">
          View your assigned and completed jobs
        </p>
      </header>{" "}
      <Container>
        <Tabs defaultActiveKey="Today" style={{ marginTop: "0.8rem" }}>
          <Tab eventKey="Today" title="Today">
            <Row>
              <Col md="auto">
                <Button
                  size="lg"
                  onClick={e => handleCompleteAllJobs(e, props.user.id)}
                  variant="info"
                  style={{
                    marginTop: "0.8rem",
                    marginBottom: "0.8rem",
                    marginLeft: "0.8rem"
                  }}
                >
                  {" "}
                  Complete All
                </Button>
                <div style={{ overflow: "auto", height: "792px" }}>
                  {props.vendorResponse.jobs
                    .filter(
                      job => job.status == "COMPLETE" && istoday(job.start)
                    )
                    .map(job => (
                      <a
                        style={{ cursor: "pointer" }}
                        href="#"
                        onClick={e => handleCompleteJob(e, job.id)}
                      >
                        <Card
                          border="warning"
                          bg="warning"
                          text="dark"
                          style={{
                            width: "18rem",
                            display: "flex",
                            marginTop: "10px"
                          }}
                        >
                          <Card.Header>
                            {job.title}{" "}
                            {mapState.job_index != null &&
                            filtered[mapState.job_index].content === job.content
                              ? " 🕔"
                              : ""}
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>
                              Requested by {job.tenant_name}{" "}
                            </Card.Title>
                            <Card.Text>
                              {job.content} scheduled from{" "}
                              {shortFormatDateAll(job.start)} to{" "}
                              {shortFormatDateAll(job.end)}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </a>
                    ))}
                </div>
              </Col>
              <Col>
                <Button
                  size="lg"
                  variant="info"
                  onClick={() => handleMapBackCycle()}
                  style={{ marginTop: "0.8rem" }}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  variant="info"
                  onClick={() => handleMapCycle()}
                  style={{ marginTop: "0.8rem", marginLeft: "0.8rem" }}
                >
                  Next
                </Button>
                {filtered.length ? (
                  <div>
                    <h2 style={{ marginTop: "0.8rem" }}>
                      {filtered[mapState.job_index].title}:{" "}
                      {mapState.job_index == 0
                        ? props.user.name
                        : filtered[mapState.job_index - 1].tenant_name}{" "}
                      ➡️ {filtered[mapState.job_index].tenant_name} (To{" "}
                      {filtered[mapState.job_index].address})
                    </h2>
                    <VendorMap isMarkerShown />
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="Upcoming" title="Upcoming">
            <CardColumns
              style={{
                marginTop: "0.8rem"
              }}
            >
              {" "}
              {props.vendorResponse.jobs
                .filter(job => job.status == "COMPLETE" && !istoday(job.start))
                .map(job => (
                  <Card
                    border="warning"
                    bg="warning"
                    text="black"
                    style={{
                      width: "18rem"
                    }}
                  >
                    <Card.Header> {job.title}</Card.Header>{" "}
                    <Card.Body>
                      <Card.Title>
                        Completed for {job.tenant_name}
                        from {shortFormatDateAll(job.start)}
                        to {shortFormatDateAll(job.end)}{" "}
                      </Card.Title>{" "}
                      <Card.Text> {job.content} </Card.Text>{" "}
                    </Card.Body>{" "}
                  </Card>
                ))}{" "}
            </CardColumns>{" "}
          </Tab>
          <Tab eventKey="Completed" title="Completed">
            <CardColumns style={{ marginTop: "0.8rem" }}>
              {props.vendorResponse.jobs
                .filter(job => job.status == "VENDOR COMPLETE")
                .map(job => (
                  <Card
                    border="success"
                    bg="success"
                    text="white"
                    style={{ width: "18rem" }}
                  >
                    <Card.Header>{job.title} (DONE)</Card.Header>
                    <Card.Body>
                      <Card.Title>
                        Completed for {job.tenant_name} from{" "}
                        {shortFormatDateAll(job.start)} to{" "}
                        {shortFormatDateAll(job.end)}
                      </Card.Title>
                      <Card.Text>{job.content}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
            </CardColumns>
          </Tab>
          <Tab eventKey="Profile" title="Profile">
            <h2 align="center">
              {props.user.name}'s list of calendars under email{" "}
              {props.user.email}
            </h2>
            <CardColumns>
              {props.calendars.map(calendar => (
                <a
                  style={{ cursor: "pointer" }}
                  href="#"
                  onClick={e =>
                    handleAddCalendar(e, props.user.id, calendar.id)
                  }
                >
                  <Card border="info" style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>{calendar.summary}</Card.Title>
                      <Card.Text>Timezone: {calendar.time_zone}</Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              ))}
            </CardColumns>
            {props.vendorResponse.landowners.length ? (
              <h2>Your assigned landowners: </h2>
            ) : (
              <h2>You do not have any assigned landowners. </h2>
            )}
            <ul>
              {props.vendorResponse.landowners.map(landowner => (
                <li key={landowner.id}>
                  {landowner.name} available at {landowner.email}
                </li>
              ))}
            </ul>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default VendorCalendar;
