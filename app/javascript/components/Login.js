import React from "react";
import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Button
  } from "react-bootstrap";

const Login = () => {
  return (
  <div class="container center_div col-xs-4">
      <h1 align="center">Tenant Login Page</h1>
        <Form>
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
            <Form.Label>I'm a: &ensp; </Form.Label>
            
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
                <label class="form-check-label" for="inlineRadio1">Tenant</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
                <label class="form-check-label" for="inlineRadio2">Landlord</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3"/>
                <label class="form-check-label" for="inlineRadio3">Vendor</label>
            </div>
        </Form.Group>
        <Button variant="primary" type="submit">
            Log In
        </Button>
        </Form>
  </div>
  
  
  );
};

export default Login;
