import React from 'react';

import { SlotManager, UtteranceManager } from './components';

function CustomIntentForm({ intent, pushToPath, isNested = false }) {
  return (
    <>
      <UtteranceManager intent={intent} isNested={isNested} />
      <SlotManager intent={intent} pushToPath={pushToPath} isNested={isNested} />
    </>
  );
}

export default CustomIntentForm;
