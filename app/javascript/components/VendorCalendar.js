import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import { shortFormatDateAll, dayExporter } from "./Events.js";
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

const VendorCalendar = props => {
  var filtered = props.vendorResponse.jobs.filter(
    job => job.status == "COMPLETE"
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
      job => job.status == "COMPLETE"
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
                    job => job.status == "COMPLETE"
                  )[mapState.job_index - 1].address
                : "1100 Anacapa St, Santa Barbara, CA 93101",
            destination:
              mapState.job_index != null
                ? props.vendorResponse.jobs.filter(
                    job => job.status == "COMPLETE"
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
      <div className="container">
        <h2 align="center">
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
        <CardColumns>
          {props.calendars.map(calendar => (
            <a
              style={{ cursor: "pointer" }}
              href="#"
              onClick={e => handleAddCalendar(e, props.user.id, calendar.id)}
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
        <h2>Your assigned jobs (click to mark as complete): </h2>
        <CardColumns>
          {props.vendorResponse.jobs
            .filter(job => job.status == "COMPLETE")
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
                  style={{ width: "18rem" }}
                >
                  <Card.Header>
                    {job.title}{" "}
                    {mapState.job_index != null &&
                    filtered[mapState.job_index].content === job.content
                      ? " 🕔"
                      : ""}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>Requested by {job.tenant_name} </Card.Title>
                    <Card.Text>
                      {job.content} scheduled from{" "}
                      {shortFormatDateAll(job.start)} to{" "}
                      {shortFormatDateAll(job.end)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            ))}
        </CardColumns>
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
        <h2>Your completed jobs: </h2>
        <CardColumns>
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
      </div>
    </div>
  );
};

export default VendorCalendar;
