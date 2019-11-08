import React from "react";

const VendorList = props => {
  return (
    <div>
      <h1 align="center">List of Vendors</h1>
      {props.vendors.length ? (
        props.vendors.map(vendor => (
          <li key={vendor.id}>{`Name: ${vendor.name}\tOcupation: ${vendor.occupation}`}</li>
        ))
      ) : (
        <h1> No vendors in database </h1>
      )}
    </div>
  );
};

export default VendorList;