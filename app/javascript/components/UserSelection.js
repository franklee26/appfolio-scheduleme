import React from "react"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import CardDeck from 'react-bootstrap/CardDeck';

class UserSelection extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
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
    return (
      <div>
            <header class="bg-dark py-1">
            <h1 align="center" class="display-1 text-white mt-5 mb-2">ScheduleMe</h1>
                      <p align="center" class="lead text-light">
                      Software that makes scheduling service jobs seamless.
                      </p>
            </header>
            <div class="container pt-3"> 
              <CardDeck>
                <Card ml-2 border="primary">
                <Card.Header as="h5">Tenant Portal</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      Access your Tenant Portal to view scheduled jobs, submit new job requests, and update your profile information.
                    </Card.Text>
                    <Button variant="outline-primary" onClick={e => this.handleClick(e, "Tenant")}> Tenants Login Here </Button>
                  </Card.Body>
                </Card>
                <Card border="info">
                <Card.Header as="h5">Landlord Portal</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      Access your Landlord Portal to add or remove Tenants and Vendors, and to update your profile information.
                    </Card.Text>
                    <Button variant="outline-info" onClick={e => this.handleClick(e, "Landowner")}> Landlords Login Here </Button>
                  </Card.Body>
                </Card>
                <Card border="success">
                <Card.Header as="h5">Vendor Portal</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      Access your Vendor Portal to accept, view, or complete your scheduled jobs, and update your profile information.
                    </Card.Text>
                    <Button variant="outline-success" onClick={e => this.handleClick(e, "Vendor")}> Vendors Login Here </Button>
                  </Card.Body>
                </Card>
              </CardDeck>
            </div>
            </div>
    );
  }
}

export default UserSelection;
