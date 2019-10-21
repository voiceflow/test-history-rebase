import React from 'react';
import { Alert } from 'reactstrap';

const ProjectLockConnectionError = () => (
  <Alert color="danger" className="text-center p-4">
    <i className="fas fa-wifi-slash text-lg" />
    <br />
    <br />
    <b>Unable to Connect to Voiceflow</b>
    <br />
    Refresh your page or try again later
  </Alert>
);

export default ProjectLockConnectionError;
