import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CardColumns from "react-bootstrap/CardColumns";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { shortFormatDate } from "./Events.js";
import $ from "jquery";
import StarRatings from "react-star-ratings";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

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
  const [STATE, SETSTATE] = useState({
    showM: false,
    TITLE: "",
    JID: null,
    VID: null
  });
  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    landownerResponse: null,
    tenantResponse: null,
    isLoaded2: false,
    isLoaded3: false,
    vendorResponse: null,
    reviewSuccess: false
  });
  const [State, SetState] = useState({
    text: "",
    rate: "0.0"
  });

  const [show, setShow] = useState(true);

  const [landownerState, setLandownerState] = useState({
    vendorModal: false,
    addVendorModal: false,
    tenantModal: false,
    addTenantModal: false
  });

  const VendorMap = compose(
    withProps({
      googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${props.GOOGLE_MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: (
        <div style={{ height: `750px`, marginBottom: "2.0rem" }} />
      ),
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(props => (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 34.413341, lng: -119.855609 }}
    >
      {props.isMarkerShown && (
        <Marker position={{ lat: 34.413341, lng: -119.855609 }} />
      )}
    </GoogleMap>
  ));

  const handleUpdateVendorRating = (vendor_id, rate, job_id) => {
    fetch(`http://localhost:3000/vendors/update_rating`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendor_id: vendor_id,
        rating: rate,
        job_id: job_id
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status == 200) {
          setState({ ...state, reviewSuccess: true });
        } else {
          alert("Failed to update vendor");
        }
      });
  };

  const handleJobReview = (event, job_id, text, rate, vendor_id) => {
    parseFloat(rate);
    event.preventDefault();
    fetch("http://localhost:3000/reviews/new_review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Transaction": "POST Example",
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      },
      body: JSON.stringify({
        job_id: job_id,
        rating: rate,
        text: text
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status == "200") {
          handleUpdateVendorRating(vendor_id, rate, job_id);
        } else if (response.status == "210") {
          alert("Already Reviewed");
          window.location.reload(false);
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
          setLandownerState({ ...landownerState, vendorModal: true });
        } else {
          alert("Failed to remove vendor.");
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
          setLandownerState({ ...landownerState, addVendorModal: true });
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
          setLandownerState({ ...landownerState, tenantModal: true });
        } else {
          alert("Failed to remove tenant.");
        }
      });
  };

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
          setLandownerState({ ...landownerState, addTenantModal: true });
        } else {
          alert("Failed to add tenant (returned code 400)");
        }
      });
  };

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
    isLoaded3,
    reviewSuccess
  } = state;
  const { text, rate } = State;
  const { showM, TITLE, JID, VID } = STATE;
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
              variant="warning"
              onClick={() => setShow(true)}
              block
            >
              ⚠ Alert: You have jobs ready to be scheduled!
            </Button>
          ) : (
            <Alert show={show} variant="warning">
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
                  variant="outline-dark"
                  style={{ marginRight: "0.8rem" }}
                  onClick={() =>
                    (window.location.href = "/calendar/calendar_submission")
                  }
                >
                  Continue
                </Button>
                <Button onClick={() => setShow(false)} variant="outline-dark">
                  Hide
                </Button>
              </div>
            </Alert>
          )
        ) : null}

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
                  {job.reviewed ? (
                    <Button variant="primary" disabled>
                      Reviewed
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() =>
                        SETSTATE({
                          showM: true,
                          TITLE: job.title,
                          JID: job.id,
                          VID: job.vendor_id
                        })
                      }
                    >
                      Review
                    </Button>
                  )}

                  <Modal
                    show={showM}
                    onHide={e => SETSTATE({ ...STATE, showM: false })}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{TITLE}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId="starRating">
                          <Form.Label style={{ marginRight: "1.0rem" }}>
                            Rate
                          </Form.Label>
                          <StarRatings
                            rating={parseFloat(rate)}
                            starRatedColor="gold"
                            starHoverColor="gold"
                            starSpacing="2px"
                            changeRating={(rating, name) =>
                              SetState({ ...State, rate: rating })
                            }
                            numberOfStars={5}
                            name="rating"
                          />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows="6"
                            placeholder="Review Description"
                            onChange={event =>
                              SetState({ ...State, text: event.target.value })
                            }
                          />
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="danger"
                        onClick={e => SETSTATE({ ...STATE, showM: false })}
                      >
                        Exit
                      </Button>
                      <Button
                        variant="primary"
                        onClick={event => {
                          SETSTATE({ ...STATE, showM: false });
                          handleJobReview(event, JID, text, rate, VID);
                        }}
                      >
                        Submit
                      </Button>
                    </Modal.Footer>
                  </Modal>
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
        <Modal show={reviewSuccess}>
          <Modal.Header>
            <Modal.Title>Successfully submitted review for job!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            We recorded your review and rating for the completed job.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={e => window.location.reload(false)}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  } else if (props.user_type == "Landowner") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>

        {landownerResponse.tenants.length ? (
          <div>
            <h2>Your Tenants (click to delete tenant): </h2>
            <CardColumns>
              {landownerResponse.tenants.map(tenant => (
                <Card ml-3 border="primary">
                  <Card.Header as="h5" align="center">
                    {tenant.name}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <b>Email:</b> {tenant.email}
                      <br />
                      <b>Address:</b> {tenant.street_address}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {tenant.city}, {tenant.state} {tenant.zip}
                    </Card.Text>
                    <Button
                      variant="outline-danger"
                      onClick={e => handleDeleteTenant(e, tenant.id)}
                    >
                      {" "}
                      Remove Tenant{" "}
                    </Button>
                  </Card.Body>
                </Card>
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
                <Card ml-2 border="success">
                  <Card.Header as="h5">{vendor.name}</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <b>Email: </b>
                      {vendor.email}
                      <br />
                      <b>Occupation: </b>
                      {vendor.occupation}
                      <br />
                      {
                        <StarRatings
                          rating={parseFloat(
                            vendor.rating ? vendor.rating.toFixed(2) : "0.0"
                          )}
                          starDimension="19px"
                          starSpacing="1px"
                          starRatedColor="gold"
                          numberOfStars={5}
                          name="rating"
                        />
                      }
                    </Card.Text>
                    <Button
                      variant="outline-danger"
                      onClick={e =>
                        handleDeleteVendor(e, props.user.id, vendor.id)
                      }
                    >
                      {" "}
                      Remove Vendor{" "}
                    </Button>
                  </Card.Body>
                </Card>
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
              <Card ml-2 border="primary">
                <Card.Header as="h5">{tenant.name}</Card.Header>
                <Card.Body>
                  <Card.Text>
                    <b>Email: </b>
                    {tenant.email}
                    <br />
                    <b>Address: </b>
                    {tenant.street_address}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {tenant.city}, {tenant.state} {tenant.zip}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    onClick={e =>
                      handleClickTenant(e, props.user.id, tenant.id)
                    }
                  >
                    {" "}
                    Add Tenant{" "}
                  </Button>
                </Card.Body>
              </Card>
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
              <Card ml-2 border="success">
                <Card.Header as="h5">{vendor.name}</Card.Header>
                <Card.Body>
                  <Card.Text>
                    <b>Email: </b>
                    {vendor.email}
                    <br />
                    <b>Occupation: </b>
                    {vendor.occupation}
                    <br />
                    {
                      <StarRatings
                        rating={parseFloat(vendor.rating.toFixed(2))}
                        starDimension="19px"
                        starSpacing="1px"
                        starRatedColor="gold"
                        numberOfStars={5}
                        name="rating"
                      />
                    }
                  </Card.Text>
                  <Button
                    variant="outline-success"
                    onClick={e =>
                      handleClickVendor(e, props.user.id, vendor.id)
                    }
                  >
                    {" "}
                    Add Vendor{" "}
                  </Button>
                </Card.Body>
              </Card>
            ))}
        </CardColumns>

        <Modal show={landownerState.vendorModal}>
          <Modal.Header>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have removed a vendor.</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={e => window.location.reload(false)}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={landownerState.addVendorModal}>
          <Modal.Header>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have added a vendor.</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={e => window.location.reload(false)}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={landownerState.tenantModal}>
          <Modal.Header>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have removed a tenant.</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={e => window.location.reload(false)}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={landownerState.addTenantModal}>
          <Modal.Header>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have added a tenant.</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={e => window.location.reload(false)}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
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
        <VendorMap isMarkerShown />
      </div>
    );
  }
};

export default CalendarIndex;
