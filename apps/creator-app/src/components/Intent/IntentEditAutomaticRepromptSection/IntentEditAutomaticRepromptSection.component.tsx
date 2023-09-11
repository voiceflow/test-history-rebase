import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { IntentAutomaticRepromptSection } from '../IntentAutomaticRepromptSection/IntentAutomaticRepromptSection.component';
import type { IIntentEditAutomaticRepromptSection } from './IntentEditAutomaticRepromptSection.interface';

export const IntentEditAutomaticRepromptSection: React.FC<IIntentEditAutomaticRepromptSection> = ({ intentID }) => {
  const automaticReprompt = useSelector(Designer.Intent.selectors.automaticRepromptByID, { id: intentID });

  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intentID);

  return <IntentAutomaticRepromptSection value={automaticReprompt ?? false} onValueChange={(value) => patchIntent({ automaticReprompt: value })} />;
};
