import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import uniqBy from 'lodash/uniqBy';
import * as Normal from 'normal-store';

import { ClarityModel, Conflict, ConflictUtterance } from '@/pages/NLUManager/types';
import { transformIntentName } from '@/pages/NLUManager/utils';

interface AddedUtteranceByConflict {
  intentID: string;
  utterance: string;
  conflictID: string;
}

export const conflictModelToFormAdapter = (
  conflictsData: ClarityModel,
  currentIntent: Platform.Base.Models.Intent.Model,
  intentsByName: Partial<Record<string, Platform.Base.Models.Intent.Model>>
): Normal.Normalized<Conflict> => {
  let newConflicts: Normal.Normalized<Conflict> = Normal.createEmpty();

  let addedUtterancesByConflict: AddedUtteranceByConflict[] = [];

  const currentIntentID = currentIntent.id;
  const intentUtterances = new Set(currentIntent.inputs.map((input) => input.text));
  const problematicSentences = conflictsData.problematicSentences[currentIntent.name];

  const pushToAddedUtterancesByConflict = (...args: AddedUtteranceByConflict[]) => {
    addedUtterancesByConflict = uniqBy([...addedUtterancesByConflict, ...args], (u) => u.utterance);
  };

  if (!problematicSentences.length) return newConflicts;

  problematicSentences.forEach((problematicSentence) => {
    const sentence = conflictsData.utteranceMapper[problematicSentence.sentence];
    const conflictingSentence = conflictsData.utteranceMapper[problematicSentence.conflictingSentence];
    const problematicSentenceIntent = intentsByName[transformIntentName(problematicSentence.intentID)];

    if (!intentUtterances.has(sentence) || !problematicSentenceIntent || problematicSentence.intentID === currentIntent.name) return;

    const addedUtterance = addedUtterancesByConflict.find((u) => u.utterance === sentence);

    if (addedUtterance) {
      const conflict = Normal.get(newConflicts, addedUtterance.conflictID) ?? {
        id: addedUtterance.conflictID,
        intentID: currentIntentID,
        utterances: Normal.createEmpty(),
      };

      const problematicIntentUtterances = Normal.getOne(conflict.utterances, problematicSentenceIntent.id) ?? Normal.createEmpty();

      if (!Object.values(problematicIntentUtterances.byKey).some(({ sentence }) => sentence === conflictingSentence)) {
        const utteranceID = Utils.id.cuid.slug();

        newConflicts = Normal.patchOne(newConflicts, addedUtterance.conflictID, {
          utterances: Normal.patchOne(
            conflict.utterances,
            problematicSentenceIntent.id,
            Normal.appendOne(problematicIntentUtterances, utteranceID, {
              id: utteranceID,
              deleted: false,
              intentID: problematicSentenceIntent.id,
              sentence: conflictingSentence,
              initialIntentID: problematicSentenceIntent.id,
              initialSentence: conflictingSentence,
            })
          ),
        });
      }

      pushToAddedUtterancesByConflict(
        { conflictID: addedUtterance.conflictID, intentID: currentIntentID, utterance: sentence },
        { conflictID: addedUtterance.conflictID, intentID: problematicSentenceIntent.id, utterance: conflictingSentence }
      );

      return;
    }

    const overlapUtterance = addedUtterancesByConflict.find((u) => u.utterance === conflictingSentence || u.utterance === sentence);

    if (overlapUtterance) {
      const conflict = Normal.get(newConflicts, overlapUtterance.conflictID) ?? {
        id: overlapUtterance.conflictID,
        intentID: currentIntentID,
        utterances: Normal.createEmpty(),
      };

      const currentIntentUtterances = Normal.getOne(conflict.utterances, currentIntentID) ?? Normal.createEmpty();
      const problematicIntentUtterances = Normal.getOne(conflict.utterances, problematicSentenceIntent.id) ?? Normal.createEmpty();

      if (!Object.values(currentIntentUtterances.byKey).some(({ sentence }) => sentence === conflictingSentence)) {
        const utteranceID = Utils.id.cuid.slug();

        newConflicts = Normal.patchOne(newConflicts, overlapUtterance.conflictID, {
          utterances: Normal.patchOne(
            conflict.utterances,
            currentIntentID,
            Normal.appendOne(currentIntentUtterances, utteranceID, {
              id: utteranceID,
              deleted: false,
              sentence,
              intentID: currentIntentID,
              initialSentence: sentence,
              initialIntentID: currentIntentID,
            })
          ),
        });
      }

      if (!Object.values(problematicIntentUtterances.byKey).some(({ sentence }) => sentence === conflictingSentence)) {
        const utteranceID = Utils.id.cuid.slug();

        newConflicts = Normal.patchOne(newConflicts, overlapUtterance.conflictID, {
          utterances: Normal.patchOne(
            conflict.utterances,
            problematicSentenceIntent.id,
            Normal.appendOne(problematicIntentUtterances, utteranceID, {
              id: utteranceID,
              deleted: false,
              sentence: conflictingSentence,
              intentID: problematicSentenceIntent.id,
              initialIntentID: problematicSentenceIntent.id,
              initialSentence: conflictingSentence,
            })
          ),
        });
      }

      pushToAddedUtterancesByConflict(
        { conflictID: overlapUtterance.conflictID, intentID: currentIntentID, utterance: sentence },
        { conflictID: overlapUtterance.conflictID, intentID: problematicSentenceIntent.id, utterance: conflictingSentence }
      );

      return;
    }

    const newConflictID = Utils.id.cuid.slug();

    newConflicts = Normal.appendOne(newConflicts, newConflictID, {
      id: newConflictID,
      intentID: currentIntentID,
      utterances: {
        allKeys: [currentIntentID, problematicSentenceIntent.id],
        byKey: {
          [currentIntentID]: Normal.appendMany(Normal.createEmpty<ConflictUtterance>(), [
            {
              id: Utils.id.cuid.slug(),
              deleted: false,
              sentence,
              intentID: currentIntentID,
              initialIntentID: currentIntentID,
              initialSentence: sentence,
            },
          ]),
          [problematicSentenceIntent.id]: Normal.appendMany(Normal.createEmpty<ConflictUtterance>(), [
            {
              id: Utils.id.cuid.slug(),
              deleted: false,
              sentence: conflictingSentence,
              intentID: problematicSentenceIntent.id,
              initialIntentID: problematicSentenceIntent.id,
              initialSentence: conflictingSentence,
            },
          ]),
        },
      },
    });

    pushToAddedUtterancesByConflict(
      { conflictID: newConflictID, intentID: currentIntentID, utterance: sentence },
      { conflictID: newConflictID, intentID: problematicSentenceIntent.id, utterance: conflictingSentence }
    );
  });

  return newConflicts;
};
