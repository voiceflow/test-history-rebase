import React from 'react';
import { Alert } from 'reactstrap';

import { Section } from '@/containers/CanvasV2/components/BlockEditor';

const FlowError = () => (
  <Section>
    <Alert color="danger" className="text-center">
      <i className="fas fa-exclamation-triangle fa-2x mb-2" />
      <br />
      Unable to Retrieve Flow - This Flow may be broken or deleted
      <br />
      <br />
      If deleted, delete this block
    </Alert>
  </Section>
);

export default FlowError;
