import React, { Component } from "react";

class VendorProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendor_id: this.props.id,
      vendor_info: {"name": "", "email": "", "occupation": ""}
    }
  }

  componentDidMount() {
    fetch("/vendor/" + this.state.vendor_id)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ vendor_info: data})});
  }

  render() {
    return (
      <div>
        <div>{this.state.vendor_info.name}</div>
        <div>{this.state.vendor_info.email}</div>
        <div>{this.state.vendor_info.occupation}</div>
      </div>
    );
  }
}

export default VendorProfilePage
