import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const { compose, withProps, lifecycle } = require("recompose");

export const LandownerRemoveVendor = props => (
  <Modal show={props.show}>
    <Modal.Header>
      <Modal.Title>Success</Modal.Title>
    </Modal.Header>
    <Modal.Body>You have removed a vendor.</Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={e => window.location.reload(false)}>
        Done
      </Button>
    </Modal.Footer>
  </Modal>
);

export const LandownerAddVendor = props => (
  <Modal show={props.show}>
    <Modal.Header>
      <Modal.Title>Success</Modal.Title>
    </Modal.Header>
    <Modal.Body>You have added a vendor.</Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={e => window.location.reload(false)}>
        Done
      </Button>
    </Modal.Footer>
  </Modal>
);

export const LandownerRemoveTenant = props => (
  <Modal show={props.show}>
    <Modal.Header>
      <Modal.Title>Success</Modal.Title>
    </Modal.Header>
    <Modal.Body>You have removed a tenant.</Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={e => window.location.reload(false)}>
        Done
      </Button>
    </Modal.Footer>
  </Modal>
);

export const LandownerAddTenant = props => (
  <Modal show={props.show}>
    <Modal.Header>
      <Modal.Title>Success</Modal.Title>
    </Modal.Header>
    <Modal.Body>You have added a tenant.</Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={e => window.location.reload(false)}>
        Done
      </Button>
    </Modal.Footer>
  </Modal>
);

export const TenantReviewSuccess = props => (
  <Modal show={props.show}>
  <Modal.Header>
    <Modal.Title>Successfully submitted review for job!</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    We recorded your review and rating for the completed job.
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="primary"
      onClick={e => window.location.reload(false)}
    >
      Done
    </Button>
  </Modal.Footer>
</Modal>
)

export const TenantStreetAddress = () => (
  <Modal show={1}>
  <Modal.Header>
    <Modal.Title>Profile incomplete</Modal.Title>
  </Modal.Header>
  <Modal.Body>You must have a street address to continue</Modal.Body>
  <Modal.Footer>
    <Button
      variant="primary"
      onClick={e =>
        (window.location.href =
          "http://localhost:3000/sessions/profile")
      }
    >
      Continue
    </Button>
  </Modal.Footer>
</Modal>
)

export const VendorCompleteAll = props => (
  <Modal show={props.show}>
  <Modal.Header>
    <Modal.Title>Success</Modal.Title>
  </Modal.Header>
  <Modal.Body>You have completed all jobs</Modal.Body>
  <Modal.Footer>
    <Button
      variant="primary"
      onClick={e =>
        (window.location.href =
          "http://localhost:3000/calendar")
      }
    >
      Done
    </Button>
  </Modal.Footer>
</Modal>
)
