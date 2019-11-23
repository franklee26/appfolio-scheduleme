import React from "react";

class Landing_Page_Job_Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      job_list: props.jobs, 
      default_form: <h1>Hello World</h1>, 
      displayed_job: props.jobs[0]
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickJob = this.handleClickJob.bind(this);
    //this.returnForm = this.returnForm();
    this.fullJobDescription = this.fullJobDescription.bind(this);
  }

  handleNameChange(event) {
    this.setState({value: event.target.name});
  }

  handleDescChange(event) {
    this.setState({value: event.target.description})
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  handleClickJob(event) {
    this.setState({displayed_job: this.job_list[2]});
    alert('A job was clicked: ' + this.state.displayed_job.id);
    this.setState({default_form: this.fullJobDescription})
  }

  fullJobDescription() {
    const lorem_ipsum_garbage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel finibus sapien. In nec lacinia erat. In congue leo eget mi vehicula, ac pulvinar sem varius. In tristique sollicitudin elementum. Ut diam nisl, sodales eget quam eget, efficitur aliquam quam. Curabitur ipsum nibh, placerat non vulputate quis, semper nec neque. Proin accumsan sem vitae libero porttitor, sed volutpat nisl tristique. Nullam lobortis felis eget lectus scelerisque interdum. ";
    
    let fullJobDescription = (<div>
            <h1>{this.state.displayed_job.title}</h1>
            <p>{`Job Type: ${this.state.displayed_job.job_type}`}</p>
            <p>{`Date Created: ${this.state.displayed_job.created_at.toString()}`}</p>
            <p>{`Tenant Name: Mr. Need Help`}</p>
            <p>{`Tenant ID: ${this.state.displayed_job.Tenant_id}`}</p>
            <p>{`Vendor Name: Mr. I'll Fix Your Face`}</p>
            <p>{`Vendor ID: ${this.state.displayed_job.Vendor_id}`}</p>
            <p>{`Description: ${this.state.displayed_job.content} ${lorem_ipsum_garbage}`}</p></div>);
    return fullJobDescription
  }

  render() {
    const color_scheme = ['#EEEEFF', '#7F7CAF', '#E65F5C', '#B5D99C', '#DDCA7D'];


    const jobListContainer = {
      backgroundColor: color_scheme[0], 
      height: '800px',
      display: 'flex', 
      flexDirection: 'column', 
    }

    const jobDescripContainer = {
      backgroundColor: color_scheme[1],
      height: '800px',
    }

    const jobListInnerContainer = {
      backgroundColor: color_scheme[2], 
      height: '50%',
      overflowY:'scroll',
      display: 'display',
    }

    const jobEntry = {
      listStyleType: 'none', 
      width: '90%', 
      height: '60px', 
      fontSize: '10px',
      paddingLeft: '5px', 
      margin: 'auto', 
      marginTop: '10px', 
      backgroundColor: color_scheme[3], 
      display: 'block', 
      borderRadius: '5px', 
    }

    const jobTitle = {
      fontSize: '20px', 
      fontWeight: 'bold', 
    }

    class JobDescription extends React.Component {
       render() {
       return (
          <div>
            <h1>{this.state.displayed_job.title}</h1>
            <p>{`Job Type: ${this.state.displayed_job.job_type}`}</p>
            <p>{`Date Created: ${this.state.displayed_job.created_at.toString()}`}</p>
            <p>{`Tenant Name: Mr. Need Help`}</p>
            <p>{`Tenant ID: ${this.state.displayed_job.Tenant_id}`}</p>
            <p>{`Vendor Name: Mr. I'll Fix Your Face`}</p>
            <p>{`Vendor ID: ${this.state.displayed_job.Vendor_id}`}</p>
            <p>{`Description: ${this.state.displayed_job.content} ${lorem_ipsum_garbage}`}</p>
          </div>
         );
        }
    }

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-3' style={jobListContainer}>
            <div style={jobListInnerContainer}>
              <h2>Pending Jobs</h2>
              {this.state.job_list ? (
                this.state.job_list.map(job => {
                  if (job.status == "pending")
                    return <div style={jobEntry} key={job.id} onClick={this.handleClickJob}>
                      <li style={jobTitle}>{`${job.title} (${job.job_type})`}</li>
                      <li>{`Date: ${job.created_at.toString().substring(0, 10)} Location: "Santa Barbara"`}</li>
                      <li>{`ID: ${job.id} Tenant ID: ${job.Tenant_id} Vendor ID: ${job.Vendor_id}`}</li>
                    </div>})) : (
                <p> No Jobs in the Database </p>)}
            </div>

            <div style={jobListInnerContainer}>
              <h2>Finished Jobs</h2>
              {this.state.job_list ? (
                this.state.job_list.map(job => {
                  console.log(job.id)
                  if (job.id == 1) 
                    return <li style={jobEntry} key={job.id}>
                    {`ID: ${job.id} Content: ${job.content} Tenant ID: ${job.Tenant_id} Vendor ID: ${job.Vendor_id}`}
                    </li>})) : (
                <p> No Jobs in the Database </p>)}
            </div>
          </div>

          <div className='col-md-9' style={jobDescripContainer}>
            {this.fullJobDescription()}
          </div>
        </div>

      </div>
    )

    //{this.returnForm}



    // return (
    //   <div className='container'>

    //     <form onSubmit={this.handleSubmit}>
    //       <div className="form-group">
    //         <label htmlFor="landowner_name" >Name</label>
    //         <input type="name" className="form-control" id="landowner_name" placeholder="Enter Your Name" onChange={this.handleNameChange} />
    //       </div>
    //       <div className="form-group">
    //         <label htmlFor="schedule_json">Description</label>
    //         <input type="json" className="form-control" id="schedule_json" placeholder="Your schedule" />
    //         <small id="emailHelp" className="form-text text-muted">Please describe your schedule in json.</small>
    //       </div>
    //       <div className="form-check">
    //         <input type="checkbox" className="form-check-input" id="exampleCheck1" />
    //         <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
    //       </div>
    //       <button type="submit" className="btn btn-primary">Submit</button>
    //     </form>
    //   </div>

    // );

  };
}

export default Landing_Page_Job_Listing;
