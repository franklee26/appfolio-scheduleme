import React from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Image
} from "react-bootstrap";

class CustomNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      profile_pic:
        "https://scheduleme.s3-us-west-1.amazonaws.com/missing_300x300.png"
    };
  }

  componentDidMount() {
    fetch("/sessions/current_user/")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          logged_in: data.user_type != "no user"
        });
        if (data.user_type == "tenant") {
          fetch("/tenants/" + data.user_id)
            .then(response => {
              return response.json();
            })
            .then(data => {
              this.setState({
                profile_pic: data.profile_pic
              });
            });
        }
        if (data.user_type == "vendor") {
          fetch("/vendors/" + data.user_id)
            .then(response => {
              return response.json();
            })
            .then(data => {
              this.setState({
                profile_pic: data.profile_pic
              });
            });
        }
        if (data.user_type == "landowner") {
          fetch("/landowner/" + data.user_id)
            .then(response => {
              return response.json();
            })
            .then(data => {
              this.setState({
                profile_pic: data.profile_pic
              });
            });
        }
      });
  }

  render() {
    return (
      <Navbar bg="light" expand="lg" style={{ margin: 0, padding: 0 }}>
        <Navbar.Brand href="/">
          <Image src="https://i.imgur.com/C8rMjOj.png" width="56" height="56" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {!this.state.logged_in && <Nav.Link href="/">Home</Nav.Link>}
            {this.state.logged_in && <Nav.Link href="/calendar">Home</Nav.Link>}
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/vendors/search">Vendors</Nav.Link>
          </Nav>
          {!this.state.logged_in && (
            <Button variant="outline-primary" href="/calendar/login">
              Login
            </Button>
          )}
          {this.state.logged_in && (
            <NavDropdown
              style={{ margin: 0, padding: 0 }}
              title={
                <Image
                  src={this.state.profile_pic}
                  width="40"
                  height="40"
                  style={{ border: "1px solid #595757" }}
                  roundedCircle
                />
              }
              id="dropdown"
            >
              <NavDropdown.Item href="/sessions/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/sessions/logout">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default CustomNavbar;
