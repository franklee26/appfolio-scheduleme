import React, { Component } from "react";
import VendorList from "./VendorList";

class VendorSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      name: "",
      occupation: "",
      zip: "",
      submitted: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // Todo: Validate the entered search parameters
    // Todo: if valid, pass the information in the state to the controller and redirect
    var vendors = this.props.vendors;
    vendors = vendors.filter((vendor) => {
      let occupationCheck = this.state.occupation.length == 0 || this.state.occupation.toUpperCase() == vendor.occupation.toUpperCase();
      return occupationCheck;
    })
    this.setState({
      submitted: true,
      list: vendors
    });
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
            <label>Search by Name</label>
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
        <div>
          {this.state.submitted && <VendorList vendors={this.state.list} />}
        </div>
      </div>
    );
  }
}

export default VendorSearch
