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

const VendorDisplay = props => {
  console.log(props);
  return (
    <div>
      <div>
        <header className="bg-dark py-3" align="left">
          <Container width="auto">
            <Row>
              <Col md="auto">
                <Image
                  src={props.vendor.profile_pic}
                  width="400"
                  height="400"
                  rounded
                />
              </Col>
              <Col>
                <h1 align="center" className="display-3 text-white mt-5 mb-2">
                  {props.vendor.name} (
                  {props.vendor.occupation
                    ? props.vendor.occupation
                    : "No occupation"}
                  )
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
                </h1>
              </Col>
            </Row>
          </Container>
        </header>
      </div>
      <div className="container" style={{ width: 650 }}>
        <div align="center" className="mb-5">
          {props.reviews.length ? <h2>Reviews</h2> : ""}
          {props.reviews.map(review => (
            <div align="left">
              <Card mb-2 border="success" style={{ width: 650 }}>
                <Card.Header>
                  {" "}
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
                  <br />
                  <small className="text-muted">
                    Reviewed by {props.review_to_tenant[review.id]} on{" "}
                    {shortFormatDate(review.created_at)}
                  </small>
                </Card.Header>
                <Card.Body>{review.text}</Card.Body>
              </Card>
              <br />
            </div>
          ))}
        </div>
        <div>
          <Button
            variant="primary"
            type="submit"
            onClick={e => (window.location.href = "/vendors/search")}
            style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorDisplay;
