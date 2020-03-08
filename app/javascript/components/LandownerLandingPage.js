import React, { Component } from "react";

class LandownerLandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      firstName: "",
      lastName: "",
      occupation: "",
      zip: ""
    };
  }

  render() {
    return (
      <div>
        <h1>Welcome {this.props.name}</h1>
        <div>
          <VendorSearch />
        </div>
      </div>
    );
  }
}

export default LandownerLandingPage;
