import * as Realtime from '@voiceflow/realtime-sdk';
import uniqBy from 'lodash/uniqBy';

import { ClarityModel, Conflict } from '@/pages/NLUManager/types';

export const conflictModelToFormAdapter = (
  conflictsData: ClarityModel,
  currentIntent: Realtime.Intent,
  intentsByName: Record<string, Realtime.Intent>
): Record<string, Conflict> => {
  const newConflicts: Record<string, Conflict> = {};
  let addedUtterancesByConflict: { utterance: string; conflictID: string; intentID: string }[] = [];

  const currentIntentID = currentIntent.id;
  const problematicSentences = conflictsData.problematicSentences[currentIntent.name];
  const intentUtterances = new Set(currentIntent.inputs.map((input) => input.text));

  if (!problematicSentences) return {};

  problematicSentences.forEach((problematicSentence) => {
    const problematicSentenceIntentID = intentsByName[problematicSentence.intentID]?.id;
    if (problematicSentence.intentID === currentIntent.name) return;
    if (!intentUtterances.has(problematicSentence.sentence)) return;

    const addedUtterance = addedUtterancesByConflict.find((u) => u.utterance === problematicSentence.sentence);

    if (addedUtterance) {
      newConflicts[addedUtterance.conflictID] = {
        ...newConflicts[addedUtterance.conflictID],
        utterances: {
          ...newConflicts[addedUtterance.conflictID].utterances,
          [problematicSentenceIntentID]: uniqBy(
            [
              ...(newConflicts[addedUtterance.conflictID].utterances[problematicSentenceIntentID] || []),
              {
                initialIntentID: problematicSentenceIntentID,
                initialSentence: problematicSentence.conflictingSentence,
                intentID: problematicSentenceIntentID,
                sentence: problematicSentence.conflictingSentence,
                deleted: false,
              },
            ],
            (u) => u.sentence
          ),
        },
      };

      addedUtterancesByConflict = uniqBy(
        [
          ...addedUtterancesByConflict,
          { conflictID: addedUtterance.conflictID, intentID: currentIntentID, utterance: problematicSentence.sentence },
          { conflictID: addedUtterance.conflictID, intentID: problematicSentenceIntentID, utterance: problematicSentence.conflictingSentence },
        ],
        (u) => u.utterance
      );

      return;
    }

    const overlapUtterance = addedUtterancesByConflict.find((u) => {
      return u.utterance === problematicSentence.conflictingSentence || u.utterance === problematicSentence.sentence;
    });

    if (overlapUtterance) {
      newConflicts[overlapUtterance.conflictID] = {
        id: overlapUtterance.conflictID,
        intentID: currentIntentID,
        utterances: {
          [currentIntentID]: uniqBy(
            [
              ...(newConflicts[overlapUtterance.conflictID].utterances[currentIntentID] || []),
              {
                sentence: problematicSentence.sentence,
                intentID: currentIntentID,
                initialIntentID: currentIntentID,
                initialSentence: problematicSentence.sentence,
                deleted: false,
              },
            ],
            (u) => u.sentence
          ),
          [problematicSentenceIntentID]: uniqBy(
            [
              ...(newConflicts[overlapUtterance.conflictID].utterances[problematicSentenceIntentID] || []),
              {
                sentence: problematicSentence.conflictingSentence,
                intentID: problematicSentenceIntentID,
                initialIntentID: problematicSentenceIntentID,
                initialSentence: problematicSentence.conflictingSentence,
                deleted: false,
              },
            ],
            (u) => u.sentence
          ),
        },
      };

      addedUtterancesByConflict = uniqBy(
        [
          ...addedUtterancesByConflict,
          { conflictID: overlapUtterance.conflictID, intentID: currentIntentID, utterance: problematicSentence.sentence },
          { conflictID: overlapUtterance.conflictID, intentID: problematicSentenceIntentID, utterance: problematicSentence.conflictingSentence },
        ],
        (u) => u.utterance
      );

      return;
    }

    const newConflictID = (Object.keys(newConflicts).length + 1).toString();

    newConflicts[newConflictID] = {
      id: newConflictID,
      intentID: currentIntentID,
      utterances: {
        [currentIntentID]: [
          {
            sentence: problematicSentence.sentence,
            intentID: currentIntentID,
            initialIntentID: currentIntentID,
            initialSentence: problematicSentence.sentence,
            deleted: false,
          },
        ],
        [problematicSentenceIntentID]: [
          {
            sentence: problematicSentence.conflictingSentence,
            intentID: problematicSentenceIntentID,
            initialIntentID: problematicSentenceIntentID,
            initialSentence: problematicSentence.conflictingSentence,
            deleted: false,
          },
        ],
      },
    };

    addedUtterancesByConflict = [
      ...addedUtterancesByConflict,
      { conflictID: newConflictID, intentID: currentIntentID, utterance: problematicSentence.sentence },
      { conflictID: newConflictID, intentID: problematicSentenceIntentID, utterance: problematicSentence.conflictingSentence },
    ];
  });

  return newConflicts;
};
