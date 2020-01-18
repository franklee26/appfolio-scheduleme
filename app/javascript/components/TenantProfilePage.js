import React, { Component } from "react";

class TenantProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenant_id: this.props.id,
      tenant_info: {"name": "", "email": ""}
    }
  }

  componentDidMount() {
    fetch("/tenants/" + this.state.tenant_id)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ tenant_info: data})});
  }

  render() {
    return (
      <div>
        <div>{this.state.tenant_info.name}</div>
        <div>{this.state.tenant_info.email}</div>
      </div>
    );
  }
}

export default TenantProfilePage
