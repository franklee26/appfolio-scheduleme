import React from "react";

const Homepage = props => {
  return (
    <div>
      <h1 align="center">Welcome to Uber for Vendors</h1>

      <h2>Current registered Tenants:</h2>
      {props.tenants.length ? (
        props.tenants.map(tenant => (
          <li
            key={tenant.id}
          >{`ID: ${tenant.id} Name: ${tenant.name} Email: ${tenant.email}`}</li>
        ))
      ) : (
        <h2> No tenants in database </h2>
      )}

      <h2>Current registered Landowners:</h2>
      {props.landowners.length ? (
        props.landowners.map(tenant => (
          <li
            key={landowner.id}
          >{`ID: ${landowner.id} Name: ${landowner.name} Email: ${landowner.email}`}</li>
        ))
      ) : (
        <h2> No landowners in database </h2>
      )}
    </div>
  );
};

export default Homepage;
