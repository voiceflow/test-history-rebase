import * as ML from '@voiceflow/ml-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import client from '@/client';
import { transformIntents, transformSlots } from '@/client/adapters/nluManager';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useMLGatewayClient, useSelector } from '@/hooks';
import { getIntentClarityStrengthLevel, getIntentConfidenceStrengthLevel, isBuiltInIntent } from '@/utils/intent';
import { waitAsyncAction } from '@/utils/logux';

import { ClarityModel, NLUIntent } from '../types';

const useClarity = (intents: Realtime.Intent[]) => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const mlClient = useMLGatewayClient();
  const [clarity, setClarity] = React.useState<ClarityModel | null>(null);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const fetchClarity = async (updatedModel?: Record<string, Partial<Realtime.Intent>>) => {
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

      setClarity(data || null);

      return data;
    } catch (e) {
      throw new Error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const getConflictingIntentIDs = (intent: Realtime.Intent): string[] => {
    const conflicts = clarity?.problematicSentences?.[intent.name];
    if (!conflicts) return [];

    return conflicts.reduce((acc, conflict) => {
      return Array.from(new Set([...acc, conflict.intentID]));
    }, [] as string[]);
  };

  const getConflictingUtterances = (intent: Realtime.Intent, utterances: string[]): string[] => {
    const conflicts = clarity?.problematicSentences?.[intent.name];
    if (!conflicts) return [];
    return Array.from(new Set(conflicts.filter((conflict) => utterances.includes(conflict.sentence)).map((conflict) => conflict.sentence)));
  };

  const getClarityScore = (intent: Realtime.Intent, hasConflicts?: boolean) => {
    if (isBuiltInIntent(intent.id)) return 1;
    const clarityByClass = clarity?.clarityByClass?.[intent.name] || 0;
    if (!hasConflicts) return 1;
    return clarityByClass;
  };

  const getConfidenceScore = (intent: Realtime.Intent) => {
    if (isBuiltInIntent(intent.id)) return 100;
    return intent.inputs.length || 0;
  };

  const nluIntents = React.useMemo(() => {
    const intentUtterances = intents.reduce((acc, intent) => {
      return { ...acc, [intent.id]: intent.inputs.map((input) => input.text) };
    }, {} as Record<string, string[]>);

    return intents.map((intent): NLUIntent => {
      const conflictingIntentIDs = getConflictingIntentIDs(intent);
      const conflictingUtterances = getConflictingUtterances(intent, intentUtterances[intent.id]);
      const hasConflicts = conflictingIntentIDs.length > 0 && conflictingUtterances.length > 0;
      const clarityScore = getClarityScore(intent, hasConflicts);
      const confidence = getConfidenceScore(intent);

      return {
        ...intent,
        clarity: clarityScore,
        clarityLevel: getIntentClarityStrengthLevel(clarityScore),
        confidence,
        confidenceLevel: getIntentConfidenceStrengthLevel(confidence),
        conflictingIntentIDs,
        conflictingUtterances,
        hasConflicts,
      };
    });
  }, [intents, clarity]);

  return { fetchClarity, clarity, nluIntents, isFetching };
};

export default useClarity;
