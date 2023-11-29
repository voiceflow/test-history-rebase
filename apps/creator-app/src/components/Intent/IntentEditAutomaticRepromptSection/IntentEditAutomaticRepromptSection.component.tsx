import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { IntentAutomaticRepromptSection } from '../IntentAutomaticRepromptSection/IntentAutomaticRepromptSection.component';
import type { IIntentEditAutomaticRepromptSection } from './IntentEditAutomaticRepromptSection.interface';

export const IntentEditAutomaticRepromptSection: React.FC<IIntentEditAutomaticRepromptSection> = ({ intent }) => {
  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intent.id);

  return <IntentAutomaticRepromptSection value={intent.automaticReprompt} onValueChange={(value) => patchIntent({ automaticReprompt: value })} />;
};
