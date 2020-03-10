import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

const JobNew = props => {
  const [state, setState] = useState({
    content: props.content,
    title: `Job request #${props.num_jobs + 1}`,
    job_type: "---",
    show: false,
    loading: false
  });

  const handleSubmit = event => {
    event.preventDefault();
    setState({ ...state, loading: true });
    if (props.landowner_id_call === 0) {
      alert("Can't schedule job yet! (You have no landowner yet.)");
      setState({ ...state, loading: false });
      return;
    }
    if (state.job_type === "---") {
      alert("Please select a job type.");
      return;
    }
    fetch(
      `http://localhost:3000/calendar/schedule/${props.landowner_id_call}/${props.tenant_id_call}`,
      {
        method: "GET"
      }
    )
      .then(response => response.json())
      .then(response =>
        response.vendors.filter(v => v.vendor.occupation === state.job_type)
      )
      .then(response => {
        if (response.length === 0) {
          alert("Can't schedule job yet! (Can not find any free times)");
          setState({ ...state, loading: false });
          throw new Error("No free times found...");
        } else {
          return response;
        }
      })
      .then(response =>
        response.map(v =>
          fetch("http://localhost:3000/jobs/new_temp_job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: state.content,
              title: state.title,
              job_type: state.job_type,
              status: "LANDOWNER APPROVED",
              tenant_id: props.tenant_id_call,
              start: v.start,
              end: v.end,
              vendor_id: v.vendor.id
            })
          })
        )
      )
      .then(res => setState({ ...state, show: true }))
      .catch(error => console.log(error));
  };

  var errors = null;
  var errorsList = [];
  if (props.errors.length > 0) {
    {
      props.errors.length ? (
        props.errors.map(errors =>
          errorsList.push(<li key={"error-"}>{props.errors}</li>)
        )
      ) : (
        <h1></h1>
      );
    }
    errors = (
      <div id="error_explanation">
        <h2>Errors prohibited this job from being saved:</h2>
        <ul>{errorsList}</ul>
      </div>
    );
  }
  return (
    <div>
      <header className="bg-dark py-3">
        <h1 align="center" className="display-3 text-white mt-5 mb-2">
          Submit a new Job
        </h1>
      </header>
      <div className="container">
        <ProgressBar
          now={25}
          label="Step 1/4"
          style={{ height: "35px", fontSize: "25px", marginTop: "0.8rem" }}
        />
        <Form id="jobForm" action={props.form_path} method="post">
          <Form.Group controlId="authForm">
            <Form.Control
              name="authenticity_token"
              type="hidden"
              defaultValue={props.csrf_token}
            />
          </Form.Group>

          <Form.Group controlId="methodForm">
            <Form.Control
              name="_method"
              type="hidden"
              defaultValue={props.form_method}
            />
          </Form.Group>

          <Form.Row>
            <Form.Group controlId="JobTitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                name="job[title]"
                defaultValue={`Job request #${props.num_jobs + 1}`}
                onChange={e => setState({ ...state, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="JobType">
              <Form.Label>Job Type</Form.Label>
              <Form.Control
                as="select"
                onChange={e => setState({ ...state, job_type: e.target.value })}
              >
                <option>---</option>
                <option>Electrician</option>
                <option>Plumber</option>
                <option>Carpenter</option>
                <option>Gardener</option>
                <option>Household cleaning</option>
                <option>Internet and Cable</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>Describe your job request</Form.Label>
            <Form.Control
              as="textarea"
              rows="5"
              columns="20"
              type="text"
              id="title"
              name="job[content]"
              defaultValue={props.content}
              onChange={e => setState({ ...state, content: e.target.value })}
              placeholder="Job description"
            />
          </Form.Group>
          <div className="actions">
              <Button
                variant="primary"
                type="submit"
                href={"http://localhost:3000/calendar"}
                style={{ marginRight: "0.8rem" }}
              >
                Back
              </Button>          
            {state.loading ? (
              <Button
                variant="primary"
                style={{ marginRight: "0.8rem" }}
                disabled
              >
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                onClick={e => handleSubmit(e)}
                style={{ marginRight: "0.8rem" }}
              >
                Submit
              </Button>
            )}

          </div>
        </Form>

        <Modal show={state.show}>
          <Modal.Header>
            <Modal.Title>Successfully submitted job request!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            We found free times for this job. Click continue to finalize your
            submission.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={e =>
                (window.location.href = "/calendar/vendor_selection")
              }
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
export default JobNew;
