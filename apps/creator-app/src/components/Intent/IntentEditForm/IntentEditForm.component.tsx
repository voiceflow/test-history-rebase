import { Divider } from '@voiceflow/ui-next';
import React from 'react';

import { IntentEditRequiredEntitiesSection } from '../IntentEditRequiredEntitiesSection/IntentEditRequiredEntitiesSection.component';
import { IntentEditUtterancesSection } from '../IntentEditUtterancesSection/IntentEditUtterancesSection.component';
import type { IIntentEditForm } from './IntentEditForm.interface';

export const IntentEditForm: React.FC<IIntentEditForm> = ({ intent, newUtterances, utterancesError, resetUtterancesError }) => (
  <>
    <IntentEditUtterancesSection
      intent={intent}
      newUtterances={newUtterances}
      utterancesError={utterancesError}
      resetUtterancesError={resetUtterancesError}
    />

    <Divider noPadding />

    <IntentEditRequiredEntitiesSection intent={intent} />
  </>
);
