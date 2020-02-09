import React from "react"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

class UserSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user_type: "Tenant"}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
      window.location.href = "/vendors/auth";
    }
  }

  handleClick(event, curr_user){
    event.preventDefault();
    this.setState({user_type: curr_user});
    if (curr_user == "Tenant"){
      window.location.href = "/tenants/auth";
    } else if (curr_user == "Landowner") {
      window.location.href = "/landowner/auth";
    } else {
      window.location.href = "/vendors/auth";
    }
  
  }

  render() {
    console.log(this.state.user_type);
    return (
            <div>
              <Button variant="primary" size="lg" block onClick={e => this.handleClick(e, "Tenant")}>
                Tenant Login
              </Button>
              <Button variant="success" size="lg" block onClick={e => this.handleClick(e, "Landowner")}>
                Landlord Login
              </Button>
              <Button variant="info" size="lg" block onClick={e => this.handleClick(e, "Vendor")}>
                Vendor Login
              </Button>        
            </div>
/*      <form onSubmit={this.handleSubmit}>
        <label>
          Please select who you are: 
          <select value={this.state.user_type} onChange={this.handleChange}>
            <option value="Tenant">Tenant</option>
            <option value="Landowner">Landowner</option>
            <option value="Vendor">Vendor</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>*/
    );
  }
}

export default UserSelection;
