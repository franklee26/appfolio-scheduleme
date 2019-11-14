import React from "react";

const VendorList = props => {
  return (
    <div>
      <h1 align="center">List of Vendors</h1>
      {props.vendors.length ? (
        props.vendors.map(vendor => (
          <li>
            <a href="/vendors/profile">{`Name: ${vendor.name}\tOcupation: ${vendor.occupation}`}</a>
          </li>
        ))
      ) : (
        <h1> No results found. </h1>
      )}
    </div>
  );
};

export default VendorList;