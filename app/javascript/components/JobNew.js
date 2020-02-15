import React, { useState } from "react";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

class JobNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content,
      title: `Job request #${this.props.num_jobs + 1}`,
      job_type: "---",
      show: false,
      loading: false
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleJobTypeChange = this.handleJobTypeChange.bind(this);
    this.setShow = this.setShow.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  handleContentChange(event) {
    this.setState({ content: event.target.value });
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleJobTypeChange(event) {
    this.setState({ job_type: event.target.value });
  }

  setShow(event) {
    this.setState({ show: true });
  }

  setLoading(event) {
    this.setState({ loading: true });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setLoading();
    if (this.props.landowner_id_call === 0) {
      alert("Can't schedule job yet! (You have no landowner yet.)");
      return;
    }
    if (this.state.job_type === "---") {
      alert("Please select a job type.");
      return;
    }
    fetch(
      `http://localhost:3000/calendar/schedule/${this.props.landowner_id_call}/${this.props.tenant_id_call}`,
      {
        method: "GET"
      }
    )
      .then(response => response.json())
      .then(response =>
        response.vendors.filter(
          v => v.vendor.occupation === this.state.job_type
        )
      )
      .then(response => {
        if (response.length === 0) {
          alert("Can't schedule job yet! (Can not find any free times)");
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
              content: this.state.content,
              title: this.state.title,
              job_type: this.state.job_type,
              status: "LANDOWNER APPROVED",
              tenant_id: this.props.tenant_id_call,
              start: v.start,
              end: v.end,
              vendor_id: v.vendor.id
            })
          })
        )
      )
      .then(res => this.setShow())
      .catch(error => console.log(error));
  }

  render() {
    var errors = null;
    var errorsList = [];
    if (this.props.errors.length > 0) {
      {
        this.props.errors.length ? (
          this.props.errors.map(errors =>
            errorsList.push(<li key={"error-"}>{this.props.errors}</li>)
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
        <header class="bg-dark py-3">
          <h1 align="center" class="display-3 text-white mt-5 mb-2">
            Submit A New Job
          </h1>
        </header>
        <div className="container">
          <ProgressBar
            animated
            now={33}
            variant="success"
            label="Step 1/3"
            style={{ height: "35px", fontSize: "25px", marginTop: "0.8rem" }}
          />
          <Form id="jobForm" action={this.props.form_path} method="post">
            <Form.Group controlId="authForm">
              <Form.Control
                name="authenticity_token"
                type="hidden"
                defaultValue={this.props.csrf_token}
              />
            </Form.Group>

            <Form.Group controlId="methodForm">
              <Form.Control
                name="_method"
                type="hidden"
                defaultValue={this.props.form_method}
              />
            </Form.Group>

            <Form.Row>
              <Form.Group controlId="JobTitle">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  name="job[title]"
                  defaultValue={`Job request #${this.props.num_jobs + 1}`}
                  onChange={this.handleTitleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="JobType">
                <Form.Label>Job Type</Form.Label>
                <Form.Control as="select" onChange={this.handleJobTypeChange}>
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
                defaultValue={this.props.content}
                onChange={this.handleContentChange}
                placeholder="Job description"
              />
            </Form.Group>

            <div className="actions">
              {this.state.loading ? (
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
                  onClick={e => this.handleSubmit(e)}
                  style={{ marginRight: "0.8rem" }}
                >
                  Submit
                </Button>
              )}
              <a href={"http://localhost:3000/calendar"}>Back</a>
            </div>
          </Form>

          <Modal show={this.state.show}>
            <Modal.Header>
              <Modal.Title>Successfully submitted job request!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              We found free times for this job. Click continue to finalise your
              submission.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={e =>
                  (window.location.href = "/calendar/calendar_submission")
                }
              >
                Continue
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
export default JobNew;
