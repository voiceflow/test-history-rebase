import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { usePersistFunction } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';
import { ClarityModel, Conflict, DeletedUtterancePayload, EditUtterancePayload, MoveUtterancePayload } from '@/pages/NLUManager/types';
import { transformIntentName } from '@/pages/NLUManager/utils';

import { conflictModelToFormAdapter } from '../adapters';

const useIntentConflictsForm = (intentID: string | null, conflictsData: ClarityModel | null) => {
  const allIntentsByName = useSelector(IntentV2.intentMapByNameSelector);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);

  const [conflicts, updateConflicts] = React.useState<Normal.Normalized<Conflict>>(() => Normal.createEmpty());

  const allUtterances = React.useMemo(
    () =>
      Normal.denormalize(conflicts).flatMap(
        (conflict) =>
          Normal.denormalize(conflict.utterances)
            .reverse()
            .flatMap((utterances) => Normal.denormalize(utterances)),
        {}
      ),
    [conflicts]
  );

  const intentsByName = React.useMemo(() => {
    return Object.entries(allIntentsByName).reduce<Record<string, Platform.Base.Models.Intent.Model>>(
      (mapper, [key, value]) => ({ ...mapper, [transformIntentName(key)]: value }),
      {}
    );
  }, [allIntentsByName]);

  const modifiedUtterances = React.useMemo(
    () =>
      allUtterances.filter(
        (utterance) => utterance.deleted || utterance.initialIntentID !== utterance.intentID || utterance.initialSentence !== utterance.sentence
      ),
    [allUtterances]
  );

  const onEditUtterance = usePersistFunction(({ intentID, sentence, conflictID, utteranceID }: EditUtterancePayload) => {
    const conflict = Normal.getOne(conflicts, conflictID);

    if (!conflict) return;

    const intentUtterances = Normal.getOne(conflict.utterances, intentID);

    if (!intentUtterances) return;

    updateConflicts(
      Normal.patchOne(conflicts, conflictID, {
        utterances: Normal.patchOne(conflict.utterances, intentID, Normal.patchOne(intentUtterances, utteranceID, { sentence })),
      })
    );
  });

  const onMoveUtterance = usePersistFunction(({ to, from, conflictID }: MoveUtterancePayload) => {
    const conflict = Normal.getOne(conflicts, conflictID);

    if (!conflict) return;

    const toIntentUtterances = Normal.getOne(conflict.utterances, to.intentID);
    const fromIntentUtterances = Normal.getOne(conflict.utterances, from.intentID);

    if (!toIntentUtterances || !fromIntentUtterances) return;

    const fromIntentUtteranceIndex = fromIntentUtterances.allKeys.indexOf(from.utteranceID);

    if (from.intentID === to.intentID && to.index === fromIntentUtteranceIndex) return;

    const isReorder = from.intentID === to.intentID;

    if (isReorder) {
      updateConflicts(
        Normal.patchOne(conflicts, conflictID, {
          utterances: Normal.patchOne(
            conflict.utterances,
            to.intentID,
            Normal.reorder(toIntentUtterances, Utils.array.reorder(toIntentUtterances.allKeys, fromIntentUtteranceIndex, to.index))
          ),
        })
      );

      return;
    }

    const fromIntentUtterance = Normal.getOne(fromIntentUtterances, from.utteranceID);

    if (!fromIntentUtterance) return;

    const utterancesWithoutValue = Normal.patchOne(conflict.utterances, from.intentID, Normal.removeOne(fromIntentUtterances, from.utteranceID));

    updateConflicts(
      Normal.patchOne(conflicts, conflictID, {
        utterances: Normal.patchOne(
          utterancesWithoutValue,
          to.intentID,
          Normal.appendOne(toIntentUtterances, fromIntentUtterance.id, fromIntentUtterance)
        ),
      })
    );
  });

  const onDeleteUtterance = usePersistFunction(({ intentID, conflictID, utteranceID }: DeletedUtterancePayload) => {
    const conflict = Normal.getOne(conflicts, conflictID);

    if (!conflict) return;

    const intentUtterances = Normal.getOne(conflict.utterances, intentID);

    if (!intentUtterances) return;

    updateConflicts(
      Normal.patchOne(conflicts, conflictID, {
        utterances: Normal.patchOne(conflict.utterances, intentID, Normal.patchOne(intentUtterances, utteranceID, { deleted: true })),
      })
    );
  });

  const calculateConflicts = usePersistFunction((data?: ClarityModel | null) => {
    const activeIntent = getIntentByID({ id: intentID });
    const clarityModel = data || conflictsData;

    if (!clarityModel || !activeIntent) return null;

    const currentIntent = intentsByName[activeIntent.name];
    const newConflicts = conflictModelToFormAdapter(clarityModel, currentIntent, intentsByName);

    updateConflicts(newConflicts);

    return newConflicts;
  });

  const conflictsArr = React.useMemo(() => Normal.denormalize(conflicts), [conflicts]);

  return {
    conflicts: conflictsArr,
    onMoveUtterance,
    onEditUtterance,
    onDeleteUtterance,
    shouldApplyChanges: modifiedUtterances.length > 0,
    modifiedUtterances,
    calculateConflicts,
  };
};

export default useIntentConflictsForm;
