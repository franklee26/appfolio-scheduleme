import React from "react";
class ShowIndex extends React.Component {
  render() {
    var jobs = [];
    for(var i = 0; i < this.props.jobs.length; ++i) {
        jobs.push(
        <tr key={this.props.jobs[i].id}>
        <td>{this.props.jobs[i].content} </td>
        <td>{this.props.jobs[i].Tenant_id}</td>
        <td><a href ={this.props.jobs[i].show_path}>Show</a></td>
        <td><a href ={this.props.jobs[i].edit_path}>Edit</a></td>
        <td><a href={this.props.jobs[i].destroy_path} data-method="DELETE" data-confirm="Are you sure?">Destroy</a></td>
        </tr>
        );
    }
    return(
        <div>
            <h1>Listing Jobs</h1>
            <table>
                <thead>
                    <tr>
                        <th>Content</th>
                        <th>Tenant_id</th>
                        <th colSpan="3"></th>
                    </tr>
                </thead>
                <tbody>
                    {jobs}
                </tbody>
            </table>
            <br/>
            <a href ={this.props.new_job_path}>New Job</a>
        </div>
    );
  };
}
export default ShowIndex;