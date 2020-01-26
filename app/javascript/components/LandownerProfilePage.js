import React, { Component } from "react";

class LandownerProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landowner_id: this.props.id,
      name: "", 
      email: "", 
      tenants: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("/landowner/" + this.state.landowner_id)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ 
        name: data.name,
        email: data.email
      })});
	fetch("/landowner/tenants" + this.state.landowner_id)
		.then((response) => {return response.json()})
		.then((all_tenants) => {this.setState({ tenants: all_tenants})});
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch("/landowner/update_landowner", {
      method: 'PATCH',
      body: JSON.stringify({
        landowner_id: this.state.landowner_id,
        name: this.state.name, 
        email: this.state.email,
      })
    }).then((response) => {return response.json()}).then((data) => {
      if (data.code == 200){
        // TODO: add an alert that it worked.
        console.log("successfully saved changes to db")
      }
      else {
        // TODO: add an alert that it failed
        console.log("failed to save changes to db")
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
          <div>{JSON.stringify(this.state.tenants)}</div>
          <div>
            {this.state.changed && <button onSubmit={e => this.handleSubmit(e)}>Save</button>}
          </div>
        </form>
      </div>
    );
  }
}

export default LandownerProfilePage
