import React from "react";

const Homepage = props => {
  return (
    <div>
      <h1>Welcome to Uber for Vendors</h1>
      <p1>This is being called from React! Mapping tenant objects from database below: </p1>
      {props.tenants.map(tenant => (
        <h1
          key={tenant.id}
        >{`ID: ${tenant.id}\tName: ${tenant.name}`}</h1>
      ))}
    </div>
  );
};

export default Homepage;
