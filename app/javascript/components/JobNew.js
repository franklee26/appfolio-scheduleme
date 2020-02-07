import React from "react";

class JobNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content,
      title: "manual title",
      job_type: "some type"
    }
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleContentChange(e) {
    this.setState({ content: e.target.value })
  }

  handleSubmit(event) {
    if (this.props.landowner_id_call === 0) {
      alert("Can't schedule job yet! (You have no landowner yet.)");
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
      ).then(res => document.getElementById("jobForm").submit())
      .catch(error => console.log(error));
      event.preventDefault()
  };

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
      <form id="jobForm" action={this.props.form_path} method="post">
        {errors}
        <h1>New Job</h1>
        <input
          type="hidden"
          name="_method"
          defaultValue={this.props.form_method}
        />
        <input
          type="hidden"
          name="authenticity_token"
          defaultValue={this.props.csrf_token}
        />
        <input type="hidden" name="UTF-8" defaultValue="✓" />
        <div className="field">
          <label htmlFor="content">Content:</label>
          <input
            type="text"
            id="title"
            name="job[content]"
            defaultValue={this.props.content}
            onChange={this.handleContentChange}
          />
        </div>
        <div className="actions">
          <button type="submit" onClick={e => this.handleSubmit(e)}>
            Submit
          </button>
          <a href={"http://localhost:3000/calendar"}>Back</a>
        </div>
      </form>
    );
  }
}
export default JobNew;
