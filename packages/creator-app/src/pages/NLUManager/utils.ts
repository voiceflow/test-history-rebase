import * as Realtime from '@voiceflow/realtime-sdk';

import { getIntentClarityStrengthLevel, getIntentConfidenceStrengthLevel, isBuiltInIntent } from '@/utils/intent';

import { ClarityModel, NLUIntent, ProblematicSentence } from './types';

export const getConfidenceScore = (intent: Realtime.Intent) => {
  if (isBuiltInIntent(intent.id)) return 100;
  return intent.inputs.length || 0;
};

export const getConflictingIntentIDs = (intent: Realtime.Intent, clarity: ClarityModel | null): string[] => {
  const conflicts = clarity?.problematicSentences?.[intent.name];
  if (!conflicts || isBuiltInIntent(intent.id)) return [];

  return conflicts.reduce((acc, conflict) => {
    return Array.from(new Set([...acc, conflict.intentID]));
  }, [] as string[]);
};

export const getConflictingUtterances = (intent: Realtime.Intent, utterances: string[], clarity: ClarityModel | null): string[] => {
  if (isBuiltInIntent(intent.id)) return [];
  const conflicts = clarity?.problematicSentences?.[intent.name];
  if (!conflicts) return [];
  return Array.from(
    new Set(conflicts.filter((conflict) => utterances.includes(clarity.utteranceMapper[conflict.sentence])).map((conflict) => conflict.sentence))
  );
};

export const getClarityScore = (intent: Realtime.Intent, clarity: ClarityModel | null, hasConflicts?: boolean) => {
  if (isBuiltInIntent(intent.id)) return 1;
  const clarityByClass = clarity?.clarityByClass?.[intent.name] || 0;
  if (!hasConflicts) return 1;
  return clarityByClass;
};

export const mapIntentsToNLUIntents = (intents: Realtime.Intent[], clarity: ClarityModel | null) => {
  const intentUtterances = intents.reduce((acc, intent) => {
    return { ...acc, [intent.id]: intent.inputs.map((input) => input.text) };
  }, {} as Record<string, string[]>);

  return intents.map((intent): NLUIntent => {
    const conflictingIntentIDs = getConflictingIntentIDs(intent, clarity);
    const conflictingUtterances = getConflictingUtterances(intent, intentUtterances[intent.id], clarity);
    const hasConflicts = conflictingIntentIDs.length > 0 && conflictingUtterances.length > 0;
    const clarityScore = getClarityScore(intent, clarity, hasConflicts);
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
};

export const mapClarityModelData = (clarity: ClarityModel): ClarityModel => {
  return {
    ...clarity,
    problematicSentences: Object.keys(clarity.problematicSentences).reduce((conflicts, conflictIntentName) => {
      if (isBuiltInIntent(conflictIntentName)) return conflicts;

      const intentConflicts = clarity.problematicSentences[conflictIntentName] as ProblematicSentence[];

      return { ...conflicts, [conflictIntentName]: intentConflicts.filter((conflict) => !isBuiltInIntent(conflict.intentID)) };
    }, {}),
  };
};
