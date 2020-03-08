import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

class VendorSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.vendors.filter(vendor => {
        return vendor.name != "DEFAULT";
      }),
      name: "",
      occupation: "",
      zip: "",
      vendorSelected: false,
      selectedVendor: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // Todo: Validate the entered search parameters
    // Todo: if valid, pass the information in the state to the controller and redirect
    var vendors = this.props.vendors;
    vendors = vendors.filter(vendor => {
      let occupationCheck =
        this.state.occupation.length == 0 ||
        this.state.occupation.toUpperCase() ==
          (vendor.occupation ? vendor.occupation.toUpperCase() : "n/a");
      let nameCheck =
        this.state.name.length == 0 ||
        vendor.name.toUpperCase().indexOf(this.state.name.toUpperCase()) != -1;
      let zipCheck = this.state.zip.length == 0 || vendor.zip == this.state.zip;
      let notDefault =
        vendor.name != "DEFAULT" && vendor.occupation != "DEFAULT";
      return occupationCheck && nameCheck && zipCheck && notDefault;
    });
    this.setState({
      list: vendors
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleVendorListClick(e, vendor) {
    e.preventDefault();
    this.setState({
      selectedVendor: vendor,
      vendorSelected: true
    });
  }

  render() {
    if (this.state.vendorSelected) {
      window.location.href = `/vendors/display/${this.state.selectedVendor.id}`;
      return (
        <div>
          <Spinner
            variant="primary"
            animation="border"
            style={{
              width: "5rem",
              height: "5rem",
              position: "fixed",
              top: "50vh",
              left: "50vw"
            }}
          />{" "}
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <header className="bg-dark py-3">
              <h1 align="center" className="display-3 text-white mt-5 mb-2">
                Find a Vendor
              </h1>
            </header>
          </div>
          <br></br>
          <div className="container">
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.name}
                  name="name"
                  onChange={e => this.handleChange(e)}
                />
              </Form.Group>
              <Form.Group controlId="occupation">
                <Form.Label>Occupation</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.occupation}
                  name="occupation"
                  onChange={e => this.handleChange(e)}
                />
              </Form.Group>
              <Form.Group controlId="zip">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.zip}
                  name="zip"
                  onChange={e => this.handleChange(e)}
                />
              </Form.Group>
            </Form>
            <Form align="center" onSubmit={this.handleSubmit}>
              <Button
                variant="primary"
                type="submit"
                onSubmit={e => this.handleSubmit(e)}
              >
                Search
              </Button>
            </Form>
            <div>
              {
                <div>
                  <h1 align="center">Search Results</h1>
                  {this.state.list.length ? (
                    this.state.list.map(vendor => (
                      <div className="container w-75">
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          width="500"
                          overlay={
                            <Tooltip>Click For More Information</Tooltip>
                          }
                        >
                          <div
                            style={{ cursor: "pointer" }}
                            class="card flex-row flex-wrap"
                            onClick={e => this.handleVendorListClick(e, vendor)}
                          >
                            <div class="card-header border-0">
                              <Image
                                src={vendor.profile_pic}
                                width="150"
                                height="150"
                                style={{ border: "1px solid #595757" }}
                                rounded
                              />
                            </div>
                            <div class="card-block px-2" width="600">
                              <h4 class="card-title">
                                {vendor.name}:{" "}
                                {vendor.occupation ? vendor.occupation : "None"}
                                <br></br>
                                <StarRatings
                                  rating={parseFloat(
                                    vendor.rating
                                      ? vendor.rating.toFixed(2)
                                      : "0.0"
                                  )}
                                  starDimension="19px"
                                  starSpacing="1px"
                                  starRatedColor="gold"
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </h4>
                              <p class="card-text">
                                <b>Phone</b>: {vendor.phone_number}
                                <br></br>
                                <b>Email</b>: {vendor.email}
                                <br></br>
                                <b>Address</b>: {vendor.street_address},{" "}
                                {vendor.city}, {vendor.state}, {vendor.zip}
                              </p>
                            </div>
                            <div class="w-100"></div>
                          </div>
                        </OverlayTrigger>
                        <br></br>
                      </div>
                    ))
                  ) : (
                    <label> No results found. </label>
                  )}
                </div>
              }
            </div>
          </div>
        </div>
      );
    }
  }
}

export default VendorSearch;
/*<Button
  variant="secondary"
  size="lg"
  block
  onClick={e => this.handleVendorListClick(e, vendor)}
>
  {vendor.name}: {vendor.occupation} (
  {
    <StarRatings
      rating={parseFloat(vendor.rating ? vendor.rating.toFixed(2) : "0.0")}
      starDimension="19px"
      starSpacing="1px"
      starRatedColor="gold"
      numberOfStars={5}
      name="rating"
    />
  }
  )
</Button>;*/
