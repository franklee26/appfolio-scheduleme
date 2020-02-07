import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

class JobNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content,
      title: `Job request #${this.props.num_jobs + 1}`,
      job_type: "---"
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleJobTypeChange = this.handleJobTypeChange.bind(this);
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

  handleSubmit(event) {
    event.preventDefault();
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
      .then(res =>
        alert(
          "Found available times! Confirm job by adding job to your calendar."
        )
      )
      .then(res => document.getElementById("jobForm").submit())
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
      <div className="container">
        <h2 align="center">Job Submission</h2>
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
            <Button
              variant="primary"
              type="submit"
              onClick={e => this.handleSubmit(e)}
            >
              Submit
            </Button>
            <a href={"http://localhost:3000/calendar"}>Back</a>
          </div>
        </Form>
      </div>
    );
  }
}
export default JobNew;
