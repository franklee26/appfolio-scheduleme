import React, { Component } from "react";

class TenantProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenant_id: this.props.id,
      name: "", 
      email: "", 
      landowner_id: "",
      changed: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("/tenants/" + this.state.tenant_id)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ name: data.name, email: data.email, landowner_id: data.landowner_id})});
  }

  handleSubmit(e) {
    e.preventDefault();
    // Todo: change the values in the database
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
        <h1>Tenant Profile</h1>
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
              name="landownder_id"
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
