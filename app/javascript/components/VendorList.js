import React from "react";

const VendorList = props => {
  return (
    <div>
      <h1 align="center">Search Results</h1>
      {props.vendors.length ? (
        props.vendors.map(vendor => (
          <li>
            <a href="/vendors/profile">{`Name: ${vendor.name}\tOcupation: ${vendor.occupation}`}</a>
          </li>
        ))
      ) : (
        <label> No results found. </label>
      )}
    </div>
  );
};

export default VendorList;