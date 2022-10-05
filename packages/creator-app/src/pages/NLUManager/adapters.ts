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
    const conflictingSentence = conflictsData.utteranceMapper[problematicSentence.conflictingSentence];
    const sentence = conflictsData.utteranceMapper[problematicSentence.sentence];
    const problematicSentenceIntentID = intentsByName[problematicSentence.intentID]?.id;

    if (problematicSentence.intentID === currentIntent.name) return;
    if (!intentUtterances.has(sentence)) return;

    const addedUtterance = addedUtterancesByConflict.find((u) => u.utterance === sentence);

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
                initialSentence: conflictingSentence,
                intentID: problematicSentenceIntentID,
                sentence: conflictingSentence,
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
          { conflictID: addedUtterance.conflictID, intentID: currentIntentID, utterance: sentence },
          { conflictID: addedUtterance.conflictID, intentID: problematicSentenceIntentID, utterance: conflictingSentence },
        ],
        (u) => u.utterance
      );

      return;
    }

    const overlapUtterance = addedUtterancesByConflict.find((u) => {
      return u.utterance === conflictingSentence || u.utterance === sentence;
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
                sentence,
                intentID: currentIntentID,
                initialIntentID: currentIntentID,
                initialSentence: sentence,
                deleted: false,
              },
            ],
            (u) => u.sentence
          ),
          [problematicSentenceIntentID]: uniqBy(
            [
              ...(newConflicts[overlapUtterance.conflictID].utterances[problematicSentenceIntentID] || []),
              {
                sentence: conflictingSentence,
                intentID: problematicSentenceIntentID,
                initialIntentID: problematicSentenceIntentID,
                initialSentence: conflictingSentence,
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
          { conflictID: overlapUtterance.conflictID, intentID: currentIntentID, utterance: sentence },
          { conflictID: overlapUtterance.conflictID, intentID: problematicSentenceIntentID, utterance: conflictingSentence },
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
            sentence,
            intentID: currentIntentID,
            initialIntentID: currentIntentID,
            initialSentence: sentence,
            deleted: false,
          },
        ],
        [problematicSentenceIntentID]: [
          {
            sentence: conflictingSentence,
            intentID: problematicSentenceIntentID,
            initialIntentID: problematicSentenceIntentID,
            initialSentence: conflictingSentence,
            deleted: false,
          },
        ],
      },
    };

    addedUtterancesByConflict = [
      ...addedUtterancesByConflict,
      { conflictID: newConflictID, intentID: currentIntentID, utterance: sentence },
      { conflictID: newConflictID, intentID: problematicSentenceIntentID, utterance: conflictingSentence },
    ];
  });

  return newConflicts;
};
