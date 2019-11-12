import React from "react"

class UserSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user_type: "Tenant"};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({user_type: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    // I think we can make a more elegant solution
    if (this.state.user_type === "Tenant") {
      window.location.href = "/tenants/auth";
    } else if (this.state.user_type == "Landowner") {
      window.location.href = "/landowner/auth";
    } else {
      // for vendor
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Please select who you are: 
          <select value={this.state.user_type} onChange={this.handleChange}>
            <option value="Tenant">Tenant</option>
            <option value="Landowner">Landowner</option>
            <option value="Vendor">Vendor</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default UserSelection;
