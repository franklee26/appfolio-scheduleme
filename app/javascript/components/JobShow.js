import React from "react";
class ShowJob extends React.Component {
  render() {
    return(
      <div>
        <p>
          <strong>Content:</strong>
          {this.props.content}
        </p>
        <p>
           <strong>Tenant_id:</strong>
           {this.props.Tenant_id}
        </p>

        <a href={this.props.edit_path}>Edit</a> |
        <a href={this.props.back_path}>Back</a>
      </div>
    );
  };
}
export default ShowJob;
