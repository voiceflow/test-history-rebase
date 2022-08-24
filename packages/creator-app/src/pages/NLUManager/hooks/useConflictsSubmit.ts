import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';

import { ConflictUtterance } from '../types';

type NewIntents = Record<string, Partial<Realtime.Intent>>;

const useSolveIntentConflicts = (intentID: string | null) => {
  const patchIntent = useDispatch(Intent.patchIntent);
  const intentsMap = useSelector(IntentV2.platformIntentMapSelector);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [trackingEvents] = useTrackingEvents();

  const getSubmitData = (modifiedUtterances: ConflictUtterance[]): NewIntents => {
    return Object.entries(intentsMap).reduce((acc, [currentIntentID, currentIntent]) => {
      const allRelatedModifiedUtterances: ConflictUtterance[] = modifiedUtterances.filter(
        (u) => u.initialIntentID === currentIntentID || u.intentID === currentIntentID
      );

      const renamedUtterancesMap = allRelatedModifiedUtterances.reduce(
        (acc, { initialSentence, sentence }) => ({ ...acc, [initialSentence]: sentence }),
        {} as Record<string, string>
      );

      const deletedUtterances = new Set(
        allRelatedModifiedUtterances.filter((u) => u.initialIntentID === currentIntentID && u.deleted).map((u) => u.initialSentence)
      );

      const movedUtterances = new Set(
        allRelatedModifiedUtterances
          .filter((u) => u.initialIntentID === currentIntentID && u.intentID !== currentIntentID)
          .map((u) => u.initialSentence)
      );

      const addedUtterances = allRelatedModifiedUtterances
        .filter((u) => u.initialIntentID !== currentIntentID && u.intentID === currentIntentID)
        .map((u) => ({ text: u.sentence, slots: [] }));

      if (!allRelatedModifiedUtterances.length) return acc;

      const inputs = [
        ...currentIntent.inputs.filter((input) => !deletedUtterances.has(input.text) && !movedUtterances.has(input.text)),
        ...addedUtterances,
      ].map((input) => {
        if (renamedUtterancesMap[input.text]) {
          return { ...input, text: renamedUtterancesMap[input.text] };
        }

        return input;
      });

      return {
        ...acc,
        [currentIntentID]: {
          inputs,
        },
      };
    }, {} as NewIntents);
  };

  const submit = async (modifiedUtterances: ConflictUtterance[]) => {
    setIsLoading(true);

    const submitData = getSubmitData(modifiedUtterances);

    try {
      Object.entries(submitData).forEach(async ([intentID, intent]) => {
        await patchIntent(intentID, intent);
      });

      if (intentID) {
        trackingEvents.trackConflictViewChangesApplied({ intentID });
      }
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }

    return submitData;
  };

  return { submit, isLoading };
};

export default useSolveIntentConflicts;
