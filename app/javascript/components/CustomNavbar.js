import React from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button
} from "react-bootstrap";

class CustomNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false
    }
  }

  componentDidMount() {
    fetch("/sessions/current_user/")
    .then((response) => {return response.json()})
    .then((data) => {this.setState({ 
      logged_in: data.user_type != "no user"
    })
    console.log(data)  
  });
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="https://www.appfolio.com/">
          Appfolio Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/vendors/search">Vendors</Nav.Link>
            <Nav.Link href="/calendar/login">Calendar</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="/jobs">Submit a Job</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/vendors/search">
                Vendor Search
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
            {!(this.state.logged_in) && <Button variant="outline-primary" href="/calendar/login">Login</Button>}
            {(this.state.logged_in) && <Button variant="outline-danger ml-2" href="/sessions/profile">Profile</Button>}
            {(this.state.logged_in) && <Button variant="outline-danger ml-2" href="/sessions/logout">Logout</Button>}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default CustomNavbar;
