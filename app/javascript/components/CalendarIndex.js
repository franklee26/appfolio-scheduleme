import React from "react";

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
      alert("Successfully added tenant!");
      window.location.reload(false);
    });
};

class CalendarIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      landownerResponse: null,
      tenantResponse: null,
      isLoaded2: false,
      landownerTenantsResponse: null
    };
  }

  componentDidMount() {
    if (this.props.user_type == "Tenant") {
      fetch(`http://localhost:3000/landowner/${this.props.user.landowner_id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            this.setState({
              isLoaded: true,
              landownerResponse: res
            });
          },
          error => {
            this.setState({
              isLoaded: false,
              error: error
            });
          }
        );
    } else if (this.props.user_type == "Landowner") {
      fetch("http://localhost:3000/tenants", { method: "GET" })
        .then(res => res.json())
        .then(
          res => {
            this.setState({
              isLoaded: true,
              tenantResponse: res
            });
          },
          error => {
            this.setState({
              isLoaded: false,
              error: error
            });
          }
        );
      // fetch my tenants
      fetch(`http://localhost:3000/landowner/tenants/${this.props.user.id}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(
          res => {
            this.setState({
              landownerTenantsResponse: res,
              isLoaded2: true
            });
          },
          error => {
            this.setState({
              error: error
            });
          }
        );
    }
  }

  render() {
    const {
      error,
      isLoaded,
      landownerResponse,
      tenantResponse,
      landownerTenantsResponse,
      isLoaded2
    } = this.state;
    if (error) {
      return <div>Error in loading... please refresh.</div>;
    } else if (!isLoaded) {
      return (
        <div>
          <h1>Loading data...</h1>
        </div>
      );
    } else if (!isLoaded2 && this.props.user_type == "Landowner") {
      return (
        <div>
          <h1>Finishing last retrieves...</h1>
        </div>
      );
    } else if (this.props.user_type == "Tenant") {
      return (
        <div className="container">
          <h1 align="center">{this.props.user_type} Calendar Page</h1>
          <h2>
            {this.props.user.name}'s list of calendars under email{" "}
            {this.props.user.email}
          </h2>
          <h2>Please select a calendar below to add an event.</h2>
          {this.props.calendars.map(calendar => (
            <li key={calendar.id}>
              <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
            </li>
          ))}
          {this.props.user.landowner_id == 0 ? (
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
    } else if (this.props.user_type == "Landowner") {
      return (
        <div className="container">
          <h1 align="center">{this.props.user_type} Calendar Page</h1>
          <h2>
            {this.props.user.name}'s list of calendars under email{" "}
            {this.props.user.email}
          </h2>
          <h2>Please select a calendar below to add an event.</h2>
          {this.props.calendars.map(calendar => (
            <li key={calendar.id}>
              <a href={`/calendar/${calendar.id}`}>{calendar.summary}</a>
            </li>
          ))}
          <h2>Your tenants:</h2>
          {landownerTenantsResponse.map(tenant => (
            <li key={tenant.id}>{tenant.name}</li>
          ))}
          <h2>Select user below as your listed tenant.</h2>
          {tenantResponse.map(tenant => (
            <li key={tenant.id}>
              <a
                href="#"
                onClick={e =>
                  handleClickTenant(e, this.props.user.id, tenant.id)
                }
              >
                {tenant.name}
              </a>
            </li>
          ))}
        </div>
      );
    }
  }
}

export default CalendarIndex;
