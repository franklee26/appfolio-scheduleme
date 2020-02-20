import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";

class VendorSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      name: "",
      occupation: "",
      zip: "",
      submitted: false,
      vendorSelected: false,
      selectedVendor: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // Todo: Validate the entered search parameters
    // Todo: if valid, pass the information in the state to the controller and redirect
    var vendors = this.props.vendors;
    vendors = vendors.filter((vendor) => {
      let occupationCheck = this.state.occupation.length == 0 || this.state.occupation.toUpperCase() == vendor.occupation.toUpperCase();
      let nameCheck = this.state.name.length == 0 || (vendor.name.toUpperCase().indexOf(this.state.name.toUpperCase()) != -1);
      let zipCheck = this.state.zip.length == 0 || (vendor.zip == this.state.zip);
      let notDefault = vendor.name != "DEFAULT" && vendor.occupation != "DEFAULT";
      return occupationCheck && nameCheck && zipCheck && notDefault;
    })
    this.setState({
      submitted: true,
      list: vendors
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleVendorListClick(e, vendor) {
    e.preventDefault();
    this.setState({
      selectedVendor: vendor,
      vendorSelected: true
    });
  }

  render() {
    if(this.state.vendorSelected) {
      window.location.href = `/vendors/display/${this.state.selectedVendor.id}`;
      return (<div> </div>);
    } else {
      return (
        <div>
          <div>
            <header className = "bg-dark py-3">
            <h1 align="center" className="display-3 text-white mt-5 mb-2">Find a Vendor</h1>
            </header>
          </div>
          <div className="container">
          <form align = "center" onSubmit={this.handleSubmit}>
            <div>
              <label>Search by Name</label>
              <input
                value={this.state.name}
                name="name"
                onChange={e => this.handleChange(e)}
              />
            </div>
            <div>
              <label>Filter by Occupation</label>
              <input
                value={this.state.occupation}
                name="occupation"
                onChange={e => this.handleChange(e)}
              />
            </div>
            <div>
              <label>Filter by Zip Code</label>
              <input
                value={this.state.zip}
                name="zip"
                onChange={e => this.handleChange(e)}
              />
            </div>
            <div>
              <Button 
                variant="primary"
                type="submit" 
                onClick={e => this.handleSubmit(e)}
              >
                search
              </Button>
            </div>
          </form>
          <div>
            {this.state.submitted &&
              <div>
                <h1 align="center">Search Results</h1>
                {this.state.list.length ? (
                  this.state.list.map(vendor => (
                    <Button variant="secondary" size="lg" block onClick={e => this.handleVendorListClick(e,vendor)}>
                      Name: {vendor.name}    Ocupation: {vendor.occupation}                     ({
                      <StarRatings
                        rating={parseFloat(vendor.rating ? vendor.rating.toFixed(2) : "0.0")}
                        starDimension="19px"
                        starSpacing="1px"
                        starRatedColor="gold"
                        numberOfStars={5}
                        name="rating"
                      />
                    })
                    </Button>
                  ))
                ) : (
                  <label> No results found. </label>
                )}
              </div>
            }
          </div>
          </div>
        </div>
      );
    }
  }
}

export default VendorSearch
