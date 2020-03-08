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

class LandownerProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landowner_id: this.props.id,
      name: "",
      email: "",
      profile_pic: "",
      phone_number: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("/landowner/" + this.state.landowner_id)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          name: data.name,
          email: data.email,
          profile_pic: data.profile_pic,
          phone_number: data.phone_number
        });
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch("/landowner/update_landowner", {
      method: "PATCH",
      body: JSON.stringify({
        landowner_id: this.state.landowner_id,
        name: this.state.name,
        email: this.state.email,
        profile_pic: this.state.profile_pic,
        phone_number: this.state.phone_number
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

        {//this part is still in progress will make separate pr for it later}
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

export default LandownerProfilePage;
