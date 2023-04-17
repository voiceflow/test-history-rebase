import React from 'react';

import { SlotManager, UtteranceManager } from './components';

const CustomIntentForm = ({ intent, pushToPath, isNested = false, isInModal, children }) => (
  <>
    <UtteranceManager intent={intent} isNested={isNested} isInModal={isInModal}>
      {children}
    </UtteranceManager>

    <SlotManager intent={intent} pushToPath={pushToPath} isNested={isNested} />
  </>
);

export default CustomIntentForm;
