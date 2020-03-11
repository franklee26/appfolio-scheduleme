import React from "react";
import CardColumns from "react-bootstrap/CardColumns";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Image from "react-bootstrap/Image";

const VendorSelection = props => {
  return (
    <div>
      <header className="bg-dark py-3">
        <h1 align="center" className="display-3 text-white mt-5 mb-2">
          Select a Vendor
        </h1>
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
        {props.vendors.map(function(vendor) {
          return (
            <div className="container w-75">
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                width="500"
                overlay={<Tooltip>Click to Select</Tooltip>}
              >
                <div
                  style={{ cursor: "pointer" }}
                  class="card flex-row flex-wrap"
                  onClick={e =>
                    (window.location.href = `/calendar/events/${vendor.id}`)
                  }
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
                          vendor.rating ? vendor.rating.toFixed(2) : "0.0"
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
                      <b>Address</b>: {vendor.street_address}, {vendor.city},{" "}
                      {vendor.state}, {vendor.zip}
                    </p>
                  </div>
                  <div class="w-100"></div>
                </div>
              </OverlayTrigger>
              <br></br>
            </div>
          );
        })}

        <Button style={{ marginRight: "0.8rem" }} href="/jobs/new">
          Back
        </Button>
        <Button href="/calendar">Home</Button>
      </div>
    </div>
  );
};

export default VendorSelection;
