import React from "react";
class JobForm extends React.Component {
  render() {
    var errors = null;
    var errorsList = [];
    if(this.props.errors.length > 0) {
      {this.props.errors.length ? (
        this.props.errors.map(errors => (
          errorsList.push(<li key={"error-"}>{this.props.errors}</li>)
        ))
      ) : (
        <h1></h1>
      )}
      errors = (
        <div id="error_explanation">
          <h2>Errors prohibited this job from being saved:</h2>
          <ul>{errorsList}</ul>
        </div>
      );
    }
    return (
      <form action={this.props.form_path} method="post">
        {errors}
        <input type="hidden" name="_method" defaultValue={this.props.form_method} />
        <input type="hidden" name="authenticity_token" defaultValue={this.props.csrf_token} />
        <input type="hidden" name="UTF-8" defaultValue="✓" />
        <div className="field">
          <label htmlFor="content">Content:</label>
          <input type="text" id="title" name="job[content]" defaultValue={this.props.content} />
        </div>
        <div className="actions">
          <button type="submit">Submit</button>
        </div>
        <a href={this.props.show_path}>Show</a> |
        <a href={this.props.back_path}>Back</a>
      </form>
    );
  };
}
export default JobForm;


