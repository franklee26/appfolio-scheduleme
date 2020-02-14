import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Alert from "react-bootstrap/Alert";
import { shortFormatDate } from "./Events.js";

// POST request adds tenant to the landowner
const handleClickTenant = (event, landowner_id, tenant_id) => {
  event.preventDefault();
  fetch("http://localhost:3000/landowner/add_tenant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      landowner_id: landowner_id,
      tenant_id: tenant_id
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.code == "200") {
        alert("Successfully added tenant!");
        window.location.reload(false);
      } else {
        alert("Failed to add tenant (returned code 400)");
      }
    });
};

const handleClickVendor = (event, landowner_id, vendor_id) => {
  event.preventDefault();
  fetch("http://localhost:3000/landowner/add_vendor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      landowner_id: landowner_id,
      vendor_id: vendor_id
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.code == "200") {
        alert("Successfully added vendor!");
        window.location.reload(false);
      } else {
        alert("Failed to add vendor (returned code 400)");
      }
    });
};

const handleDeleteTenant = (event, tenant_id) => {
  event.preventDefault();
  fetch(`http://localhost:3000/landowner/tenants/${tenant_id}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(response => {
      if (response.status == "200") {
        alert("Successfully removed tenant.");
        window.location.reload(false);
      } else {
        alert("Failed to remove tenant.");
      }
    });
};

const handleDeleteVendor = (event, landowner_id, vendor_id) => {
  event.preventDefault();
  fetch(
    `http://localhost:3000/landowner/${landowner_id}/vendors/${vendor_id}`,
    {
      method: "DELETE"
    }
  )
    .then(response => response.json())
    .then(response => {
      if (response.status == "200") {
        alert("Successfully removed vendor.");
        window.location.reload(false);
      } else {
        alert("Failed to remove vendor.");
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

/*
isLoaded: mounting landowner response
isLoaded2: mounting landowner's tenants response
landownerResponse: returns landowner with landowner id === landowner_id
tenantResponse: returns all tenants without a landowner
*/
const CalendarIndex = props => {
  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    landownerResponse: null,
    tenantResponse: null,
    isLoaded2: false,
    isLoaded3: false,
    vendorResponse: null
  });

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (props.user_type == "Tenant") {
      fetch(`http://localhost:3000/landowner/${props.user.landowner_id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              isLoaded: true,
              landownerResponse: res
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              isLoaded: false,
              error: error
            }));
          }
        )
        .then(res => {
          fetch(`http://localhost:3000/tenants/${props.user.id}`, {
            method: "GET"
          })
            .then(res => res.json())
            .then(
              res => {
                setState(prevState => ({
                  ...prevState,
                  isLoaded2: true,
                  tenantResponse: res
                }));
              },
              error => {
                setState(prevState => ({
                  ...prevState,
                  isLoaded2: false,
                  error: error
                }));
              }
            );
        });
    } else if (props.user_type == "Landowner") {
      fetch("http://localhost:3000/tenants/no_landowner", { method: "GET" })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              isLoaded: true,
              tenantResponse: res
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              isLoaded: false,
              error: error
            }));
          }
        );
      fetch(`http://localhost:3000/landowner/${props.user.id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              landownerResponse: res,
              isLoaded2: true
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              error: error
            }));
          }
        );
      fetch(`http://localhost:3000/vendors/`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              vendorResponse: res,
              isLoaded3: true
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              error: error
            }));
          }
        );
    } else if (props.user_type == "Vendor") {
      fetch(`http://localhost:3000/vendors/${props.user.id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(res => {
          setState(prevState => ({
            ...prevState,
            vendorResponse: res,
            isLoaded: true
          })),
            error => {
              setState(prevState => ({
                ...prevState,
                error: error
              }));
            };
        });
    }
  }, []);

  const {
    error,
    isLoaded,
    landownerResponse,
    tenantResponse,
    vendorResponse,
    isLoaded2,
    isLoaded3
  } = state;
  if (error) {
    return <div>Error in loading... please refresh.</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <h1>Loading data...</h1>
      </div>
    );
  } else if (props.user_type == "Tenant" && !isLoaded2) {
    return (
      <div>
        <h1>Getting tenant information...</h1>
      </div>
    );
  } else if ((!isLoaded2 || !isLoaded3) && props.user_type == "Landowner") {
    return (
      <div>
        <h1>Finishing last retrieves...</h1>
      </div>
    );
  } else if (props.user_type == "Tenant") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>
        {tenantResponse.has_approved_job ? (
          !show ? (
            <Button
              size="lg"
              variant="success"
              onClick={() => setShow(true)}
              block
            >
              ⚠ Alert: You have jobs ready to be scheduled!
            </Button>
          ) : (
            <Alert show={show} variant="success">
              <Alert.Heading>
                You have jobs ready to be scheduled!
              </Alert.Heading>
              <p>
                Your job request was matched with your landowner's vendors. We
                found several times for you to schedule your job; don't worry,
                we made sure these times do not conflict with your schedule.
                Click one of your calendars to schedule and we'll take care of
                everything else.
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => setShow(false)}
                  variant="outline-success"
                >
                  Hide alert
                </Button>
              </div>
            </Alert>
          )
        ) : null}
        <h2 align="center">
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
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

        <Button
          variant="primary"
          href="http://localhost:3000/jobs/new"
          size="lg"
          block
        >
          Click here to submit a new job
        </Button>

        <h2>Scheduled jobs: </h2>
        <CardColumns>
          {tenantResponse.jobs
            .filter(job => job.status == "COMPLETE")
            .map(job => (
              <Card
                bg="warning"
                text="dark"
                border="warning"
                style={{ width: "18rem" }}
              >
                <Card.Header>{job.title}</Card.Header>
                <Card.Body>
                  <Card.Title>
                    Scheduled for {shortFormatDate(job.start)} to{" "}
                    {shortFormatDate(job.end)} assigned to {job.vendor_name}
                  </Card.Title>
                  <Card.Text>Description: {job.content}</Card.Text>
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
        <h2>Completed jobs: </h2>
        <CardColumns>
          {tenantResponse.jobs
            .filter(job => job.status == "VENDOR COMPLETE")
            .map(job => (
              <Card
                bg="success"
                text="white"
                border="success"
                style={{ width: "18rem" }}
              >
                <Card.Header>{job.title}</Card.Header>
                <Card.Body>
                  <Card.Title>
                    Completed by {job.vendor_name} from{" "}
                    {shortFormatDate(job.start)} to {shortFormatDate(job.end)}
                  </Card.Title>
                  <Card.Text>Description: {job.content}</Card.Text>
                  Add a review?
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
        {props.user.landowner_id == 0 ? (
          <h2>
            You do not have a landowner yet! Your landowner will assign you.
          </h2>
        ) : (
          <h2>
            {" "}
            Your assigned landowner is {landownerResponse.name} with email{" "}
            {landownerResponse.email}{" "}
          </h2>
        )}
      </div>
    );
  } else if (props.user_type == "Landowner") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>
        <h2 align="center">
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
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

        {landownerResponse.tenants.length ? (
          <div>
            <h2>Your Tenants (click to delete tenant): </h2>
            <CardColumns>
              {landownerResponse.tenants.map(tenant => (
                <a
                  style={{ cursor: "pointer" }}
                  href="#"
                  onClick={e => handleDeleteTenant(e, tenant.id)}
                >
                  <Card
                    bg="info"
                    text="white"
                    border="info"
                    style={{ width: "18rem" }}
                  >
                    <Card.Body>
                      <Card.Title>{tenant.name}</Card.Title>
                      <Card.Text>
                        Email: {tenant.email}
                        <br />
                        {tenant.street_address}
                        <br />
                        {tenant.city}, {tenant.state} {tenant.zip}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              ))}
            </CardColumns>
          </div>
        ) : (
          <h2>You have no tenants.</h2>
        )}
        {landownerResponse.vendors.length ? (
          <div>
            <h2>Your vendors (click to delete vendor): </h2>
            <CardColumns>
              {landownerResponse.vendors.map(vendor => (
                <a
                  style={{ cursor: "pointer" }}
                  href="#"
                  onClick={e => handleDeleteVendor(e, props.user.id, vendor.id)}
                >
                  <Card
                    bg="info"
                    text="white"
                    border="info"
                    style={{ width: "18rem" }}
                  >
                    <Card.Body>
                      <Card.Title>{vendor.name}</Card.Title>
                      <Card.Text>
                        Email: {vendor.email}
                        <br />
                        Occupation: {vendor.occupation}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              ))}
            </CardColumns>
          </div>
        ) : (
          <h2>You have no vendors</h2>
        )}

        <h2>Select user below to add as your listed tenant.</h2>
        <CardColumns>
          {tenantResponse
            .filter(tenant => tenant.id != 0)
            .map(tenant => (
              <a
                style={{ cursor: "pointer" }}
                href="#"
                onClick={e => handleClickTenant(e, props.user.id, tenant.id)}
              >
                <Card
                  bg="secondary"
                  text="white"
                  border="secondary"
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{tenant.name}</Card.Title>
                    <Card.Text>
                      Email: {tenant.email}
                      <br />
                      {tenant.street_address}
                      <br />
                      {tenant.city}, {tenant.state} {tenant.zip}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            ))}
        </CardColumns>

        <h2>Select user below to add as your listed vendor.</h2>
        <CardColumns>
          {vendorResponse
            .filter(
              vendor =>
                vendor.landowners.filter(
                  landowner => landowner.id == props.user.id
                ).length == 0 && vendor.id != 0
            )
            .map(vendor => (
              <a
                style={{ cursor: "pointer" }}
                href="#"
                onClick={e => handleClickVendor(e, props.user.id, vendor.id)}
              >
                <Card
                  bg="secondary"
                  text="white"
                  border="secondary"
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{vendor.name}</Card.Title>
                    <Card.Text>
                      Email: {vendor.email}
                      <br />
                      Occupation: {vendor.occupation}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            ))}
        </CardColumns>
      </div>
    );
  } else if (props.user_type == "Vendor") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>
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

        {vendorResponse.landowners.length ? (
          <h2>Your assigned landowners: </h2>
        ) : (
          <h2>You do not have any assigned landowners. </h2>
        )}
        <ul>
          {vendorResponse.landowners.map(landowner => (
            <li key={landowner.id}>
              {landowner.name} available at {landowner.email}
            </li>
          ))}
        </ul>
        <h2>Your assigned jobs (click to mark as complete): </h2>
        <CardColumns>
          {vendorResponse.jobs
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
                  <Card.Header>{job.title}</Card.Header>
                  <Card.Body>
                    <Card.Title>Requested by {job.tenant_name}</Card.Title>
                    <Card.Text>
                      {job.content} scheduled from {shortFormatDate(job.start)}{" "}
                      to {shortFormatDate(job.end)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            ))}
        </CardColumns>
        <h2>Your completed jobs: </h2>
        <CardColumns>
          {vendorResponse.jobs
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
                    {shortFormatDate(job.start)} to {shortFormatDate(job.end)}
                  </Card.Title>
                  <Card.Text>{job.content}</Card.Text>
                </Card.Body>
              </Card>
            ))}
        </CardColumns>
      </div>
    );
  }
};

export default CalendarIndex;
