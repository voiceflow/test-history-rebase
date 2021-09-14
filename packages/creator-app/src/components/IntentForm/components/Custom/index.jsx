import React from 'react';

import { SlotManager, UtteranceManager } from './components';

const CustomIntentForm = ({ intent, pushToPath, isNested = false, isInModal }) => (
  <>
    <UtteranceManager intent={intent} isNested={isNested} isInModal={isInModal} />
    <SlotManager intent={intent} pushToPath={pushToPath} isNested={isNested} />
  </>
);

export default CustomIntentForm;
