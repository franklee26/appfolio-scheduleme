import React from "react";

const Homepage = props => {
  return (
    <div className="container">
      <h1 align="center">Welcome to Uber for Vendors</h1>
      <h2>Current registered Tenants:</h2>
      {props.tenants.length ? (
        props.tenants.map(tenant => (
          <li
            key={tenant.id}
          >{`ID: ${tenant.id} Name: ${tenant.name} Email: ${tenant.email}`}</li>
        ))
      ) : (
        <p1> No tenants in database </p1>
      )}

      <h2>Current registered Landowners:</h2>
      {props.landowners.filter(landowner => landowner.id != 0).length ? (
        props.landowners
          .filter(landowner => landowner.id != 0)
          .map(landowner => (
            <li
              key={landowner.id}
            >{`ID: ${landowner.id} Name: ${landowner.name} Email: ${landowner.email}`}</li>
          ))
      ) : (
        <p1> No landowners in database </p1>
      )}
      <h2>Current registered Vendors:</h2>
      {props.vendors.length ? (
        props.vendors.map(vendor => (
          <li
            key={vendor.id}
          >{`ID: ${vendor.id} Name: ${vendor.name} Email: ${vendor.email}`}</li>
        ))
      ) : (
        <p1> No vendors in database </p1>
      )}
    </div>
  );
};

export default Homepage;
