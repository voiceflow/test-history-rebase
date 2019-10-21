import React from 'react';
import { Alert } from 'reactstrap';

import { Section } from '@/containers/CanvasV2/components/BlockEditor';

function ExitEditor() {
  return (
    <Section>
      <Alert>This block ends the skill in its current flow and state</Alert>
    </Section>
  );
}

export default ExitEditor;
