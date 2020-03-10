import React from "react";
import Image from "react-bootstrap/Image";

const CalendarProfile = props => (
  <div
    style={{ cursor: "pointer" }}
    className="card flex-row flex-wrap"
    style={{ marginTop: "0.8rem" }}
  >
    <div className="card-header border-0">
      <Image
        src={props.user.profile_pic}
        width="150"
        height="150"
        style={{ border: "1px solid #595757" }}
        rounded
      />
    </div>
    <div className="card-block px-2" width="600">
      <h4 className="card-title">
        {props.user.name}
        <br></br>
      </h4>
      <p className="card-text">
        <b>Phone</b>: {props.user.phone_number}
        <br></br>
        <b>Email</b>: {props.user.email}
        <br></br>
        <b>Address</b>: {props.user.street_address}, {props.user.city},{" "}
        {props.user.state}, {props.user.zip}
        <br></br>
        <b>Landlord</b>:{" "}
        {props.landowner == null ? (
          "You do not have a landowner"
        ) : (
          <b style={{fontWeight: "normal"}}>
          <Image
            src={props.landowner.profile_pic}
            width="50"
            height="50"
            style={{ border: "1px solid #595757" }}
            roundedCircle
          />
          {` ${props.landowner.name} (${props.landowner.email})`}
          </b>
        )}
      </p>
    </div>
    <div className="w-100"></div>
  </div>
);

export default CalendarProfile;
