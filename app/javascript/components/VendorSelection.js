import React from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";


const VendorSelection = props => {
console.log((props.vendors)[0]);
console.log(props.calendar_id);
  return (
    <div>
      <header className="bg-dark py-3">
        <h1 align="center" className="display-3 text-white mt-5 mb-2">
          Select a Calendar
        </h1>
      <h5 align="center" className="display-6 text-white mb-2">The job request will be added to the Google Calendar that you select.</h5>

      </header>
      <div className="container">
        <view align="center">
          <ProgressBar
            now={75}
            variant="success"
            label="Step 3/4"
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
            <a key={vendor.id} style={{ cursor: "pointer" }} href={`/calendar/events/${props.calendar_id}/${vendor.id}`}>
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
