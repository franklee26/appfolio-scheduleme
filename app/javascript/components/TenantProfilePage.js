import React, { Component } from "react";
import S3FileUpload from "react-s3";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import aws from "./AwsKeys";

const config = {
  bucketName: "scheduleme",
  region: "us-west-1",
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey
};

class TenantProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenant_id: this.props.id,
      name: "",
      email: "",
      landowner_id: "",
      street_address: "",
      city: "",
      zip: "",
      state: "",
      changed: false,
      profile_pic: "",
      phone_number: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("/tenants/" + this.state.tenant_id)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          name: data.name,
          email: data.email,
          landowner_id: data.landowner_id,
          street_address: data.street_address,
          city: data.city,
          zip: data.zip,
          state: data.state,
          profile_pic: data.profile_pic,
          phone_number: data.phone_number
        });
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch("/tenants/update_tenant", {
      method: "PATCH",
      body: JSON.stringify({
        tenant_id: this.state.tenant_id,
        name: this.state.name,
        email: this.state.email,
        landowner_id: this.state.landowner_id,
        street_address: this.state.street_address,
        city: this.state.city,
        zip: this.state.zip,
        state: this.state.state,
        phone_number: this.state.phone_number,
        profile_pic: this.state.profile_pic
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.code == 200) {
          window.location.reload(true);
          alert("Successfully Saved Changes.");
        } else {
          alert("Failed To Save Changes.");
        }
        // reset the state to reflect current db values
        this.componentDidMount();
      });
  }

  handleChange(e) {
    if (e.target.name == "profile_pic") {
      S3FileUpload.uploadFile(e.target.files[0], config)
        .then(data =>
          this.setState({
            ["profile_pic"]: data.location,
            changed: true
          })
        )
        .catch(err => console.error(err));
    } else {
      this.setState({
        [e.target.name]: e.target.value,
        changed: true
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Your Profile</h1>
        <Image
          src={this.state.profile_pic}
          width="400"
          height="400"
          style={{ border: "1px solid #595757" }}
          rounded
        />

        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="fileUpload">
            <Form.Control
              type="file"
              name="profile_pic"
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={this.state.phone_number}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="street">
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              type="text"
              name="street_address"
              value={this.state.street_address}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              value={this.state.state}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="zip">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="text"
              name="zip"
              value={this.state.zip}
              onChange={this.handleChange}
            />
          </Form.Group>

          {this.state.changed && (
            <Button
              variant="primary"
              type="submit"
              onSubmit={e => this.handleSubmit(e)}
            >
              Save
            </Button>
          )}
        </Form>
      </div>
    );
  }
}

export default TenantProfilePage;
