import { Utils } from '@voiceflow/common';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';
import {
  ClarityModel,
  Conflict,
  ConflictUtterance,
  DeletedUtterancePayload,
  EditUtterancePayload,
  MoveUtterancePayload,
} from '@/pages/NLUManager/types';

import { conflictModelToFormAdapter } from '../adapters';

const useIntentConflictsForm = (intentID: string | null, conflictsData: ClarityModel | null) => {
  const intentsByName = useSelector(IntentV2.intentMapByNameSelector);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);
  const [conflicts, updateConflicts] = React.useState<Record<string, Conflict>>({});

  const allConflictUtterancesConflictMap = React.useMemo<Record<string, ConflictUtterance[]>>(() => {
    return Object.values(conflicts).reduce((mapper, conflict) => {
      const utterances = Object.values(conflict.utterances).reduce((ut, u) => [...u, ...ut], []);
      return { ...mapper, [conflict.id]: utterances };
    }, {});
  }, [conflicts]);

  const allUtterancesMap = React.useMemo<ConflictUtterance[]>(() => {
    return Object.values(allConflictUtterancesConflictMap).reduce((mapper, utterancesByIntentID) => {
      return [...mapper, ...Object.values(utterancesByIntentID)];
    }, []);
  }, [allConflictUtterancesConflictMap]);

  const modifiedUtterances = React.useMemo(() => {
    return allUtterancesMap.filter((utterance) => {
      return utterance.deleted || utterance.initialIntentID !== utterance.intentID || utterance.initialSentence !== utterance.sentence;
    });
  }, [allUtterancesMap]);

  const findUtteranceIndex = (utterance: string, utterances: ConflictUtterance[]) => {
    return utterances.findIndex((u) => u.sentence === utterance);
  };

  const updateConflictUtterances = (conflictID: string, utterances: Record<string, ConflictUtterance[]>) => {
    const conflict = conflicts[conflictID];

    updateConflicts({
      ...conflicts,
      [conflictID]: {
        ...conflict,
        utterances: {
          ...conflict.utterances,
          ...utterances,
        },
      },
    });
  };

  const onEditUtterance = ({ conflictID, intentID, utterance, newUtteranceSentence }: EditUtterancePayload) => {
    const conflict = conflicts[conflictID];
    const intentUtterances = conflict.utterances[intentID];

    updateConflictUtterances(conflictID, {
      [intentID]: intentUtterances.map((intentUtterance) => {
        if (intentUtterance.sentence === utterance) {
          return { ...intentUtterance, sentence: newUtteranceSentence };
        }

        return intentUtterance;
      }),
    });
  };

  const onMoveUtterance = ({ conflictID, to, from, utterance }: MoveUtterancePayload) => {
    const conflict = conflicts[conflictID];
    const canDrop = allConflictUtterancesConflictMap[conflictID].find((u) => u.sentence === utterance);
    if (!canDrop) return;

    const intentUtterances = conflict.utterances[from.intentID];
    const fromIntentUtteranceIndex = intentUtterances.findIndex((u) => u.sentence === utterance);
    if (from.intentID === to.intentID && to.index === fromIntentUtteranceIndex) return;

    const isReorder = from.intentID === to.intentID;

    if (isReorder) {
      updateConflictUtterances(conflictID, {
        [from.intentID]: Utils.array.reorder(intentUtterances, findUtteranceIndex(from.utterance, intentUtterances), to.index),
      });
      return;
    }

    const fromIntentUtterance = intentUtterances.find((u) => u.sentence === utterance);
    if (!fromIntentUtterance) return;

    updateConflictUtterances(conflictID, {
      [to.intentID]: Utils.array.insert<ConflictUtterance>(conflict.utterances[to.intentID], to.index, {
        ...fromIntentUtterance,
        intentID: to.intentID,
      }),
      [from.intentID]: Utils.array.withoutValue<ConflictUtterance>(conflict.utterances[from.intentID], fromIntentUtterance),
    });
  };

  const onDeleteUtterance = ({ conflictID, utterance }: DeletedUtterancePayload) => {
    const intentUtterances = conflicts[conflictID].utterances[utterance.intentID];

    updateConflictUtterances(conflictID, {
      [utterance.intentID]: intentUtterances.map((intentUtterance) => {
        if (intentUtterance.sentence === utterance.sentence) {
          return { ...intentUtterance, deleted: true };
        }

        return intentUtterance;
      }),
    });
  };

  const calculateConflicts = (data?: ClarityModel | null) => {
    const activeIntent = getIntentByID({ id: intentID });
    const clarityModel = data || conflictsData;

    if (!clarityModel || !activeIntent) return null;

    const currentIntent = intentsByName[activeIntent.name];
    const newConflicts = conflictModelToFormAdapter(clarityModel, currentIntent, intentsByName);

    updateConflicts(newConflicts);

    return newConflicts;
  };

  return {
    conflicts: Object.values(conflicts),
    onMoveUtterance,
    onEditUtterance,
    onDeleteUtterance,
    updateConflicts,
    shouldApplyChanges: modifiedUtterances.length > 0,
    modifiedUtterances,
    calculateConflicts,
  };
};

export default useIntentConflictsForm;
