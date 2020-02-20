import React from "react";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import { shortFormatDate } from "./Events.js";

const VendorDisplay = props => {
  return (
    <div>
      <div>
        <header className="bg-dark py-3">
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
                  props.vendor.rating ? parseFloat(props.vendor.rating) : 0.0
                }
                starRatedColor="gold"
                starHoverColor="gold"
                starSpacing="2px"
                numberOfStars={5}
                name="rating"
              />
              <h3 style={{ marginTop: "0.8rem" }}>
                {props.vendor.rating ? parseFloat(props.vendor.rating.toFixed(2)) : 0.0}
                /5.00 from {props.vendor.num ? props.vendor.num : 0} review(s)
              </h3>
            </div>
          </h1>
        </header>
      </div>
      <div className="container">
        <div>
          {props.reviews.length ? <h2>Reviews</h2> : ""}
          <CardColumns>
            {props.reviews.map(review => (
              <Card ml-2 border="success">
                <Card.Header as="h5">
                  {" "}
                  {
                    <StarRatings
                      rating={parseFloat(
                        review.rating ? review.rating.toFixed(2) : 0.0
                      )}
                      starDimension="22px"
                      starSpacing="1px"
                      starRatedColor="gold"
                      numberOfStars={5}
                      name="rating"
                    />
                  }
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <b>
                      "{review.text}" -{props.review_to_tenant[review.id]} ({shortFormatDate(review.created_at)})
                    </b>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardColumns>
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
