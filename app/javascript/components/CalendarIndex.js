import React, { useState, useEffect } from "react";

// POST request adds tenant to the landowner
const handleClickTenant = (event, landowner_id, tenant_id) => {
  event.preventDefault();
  fetch("http://localhost:3000/landowner/add_tenant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      landowner_id: landowner_id,
      tenant_id: tenant_id
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.code == "200") {
        alert("Successfully added tenant!");
        window.location.reload(false);
      } else {
        alert("Failed to add tenant (returned code 400)");
      }
    });
};

const handleClickVendor = (event, landowner_id, vendor_id) => {
  event.preventDefault();
  fetch("http://localhost:3000/landowner/add_vendor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      landowner_id: landowner_id,
      vendor_id: vendor_id
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.code == "200") {
        alert("Successfully added vendor!");
        window.location.reload(false);
      } else {
        alert("Failed to add vendor (returned code 400)");
      }
    });
};

const handleDeleteTenant = (event, tenant_id) => {
  event.preventDefault();
  fetch(`http://localhost:3000/landowner/tenants/${tenant_id}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(response => {
      if (response.status == "200") {
        alert("Successfully removed tenant.");
        window.location.reload(false);
      } else {
        alert("Failed to remove tenant.");
      }
    });
};

const handleDeleteVendor = (event, landowner_id, vendor_id) => {
  event.preventDefault();
  fetch(
    `http://localhost:3000/landowner/${landowner_id}/vendors/${vendor_id}`,
    {
      method: "DELETE"
    }
  )
    .then(response => response.json())
    .then(response => {
      if (response.status == "200") {
        alert("Successfully removed vendor.");
        window.location.reload(false);
      } else {
        alert("Failed to remove vendor.");
      }
    });
};

