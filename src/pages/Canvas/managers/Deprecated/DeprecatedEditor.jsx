import React from 'react';
import { Alert } from 'reactstrap';

import { Content, Section } from '@/pages/Canvas/components/BlockEditor';

function DeprecatedEditor() {
  return (
    <Content>
      <Section>
        <Alert color="warning">
          This block is now deprecated and is no longer available. This project will still work, but we recommend you to update this block as soon as
          possible.
        </Alert>
      </Section>
    </Content>
  );
}

export default DeprecatedEditor;
