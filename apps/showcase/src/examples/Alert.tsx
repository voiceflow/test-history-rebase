import { Alert } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const defaultAlert = createExample('default', () => <Alert>This is a default alert.</Alert>);

const defaultTitleAlert = createExample('default with title', () => <Alert title={<Alert.Title>This is a default alert title</Alert.Title>} />);

const defaultDescriptionAlert = createExample('default with description', () => <Alert>This is a default alert description</Alert>);

const defaultTitleDescriptionAlert = createExample('default with title and description', () => (
  <Alert title={<Alert.Title>This is a default alert title</Alert.Title>}>This is a default alert description</Alert>
));

const warningAlert = createExample('warning', () => <Alert variant={Alert.Variant.WARNING}>This is a warning alert.</Alert>);

const dangerAlert = createExample('danger', () => <Alert variant={Alert.Variant.WARNING}>This is a danger alert.</Alert>);

export default createSection('Alert', 'src/components/Alert/index.tsx', [
  defaultAlert,
  defaultTitleAlert,
  defaultDescriptionAlert,
  defaultTitleDescriptionAlert,
  warningAlert,
  dangerAlert,
]);
