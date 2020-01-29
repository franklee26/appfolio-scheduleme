import React, { Component } from "react";

class VendorProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendor_id: this.props.id,
      name: "",
      email: "",
      occupation: "",
      zip: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("/vendors/" + this.state.vendor_id)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ 
        name: data.name,
        email: data.email,
        occupation: data.occupation,
        zip: data.zip
      })});
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch("/vendors/update_vendor", {
      method: 'PATCH',
      body: JSON.stringify({
        vendor_id: this.state.vendor_id,
        name: this.state.name, 
        email: this.state.email,
        zip: this.state.zip,
        occupation: this.state.occupation
      })
    }).then((response) => {return response.json()}).then((data) => {
      if (data.code == 200){
        alert("Successfully Saved Shanges.")
      }
      else {
        alert("Failed To Save Changes.")
      }
      // reset the state to reflect current db values
      this.componentDidMount()
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      changed: true
    });
  }

  render() {
    return (
      <div>
        <h1>Your Profile</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Name</label>
            <input
              value={this.state.name}
              name="name"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              value={this.state.email}
              name="email"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>Occupation</label>
            <input
              value={this.state.occupation}
              name="occupation"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>Zip</label>
            <input
              value={this.state.zip}
              name="zip"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>{JSON.stringify(this.state.tenants)}</div>
          <div>
            {this.state.changed && <button onSubmit={e => this.handleSubmit(e)}>Save</button>}
          </div>
        </form>
      </div>
    );
  }
}

export default VendorProfilePage
