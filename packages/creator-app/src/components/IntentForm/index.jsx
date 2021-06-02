import React from 'react';

import { UtteranceManager } from '@/components/IntentForm/components/Custom/components';
import { isCustomizeableBuiltInIntent } from '@/utils/intent';

import CustomIntentForm from './components/Custom';

export { HelpTooltip } from './components/Custom/components';
export { default as LegacyMappings } from './components/LegacyMappings';

const IntentForm = ({ intent, ...props }) => {
  if (!intent?.id) {
    return null;
  }

  if (isCustomizeableBuiltInIntent(intent)) {
    return <UtteranceManager intent={intent} isNested={!!props.isNested} />;
  }

  return <CustomIntentForm intent={intent} {...props} />;
};

export default IntentForm;