/*
isLoaded: mounting landowner response
isLoaded2: mounting landowner's tenants response
landownerResponse: returns landowner with landowner id === landowner_id
tenantResponse: returns all tenants without a landowner
*/
const CalendarIndex = props => {
  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    landownerResponse: null,
    tenantResponse: null,
    isLoaded2: false,
    isLoaded3: false,
    vendorResponse: null
  });

  useEffect(() => {
    if (props.user_type == "Tenant") {
      fetch(`http://localhost:3000/landowner/${props.user.landowner_id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              isLoaded: true,
              landownerResponse: res
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              isLoaded: false,
              error: error
            }));
          }
        );
    } else if (props.user_type == "Landowner") {
      fetch("http://localhost:3000/tenants/no_landowner", { method: "GET" })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              isLoaded: true,
              tenantResponse: res
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              isLoaded: false,
              error: error
            }));
          }
        );
      fetch(`http://localhost:3000/landowner/${props.user.id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              landownerResponse: res,
              isLoaded2: true
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              error: error
            }));
          }
        );
      fetch(`http://localhost:3000/vendors/`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            setState(prevState => ({
              ...prevState,
              vendorResponse: res,
              isLoaded3: true
            }));
          },
          error => {
            setState(prevState => ({
              ...prevState,
              error: error
            }));
          }
        );
    } else if (props.user_type == "Vendor") {
      fetch(`http://localhost:3000/vendors/${props.user.id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(res => {
          setState(prevState => ({
            ...prevState,
            vendorResponse: res,
            isLoaded: true
          })),
            error => {
              setState(prevState => ({
                ...prevState,
                error: error
              }));
            };
        });
    }
  }, []);

  const {
    error,
    isLoaded,
    landownerResponse,
    tenantResponse,
    vendorResponse,
    isLoaded2,
    isLoaded3
  } = state;
  if (error) {
    return <div>Error in loading... please refresh.</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <h1>Loading data...</h1>
      </div>
    );
  } else if ((!isLoaded2 || !isLoaded3) && props.user_type == "Landowner") {
    return (
      <div>
        <h1>Finishing last retrieves...</h1>
      </div>
    );
  } else if (props.user_type == "Tenant") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>
        <h2>
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
        <h2>Please select a calendar below to add an event.</h2>
        {props.calendars.map(calendar => (
          <li key={calendar.id}>
            <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
          </li>
        ))}
        {props.user.landowner_id == 0 ? (
          <h2>
            You do not have a landowner yet! Your landowner will assign you.
          </h2>
        ) : (
          <h2>
            {" "}
            Your assigned landowner is {landownerResponse.name} with email{" "}
            {landownerResponse.email}{" "}
          </h2>
        )}
      </div>
    );
  } else if (props.user_type == "Landowner") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>
        <h2>
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
        <h2>Please select a calendar below to add an event.</h2>
        {props.calendars.map(calendar => (
          <li key={calendar.id}>
            <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
          </li>
        ))}
        {landownerResponse.tenants.length ? (
          <div>
            <h2>Your Tenants (click to delete tenant): </h2>
            {landownerResponse.tenants.map(tenant => (
              <li key={tenant.id}>
                <a href="#" onClick={e => handleDeleteTenant(e, tenant.id)}>
                  {tenant.name}
                </a>
              </li>
            ))}
          </div>
        ) : (
          <h2>You have no tenants.</h2>
        )}
        {landownerResponse.vendors.length ? (
          <div>
            <h2>Your vendors (click to delete vendor): </h2>
            {landownerResponse.vendors.map(vendor => (
              <li key={vendor.id}>
                <a
                  href="#"
                  onClick={e => handleDeleteVendor(e, props.user.id, vendor.id)}
                >
                  {vendor.name} ({vendor.occupation})
                </a>
              </li>
            ))}
          </div>
        ) : (
          <h2>You have no vendors.</h2>
        )}
        <h2>Select user below to add as your listed tenant.</h2>
        {tenantResponse.map(tenant => (
          <li key={tenant.id}>
            <a
              href="#"
              onClick={e => handleClickTenant(e, props.user.id, tenant.id)}
            >
              {tenant.name}
            </a>
          </li>
        ))}
        <h2>Select user below to add as your listed vendor.</h2>
        {vendorResponse
          .filter(
            vendor =>
              vendor.landowners.filter(
                landowner => landowner.id == props.user.id
              ).length == 0
          )
          .map(vendor => (
            <li key={vendor.id}>
              <a
                href="#"
                onClick={e => handleClickVendor(e, props.user.id, vendor.id)}
              >
                {vendor.name} ({vendor.occupation})
              </a>
            </li>
          ))}
        {landownerResponse.tenants.length ? (
          <div>
            <h2>Your Tenant's Jobs: </h2>
            {landownerResponse.tenants.map(tenants =>
              tenants.jobs.map(job =>
                job.vendor_id != 0 ? (
                  <li>
                    CONFIRMED submitted by {tenants.name} id: {job.id} content:{" "}
                    {job.content}
                  </li>
                ) : (
                  <li>
                    UNCONFIRMED submitted by {tenants.name} id: {job.id}{" "}
                    content: {job.content}{" "}
                  </li>
                )
              )
            )}
          </div>
        ) : (
          <h2>You have no pending tenant jobs.</h2>
        )}
      </div>
    );
  } else if (props.user_type == "Vendor") {
    return (
      <div className="container">
        <h1 align="center">{props.user_type} Calendar Page</h1>
        <h2>
          {props.user.name}'s list of calendars under email {props.user.email}
        </h2>
        <h2>Please select a calendar below to add an event.</h2>
        {props.calendars.map(calendar => (
          <li key={calendar.id}>
            <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
          </li>
        ))}
        {vendorResponse.landowners.length ? (
          <h2>Your assigned landowners: </h2>
        ) : (
          <h2>You do not have any assigned landowners. </h2>
        )}
        <ul>
          {vendorResponse.landowners.map(landowner => (
            <li key={landowner.id}>
              {landowner.name} available at {landowner.email}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default CalendarIndex;
