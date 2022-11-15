import * as ML from '@voiceflow/ml-sdk';
import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import client from '@/client';
import { transformIntents, transformSlots } from '@/client/adapters/nluManager';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useMLGatewayClient, useSelector } from '@/hooks';
import { waitAsyncAction } from '@/utils/logux';

import { ClarityModel } from '../types';
import { mapClarityModelData, mapIntentsToNLUIntents } from '../utils';

const useClarity = (intents: Platform.Base.Models.Intent.Model[]) => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const mlClient = useMLGatewayClient();
  const [clarity, setClarity] = React.useState<ClarityModel | null>(null);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const platform = useSelector(ProjectV2.active.platformSelector);

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

      const clarityModelData = data ? mapClarityModelData(data) : null;

      setClarity(clarityModelData);

      return clarityModelData;
    } catch (e) {
      throw new Error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const nluIntents = React.useMemo(() => mapIntentsToNLUIntents(intents, clarity), [intents, clarity]);

  return { fetchClarity, clarity, nluIntents, isFetching };
};

export default useClarity;
