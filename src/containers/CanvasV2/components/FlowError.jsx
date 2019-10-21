import React from 'react';

import { Section } from '@/containers/CanvasV2/components/BlockEditor';

const FlowError = () => (
  <Section className="text-center">
    <i className="fas fa-exclamation-triangle fa-2x mb-2" />
    <br />
    Unable to Retrieve Flow - This Flow may be broken or deleted
  </Section>
);

export default FlowError;
