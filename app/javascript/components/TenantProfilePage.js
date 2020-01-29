import React, { Component } from "react";

class TenantProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenant_id: this.props.id,
      name: "", 
      email: "", 
      landowner_id: "",
      street_address: "",
      city: "",
      zip: "",
      state: "",
      changed: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("/tenants/" + this.state.tenant_id)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({
        name: data.name, 
        email: data.email, 
        landowner_id: data.landowner_id,
        street_address: data.street_address,
        city: data.city,
        zip: data.zip,
        state: data.state
      })});
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch("/tenants/update_tenant", {
      method: 'PATCH',
      body: JSON.stringify({
        tenant_id: this.state.tenant_id,
        name: this.state.name, 
        email: this.state.email, 
        landowner_id: this.state.landowner_id, 
        street_address: this.state.street_address, 
        city: this.state.city, 
        zip: this.state.zip, 
        state: this.state.state
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
            <label>Landlord ID</label>
            <input
              value={this.state.landowner_id}
              name="landowner_id"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>Street Address</label>
            <input
              value={this.state.street_address}
              name="street_address"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>City</label>
            <input
              value={this.state.city}
              name="city"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>State</label>
            <input
              value={this.state.state}
              name="state"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            <label>Zip Code</label>
            <input
              value={this.state.zip}
              name="zip"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div>
            {this.state.changed && <button onSubmit={e => this.handleSubmit(e)}>Save</button>}
          </div>
        </form>
      </div>
    );
  }
}

export default TenantProfilePage
