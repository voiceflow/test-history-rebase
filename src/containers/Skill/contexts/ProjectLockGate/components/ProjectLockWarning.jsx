import React from 'react';
import { Alert } from 'reactstrap';

const ProjectLockWarning = ({ target, onTakeover }) => (
  <div style={{ maxWidth: 600 }} className="text-center">
    <img className="modal-img-small mb-4 mt-3" src="/warning.svg" alt="Upload" />
    <div className="modal-bg-txt mt-2">This project has another session in progress</div>
    <div className="modal-txt mt-2 mb-3">
      Temporarily for project safety, we only allow one editable version of this project to be open at a time - otherwise they may overwrite each
      other
      <br />
      This restriction will be addressed in later collaboration updates <br />
      <br />
      <span className="btn-link" onClick={onTakeover}>
        Takeover Current Session
      </span>
    </div>
    {target && (
      <Alert className="text-left py-4 mt-4">
        <h5>Open Session Info</h5>
        <b>Name:</b> {target.name} <br />
        <b>Email:</b> {target.email} <br />
        <b>Device:</b> {target.device.browser} on {target.device.os}
      </Alert>
    )}
  </div>
);

export default ProjectLockWarning;
