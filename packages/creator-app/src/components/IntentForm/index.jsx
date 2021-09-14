import React from 'react';

import { UtteranceManager } from '@/components/IntentForm/components/Custom/components';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import CustomIntentForm from './components/Custom';

export { HelpTooltip } from './components/Custom/components';
export { default as LegacyMappings } from './components/LegacyMappings';

const IntentForm = ({ intent, isInModal = false, ...props }) => {
  if (!intent?.id) {
    return null;
  }

  if (isCustomizableBuiltInIntent(intent)) {
    return <UtteranceManager intent={intent} isInModal={isInModal} isNested={!!props.isNested} />;
  }

  return <CustomIntentForm intent={intent} isInModal={isInModal} {...props} />;
};

export default IntentForm;
