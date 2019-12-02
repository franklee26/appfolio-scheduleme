import React from "react";

class Landing_Page_Job_Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_job: false,
      job_list: props.jobs, 
      default_form: <h1>Hello World</h1>, 
      displayed_job: props.jobs[0]
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickJob = this.handleClickJob.bind(this);
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

  handleClickJob(id, event) {
    var i;
    for (i = 0; i < this.state.job_list.length; i++) {
      if (this.state.job_list[i].id == id) {
        this.setState({displayed_job: this.state.job_list[i]});
        break;
      }
    }
    this.setState({show_job: true});
    //alert('A job was clicked: ' + id);
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

    const lorem_ipsum_garbage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel finibus sapien. In nec lacinia erat. In congue leo eget mi vehicula, ac pulvinar sem varius. In tristique sollicitudin elementum. Ut diam nisl, sodales eget quam eget, efficitur aliquam quam. Curabitur ipsum nibh, placerat non vulputate quis, semper nec neque. Proin accumsan sem vitae libero porttitor, sed volutpat nisl tristique. Nullam lobortis felis eget lectus scelerisque interdum. "

    class JobDescription extends React.Component {

      render() {
        if (this.props.show_job) {
         return (
            <div>
              <h1>{this.props.displayed_job.title}</h1>
              <p>{`Job Type: ${this.props.displayed_job.job_type}`}</p>
              <p>{`Date Created: ${this.props.displayed_job.created_at.toString()}`}</p>
              <p>{`Tenant Name: Mr. Need Help`}</p>
              <p>{`Tenant ID: ${this.props.displayed_job.Tenant_id}`}</p>
              <p>{`Vendor Name: Bob Electrician`}</p>
              <p>{`Vendor ID: ${this.props.displayed_job.Vendor_id}`}</p>
              <p>{`Description: ${this.props.displayed_job.content}`}</p>
            </div>
          );
       }
       return <h1> HELLO </h1>
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
                    return <div style={jobEntry} key={job.id} onClick={(e) => this.handleClickJob(job.id, e)}>
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
                  if (job.status == "completed")
                    return <div style={jobEntry} key={job.id} onClick={(e) => this.handleClickJob(job.id, e)}>
                      <li style={jobTitle}>{`${job.title} (${job.job_type})`}</li>
                      <li>{`Date: ${job.created_at.toString().substring(0, 10)} Location: "Santa Barbara"`}</li>
                      <li>{`ID: ${job.id} Tenant ID: ${job.Tenant_id} Vendor ID: ${job.Vendor_id}`}</li>
                    </div>})) : (
                <p> No Jobs in the Database </p>)}
            </div>
          </div>

          <div className='col-md-9' style={jobDescripContainer}>
            <JobDescription show_job={this.state.show_job} displayed_job={this.state.displayed_job} text_filler={lorem_ipsum_garbage}/>
          </div>
        </div>

      </div>
    )

  };
}

export default Landing_Page_Job_Listing;
