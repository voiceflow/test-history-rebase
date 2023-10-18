import * as Realtime from '@voiceflow/realtime-sdk';
import { EntityVariant } from '@voiceflow/sdk-logux-designer';
import React from 'react';

export const useAreEntityInputsEmpty = (inputs: Array<Realtime.SlotInput | EntityVariant>) =>
  React.useMemo(
    () =>
      inputs.every(
        ({ value, synonyms }) => !value.trim() && !(Array.isArray(synonyms) ? synonyms : synonyms.split(',')).filter((s) => s.trim()).length
      ),
    [inputs]
  );
