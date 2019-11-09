import React from "react";

class LandownerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', description: ''};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({value: event.target.name});
  }

  handleDescChange(event) {
    this.setState({value: event.target.description})
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className='container'>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="landowner_name" >Name</label>
            <input type="name" className="form-control" id="landowner_name" placeholder="Enter Your Name" onChange={this.handleNameChange} />
          </div>
          <div className="form-group">
            <label htmlFor="schedule_json">Description</label>
            <input type="json" className="form-control" id="schedule_json" placeholder="Your schedule" />
            <small id="emailHelp" className="form-text text-muted">Please describe your schedule in json.</small>
          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

    );
  };
}

export default LandownerPage;
