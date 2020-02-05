import React from 'react';

import CustomIntentForm from './components/Custom';

export { HelpTooltip } from './components/Custom/components';
export { default as LegacyMappings } from './components/LegacyMappings';

const IntentForm = ({ intent, ...props }) => {
  if (!intent?.id) {
    return null;
  }

  if (intent.builtIn) {
    // TODO: component to display built-in intent properties
    return null;
  }

  return <CustomIntentForm intent={intent} {...props} />;
};

export default IntentForm;
