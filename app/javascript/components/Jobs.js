import React from "react";
class ShowIndex extends React.Component {
  render() {
    var jobs = [];
    {this.props.jobs.length ? (
        this.props.jobs.map(job => (
            jobs.push(
                <tr key={job.id}>
                <td>{job.content} </td>
                <td>{job.Tenant_id}</td>
                <td><a href ={job.show_path}>Show</a></td>
                <td><a href ={job.edit_path}>Edit</a></td>
                <td><a href={job.destroy_path} data-method="DELETE" data-confirm="Are you sure?">Destroy</a></td>
                </tr>
            )
        ))
    ) : (
        <h1>No Jobs</h1>
    )}
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