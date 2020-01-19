import React, { Component } from "react";

class LandownerProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landowner_id: this.props.id,
      landowner_info: {"name": "", "email": ""}, 
      tenants: {}
    }
  }

  componentDidMount() {
    fetch("/landowner/" + this.state.landowner_id)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ landowner_info: data})});
	fetch("/landowner/tenants" + this.state.landowner_id)
		.then((response) => {return response.json()})
		.then((all_tenants) => {this.setState({ tenants: all_tenants})});
  }

  render() {
    return (
      <div>
        <div>{this.state.landowner_info.name}</div>
        <div>{this.state.landowner_info.email}</div>
        <div>{JSON.stringify(this.state.tenants)}</div>
      </div>
    );
  }
}

export default LandownerProfilePage
