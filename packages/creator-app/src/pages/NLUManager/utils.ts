import * as Realtime from '@voiceflow/realtime-sdk';
import { StrengthGauge } from '@voiceflow/ui';
import * as Normal from 'normal-store';

import { getIntentClarityStrengthLevel, getIntentConfidenceStrengthLevel, isBuiltInIntent } from '@/utils/intent';
import { hasValidPrompt } from '@/utils/prompt';

import { ClarityModel, NLUIntent, ProblematicSentence } from './types';

export const getUnclassifiedDataMaxRange = (page: number, utterances: Realtime.NLUUnclassifiedUtterances[]) =>
  page * 100 + 100 > utterances.length ? utterances.length : page * 100 + 100;
export const getUnclassifiedDataMinRange = (page: number) => page * 100;

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

export const hasSlotsError = (intent: Realtime.Intent) => {
  return Normal.denormalize<Realtime.IntentSlot>(intent.slots).some(
    (intentSlot) => !!intentSlot?.required && !hasValidPrompt(intentSlot.dialog.prompt)
  );
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
    const hasEntityError = Normal.denormalize<Realtime.IntentSlot>(intent.slots).some(
      (intentSlot) => !!intentSlot?.required && !hasValidPrompt(intentSlot.dialog.prompt)
    );
    const clarityLevel = getIntentClarityStrengthLevel(clarityScore);
    const confidenceLevel = getIntentConfidenceStrengthLevel(confidence);

    return {
      ...intent,
      clarity: clarityScore,
      clarityLevel,
      confidence,
      confidenceLevel,
      conflictingIntentIDs,
      conflictingUtterances,
      hasConflicts,
      hasErrors: hasEntityError || confidenceLevel === StrengthGauge.Level.WEAK || clarityLevel === StrengthGauge.Level.WEAK,
      hasEntityError,
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
