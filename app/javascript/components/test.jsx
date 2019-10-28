import React from "react"
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button
} from "react-bootstrap";

/*import PropTypes from "prop-types"

class TenantComponent extends React.Component {
  render () {
    return (
      <React.Fragment>
      </React.Fragment>
    );
  }
}

export default TenantComponent*/

const TenantComponent = props => {
/*  const times = ['1', '2', '3', '4', '5', '6', '7', '8']
*/  const times = [7, 8, 9, 10]
	const times2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div>
      <h1 align="center">Welcome to the Schedule Selection page for Tenants!</h1>
		<Form>
		  {['checkbox'].map(type => (
		    <div key={`inline-${type}`} className="mb-3">
		      <Form.Check inline label="1" type={type} id={`inline-${type}-1`} />
		      <Form.Check inline label="2" type={type} id={`inline-${type}-2`} />
		    </div>
		  ))}
		</Form>

		<Form>
		  {['checkbox'].map(type => (
		    <div key={`custom-inline-${type}`} className="mb-3">
		    {[1,2,3,4,5,6,7].map(type => (
			      <Form.Check
			        custom
			        inline
			        label="7 AM - 8 AM"
			        type={type}
			        id={`custom-inline-${type}-1`}
			      />
		    	))
		    }
		    </div>
		  ))}
		</Form>


		<Form>
		  {['checkbox'].map(type => (
		    <div key={`default-${type}`} className="mb-3">
		    {times.map(element =>(
			      <Form.Check 
			        type={type}
			        id={`default-${type}`}
			        label={`${element} AM - ${element+1} AM`}
			      />
		    	))
		    }
			      <Form.Check 
			        type={type}
			        id={`default-${type}`}
			        label={'11 AM - 12 PM'}
			      />		
			      	<Form.Check 
			        type={type}
			        id={`default-${type}`}
			        label={'12 PM - 1 PM'}
			      />	
		    {times2.map(element =>(
			      <Form.Check 
			        type={type}
			        id={`default-${type}`}
			        label={`${element} PM - ${element+1} PM`}
			      />
		    	))
		    }			          

		      <Button variant="primary" type="submit">
			    Submit
			  </Button>		      		      		      
		    </div>
		  ))}
		</Form>


    </div>
  );
};

export default TenantComponent;


