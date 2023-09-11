import React from 'react';

import { IntentEditRequiredEntitiesSection } from '../IntentEditRequiredEntitiesSection/IntentEditRequiredEntitiesSection.component';
import { IntentEditUtterancesSection } from '../IntentEditUtterancesSection/IntentEditUtterancesSection.component';
import type { IIntentEditForm } from './IntentEditForm.interface';

export const IntentEditForm: React.FC<IIntentEditForm> = ({ intentID }) => (
  <>
    <IntentEditUtterancesSection intentID={intentID} />
    <IntentEditRequiredEntitiesSection intentID={intentID} />
  </>
);
