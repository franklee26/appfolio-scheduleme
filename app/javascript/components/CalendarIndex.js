import React, { useState, useEffect } from "react";
import styles from "../styles/calendar";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
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

const handleClickJob = (event, job, landowner_id, tenant_id) => {
  event.preventDefault();
  if (landowner_id === 0) {
    alert("Can't schedule job yet! (You have no landowner yet.)");
    return;
  }
  fetch(
    `http://localhost:3000/calendar/schedule/${landowner_id}/${tenant_id}`,
    {
      method: "GET"
    }
  )
    .then(response => response.json())
    .then(response => {
      if (response.vendors.length === 0) {
        alert("Can't schedule job yet! (Can not find any free times)");
        throw new Error("No free times found...");
      } else {
        return response;
      }
    })
    .then(response =>
      response.vendors.map(v =>
        fetch("http://localhost:3000/jobs/new_temp_job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: job.content,
            created_at: job.created_at,
            updated_at: job.updated_at,
            title: job.title,
            job_type: job.job_type,
            status: "LANDOWNER APPROVED",
            tenant_id: job.tenant_id,
            start: v.start,
            end: v.end,
            vendor_id: v.vendor.id
          })
        })
      )
    )
    .then(res =>
      alert(
        "Found available times! Confirm job by adding job to your calendar."
      )
    )
    .then(res => window.location.reload(false))
    .catch(error => console.log(error));
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
          <h2 align="center" className={styles.ready_job}>
            You have jobs ready to be scheduled! Go to your calendar to confirm
            job.
          </h2>
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
        <h2>Jobs ready to be processed for submission: </h2>

        <CardColumns>
          {tenantResponse.jobs
            .filter(job => job.status == "PROCESSING")
            .map(job => (
              <a
                style={{ cursor: "pointer" }}
                href="#"
                onClick={e =>
                  handleClickJob(
                    e,
                    job,
                    tenantResponse.landowner_id,
                    tenantResponse.id
                  )
                }
              >
                <Card
                  bg="warning"
                  text="white"
                  border="warning"
                  style={{ width: "18rem" }}
                >
                  <Card.Header>Click to confirm job request</Card.Header>
                  <Card.Body>
                    <Card.Title>Job type: n/a</Card.Title>
                    <Card.Text>Description: {job.content}</Card.Text>
                  </Card.Body>
                </Card>
              </a>
            ))}
        </CardColumns>

        <h2>Scheduled & confirmed jobs: </h2>
        <CardColumns>
          {tenantResponse.jobs
            .filter(job => job.status == "COMPLETE")
            .map(job => (
              <Card
                bg="success"
                text="white"
                border="success"
                style={{ width: "18rem" }}
              >
                <Card.Header>Job with vendor {job.vendor_id}</Card.Header>
                <Card.Body>
                  <Card.Title>
                    Scheduled for {shortFormatDate(job.start)} to{" "}
                    {shortFormatDate(job.end)}
                  </Card.Title>
                  <Card.Text>Description: {job.content}</Card.Text>
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
        <h2>
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
        <h2>Please select a calendar below to add an event.</h2>
        {props.calendars.map(calendar => (
          <li key={calendar.id}>
            <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
          </li>
        ))}
        {landownerResponse.tenants.length ? (
          <div>
            <h2>Your Tenants (click to delete tenant): </h2>
            {landownerResponse.tenants.map(tenant => (
              <li key={tenant.id}>
                <a href="#" onClick={e => handleDeleteTenant(e, tenant.id)}>
                  {tenant.name}
                </a>
              </li>
            ))}
          </div>
        ) : (
          <h2>You have no tenants.</h2>
        )}
        {landownerResponse.vendors.length ? (
          <div>
            <h2>Your vendors (click to delete vendor): </h2>
            {landownerResponse.vendors.map(vendor => (
              <li key={vendor.id}>
                <a
                  href="#"
                  onClick={e => handleDeleteVendor(e, props.user.id, vendor.id)}
                >
                  {vendor.name} ({vendor.occupation})
                </a>
              </li>
            ))}
          </div>
        ) : (
          <h2>You have no vendors.</h2>
        )}
        <h2>Select user below to add as your listed tenant.</h2>
        {tenantResponse
          .filter(tenant => tenant.id != 0)
          .map(tenant => (
            <li key={tenant.id}>
              <a
                href="#"
                onClick={e => handleClickTenant(e, props.user.id, tenant.id)}
              >
                {tenant.name}
              </a>
            </li>
          ))}
        <h2>Select user below to add as your listed vendor.</h2>
        {vendorResponse
          .filter(
            vendor =>
              vendor.landowners.filter(
                landowner => landowner.id == props.user.id
              ).length == 0 && vendor.id != 0
          )
          .map(vendor => (
            <li key={vendor.id}>
              <a
                href="#"
                onClick={e => handleClickVendor(e, props.user.id, vendor.id)}
              >
                {vendor.name} ({vendor.occupation})
              </a>
            </li>
          ))}
      </div>
    );
  } else if (props.user_type == "Vendor") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>
        <h2>
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
        <h2>Please select a calendar below to add an event.</h2>
        {props.calendars.map(calendar => (
          <li key={calendar.id}>
            <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
          </li>
        ))}
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
        <h2>Your assigned jobs: </h2>
        {vendorResponse.jobs
          .filter(job => job.status == "COMPLETE")
          .map(job => (
            <li key={job.id}>
              content: {job.content} assigned tenant: {job.tenant_id}{" "}
            </li>
          ))}
      </div>
    );
  }
};

export default CalendarIndex;
