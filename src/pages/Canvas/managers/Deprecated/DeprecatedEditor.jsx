import React from 'react';
import { Alert } from 'reactstrap';

import Section from '@/components/Section';

function DeprecatedEditor() {
  return (
    <Section>
      <Alert color="warning">
        This block is now deprecated and is no longer available. This project will still work, but we recommend you to update this block as soon as
        possible.
      </Alert>
    </Section>
  );
}

export default DeprecatedEditor;
