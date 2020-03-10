import React from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";


const VendorSelection = props => {
  return (
    <div>
      <header className="bg-dark py-3">
        <h1 align="center" className="display-3 text-white mt-5 mb-2">
          Select a Vendor
        </h1>
      <h5 align="center" className="display-6 text-white mb-2">We will find times from the vendor you select.</h5>

      </header>
      <div className="container">
        <view align="center">
          <ProgressBar
            now={50}
            label="Step 2/4"
            style={{
              height: "35px",
              fontSize: "25px",
              marginTop: "0.8rem",
              marginBottom: "0.8rem"
            }}
          />
        </view>
        <CardColumns>
          {props.vendors.map( function(vendor) {
          	const vendor_rating = vendor.rating? vendor.rating : 0;
          	return (
            <a key={vendor.id} style={{ cursor: "pointer" }} href={`/calendar/events/${vendor.id}`}>
              <Card border="info" style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{vendor.name}</Card.Title>
                  <Card.Text>Occupation: {vendor.occupation}
          			<StarRatings
                      rating={parseFloat(vendor_rating.toFixed(2))}
                      starDimension="17px"
                      starSpacing="2px"
                      starRatedColor="gold"
                      numberOfStars={5}
                      name="rating"
                    />{" "}

                  </Card.Text>
                </Card.Body>
              </Card>
            </a>
          )})}
        </CardColumns>
        <Button href="/calendar">Home</Button>
      </div>
    </div>
  );
};


export default VendorSelection;
