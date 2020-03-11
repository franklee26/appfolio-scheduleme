import React from "react";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import { shortFormatDate } from "./Events.js";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";

const VendorDisplay = props => {
  return (
    <div>
      <div>
        <header
          className="bg-dark py-3"
          align="left"
          style={{ margin: 0, padding: 0 }}
        >
          <Container width="auto" style={{ margin: 0, padding: 0 }}>
            <Row>
              <Col md="auto">
                <Image
                  src={props.vendor.profile_pic}
                  width="350"
                  height="350"
                  rounded
                />
              </Col>
              <Col align="center">
                <div
                  align="center"
                  className="display-3 text-white mt-5 mb-2"
                  style={{ margin: 0, padding: 0 }}
                >
                  <h1>{props.vendor.name}</h1>
                  <h2 style={{ margin: 0, padding: 0 }}>
                    {props.vendor.occupation
                      ? props.vendor.occupation
                      : "No occupation"}
                  </h2>
                  <div align="center">
                    <StarRatings
                      starDimension="75px"
                      rating={
                        props.vendor.rating
                          ? parseFloat(props.vendor.rating)
                          : 0.0
                      }
                      starRatedColor="gold"
                      starHoverColor="gold"
                      starSpacing="2px"
                      numberOfStars={5}
                      name="rating"
                    />
                    <h3 style={{ marginTop: "0.8rem" }}>
                      {props.vendor.rating
                        ? parseFloat(props.vendor.rating.toFixed(2))
                        : 0.0}
                      /5.00 from {props.vendor.num ? props.vendor.num : 0}{" "}
                      review(s)
                    </h3>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </header>
      </div>
      <ListGroup>
        <ListGroup.Item align="center">
          <h1>Contact Information</h1>
          <p align="center">
            <b>Phone</b>: {props.vendor.phone_number}
            <br></br>
            <b>Email</b>: {props.vendor.email}
            <br></br>
            <b>Address</b>: {props.vendor.street_address}, {props.vendor.city},{" "}
            {props.vendor.state}, {props.vendor.zip}
          </p>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="container" style={{ width: 750 }}>
            <div align="center" className="mb-5">
              {props.reviews.length ? <h1>Reviews</h1> : ""}
              {props.reviews.map(review => (
                <div align="left">
                  <div
                    style={{ cursor: "pointer" }}
                    class="card flex-row flex-wrap"
                    onClick={e => this.handleVendorListClick(e, vendor)}
                  >
                    <div class="card-header border-0">
                      <Image
                        src={props.review_to_tenant[review.id].profile_pic}
                        width="150"
                        height="150"
                        style={{ border: "1px solid #595757" }}
                        rounded
                      />
                    </div>
                    <div class="card-block px-2" style={{ width: 450 }}>
                      <h4 class="card-title" style={{ margin: 0, padding: 0 }}>
                        {
                          <StarRatings
                            rating={parseFloat(
                              review.rating ? review.rating.toFixed(2) : 0.0
                            )}
                            starDimension="25px"
                            starSpacing="1px"
                            starRatedColor="gold"
                            numberOfStars={5}
                            name="rating"
                          />
                        }
                      </h4>
                      <p class="card-text">
                        <small
                          className="text-muted"
                          style={{ borderBottom: "1px solid #bab5b5" }}
                        >
                          Review by {props.review_to_tenant[review.id].name} on{" "}
                          {shortFormatDate(review.created_at)}
                        </small>
                        <br />
                        <div style={{ marginTop: "5px", marginBottom: "15px" }}>
                          {review.text}
                        </div>
                      </p>
                    </div>
                  </div>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </ListGroup.Item>
      </ListGroup>
      <nav class="navbar fixed-bottom navbar-expand-lg navbar-dark default-color">
        <Button
          variant="secondary"
          type="submit"
          onClick={e => (window.location.href = "/vendors/search")}
          style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}
        >
          Back
        </Button>
      </nav>
    </div>
  );
};

export default VendorDisplay;
