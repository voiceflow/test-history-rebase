import React from 'react';

import { SlotManager, UtteranceManager } from './components';

const CustomIntentForm = ({ intent, pushToPath, isNested = false }) => (
  <>
    <UtteranceManager intent={intent} isNested={isNested} />
    <SlotManager intent={intent} pushToPath={pushToPath} isNested={isNested} />
  </>
);

export default CustomIntentForm;
