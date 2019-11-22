import React, { Component } from "react";

class VendorSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      name: "",
      occupation: "",
      zip: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // Todo: Validate the entered search parameters
    // Todo: if valid, pass the information in the state to the controller and redirect
    console.log("Submitting search result information");
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div>
        <h1>Search Vendors</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Search by First Name</label>
            <input
              value={this.state.name}
              name="name"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>Filter by Occupation</label>
            <input
              value={this.state.occupation}
              name="occupation"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>Filter by Zip Code</label>
            <input
              value={this.state.zip}
              name="zip"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <button onSubmit={e => this.handleSubmit(e)}>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default VendorSearch
