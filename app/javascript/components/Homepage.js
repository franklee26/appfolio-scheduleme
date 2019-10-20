import React from "react";

const Homepage = props => {
  return (
    <div>
      <h1 align="center">Welcome to Uber for Vendors</h1>
      <h1>
        This is being called from React! Mapping tenant objects from database
        below:
      </h1>
      {props.tenants.length ? (
        props.tenants.map(tenant => (
          <li key={tenant.id}>{`ID: ${tenant.id}\tName: ${tenant.name}`}</li>
        ))
      ) : (
        <h1> No tenants in database </h1>
      )}
    </div>
  );
};

export default Homepage;
