import * as ML from '@voiceflow/ml-sdk';
import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import client from '@/client';
import { transformIntents, transformSlots } from '@/client/adapters/nluManager';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useMLGatewayClient, useSelector } from '@/hooks';
import { waitAsyncAction } from '@/utils/logux';

import { ClarityModel } from '../types';
import { mapClarityModelData, mapIntentsToNLUIntents, transformIntentName } from '../utils';

const useClarity = (intents: Platform.Base.Models.Intent.Model[]) => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const mlClient = useMLGatewayClient();
  const [clarity, setClarity] = React.useState<ClarityModel | null>(null);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const allIntents = useSelector(IntentV2.allIntentsSelector);

  const utterancesByIntentIdAndNameMapper = React.useMemo(() => {
    return allIntents.reduce<Record<string, string[]>>((acc, intent) => {
      const utterances = intent.inputs.map(({ text }) => text);
      return { ...acc, [intent.id]: utterances, [transformIntentName(intent.name)]: utterances };
    }, {});
  }, [allIntents]);

  const fetchClarity = async (updatedModel?: Record<string, Partial<Platform.Base.Models.Intent.Model>>) => {
    if (!activeVersionID) return;

    setIsFetching(true);

    try {
      const { model } = await client.nluManager.render(activeVersionID);
      let { intents } = model;

      if (updatedModel) {
        intents = model.intents.map((intent) => ({ ...intent, inputs: updatedModel?.[intent.key]?.inputs || intent.inputs }));
      }

      const data = await waitAsyncAction(mlClient, ML.intent.clarityModel, {
        intents: transformIntents(intents),
        platform,
        slots: transformSlots(model.slots),
        topConflicting: 2,
      });

      const clarityModelData = data ? mapClarityModelData(data, utterancesByIntentIdAndNameMapper) : null;

      setClarity(clarityModelData);

      return clarityModelData;
    } finally {
      setIsFetching(false);
    }
  };

  const nluIntents = React.useMemo(() => mapIntentsToNLUIntents(intents, clarity), [intents, clarity]);

  return { fetchClarity, clarity, nluIntents, isFetching };
};

export default useClarity;
