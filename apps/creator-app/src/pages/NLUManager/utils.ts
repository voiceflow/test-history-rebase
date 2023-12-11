import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { StrengthGauge } from '@voiceflow/ui';
import * as Normal from 'normal-store';

import { getIntentClarityStrengthLevel, getIntentConfidenceStrengthLevel, isPromptEmpty } from '@/utils/intent';
import { isIntentBuiltIn } from '@/utils/intent.util';

import { DATE_RANGE_INFO_MAP } from './pages/UnclassifiedData/constants';
import { DateRangeTypes, UnclassifiedViewFilters } from './pages/UnclassifiedData/types';
import { ClarityModel, NLUIntent, ProblematicSentence } from './types';

export const transformIntentName = (name: string): string => name.replace('""', '').replace(/\s/g, '');

export const getConfidenceScore = (intent: Platform.Base.Models.Intent.Model) => {
  if (isIntentBuiltIn(intent.id)) return 100;
  return intent.inputs.length || 0;
};

export const getConflictingIntentIDs = (intent: Platform.Base.Models.Intent.Model, clarity: ClarityModel | null): string[] => {
  const conflicts = clarity?.problematicSentences?.[intent.name];
  if (!conflicts || isIntentBuiltIn(intent.id)) return [];

  return conflicts.reduce((acc, conflict) => {
    return Array.from(new Set([...acc, conflict.intentID]));
  }, [] as string[]);
};

export const getConflictingUtterances = (intent: Platform.Base.Models.Intent.Model, utterances: string[], clarity: ClarityModel | null): string[] => {
  if (isIntentBuiltIn(intent.id)) return [];
  const conflicts = clarity?.problematicSentences?.[intent.name];
  if (!conflicts) return [];
  return Array.from(
    new Set(conflicts.filter((conflict) => utterances.includes(clarity.utteranceMapper[conflict.sentence])).map((conflict) => conflict.sentence))
  );
};

export const getClarityScore = (intent: Platform.Base.Models.Intent.Model, clarity: ClarityModel | null, hasConflicts?: boolean) => {
  if (clarity === null) return -1;
  if (isIntentBuiltIn(intent.id)) return 1;
  const clarityByClass = clarity?.clarityByClass?.[intent.name] || 0;
  if (!hasConflicts) return 1;
  return clarityByClass;
};

export const hasSlotsError = (intent: Platform.Base.Models.Intent.Model) =>
  Normal.denormalize(intent.slots).some((intentSlot) => !!intentSlot?.required && intentSlot.dialog.prompt.every(isPromptEmpty));

export const mapIntentsToNLUIntents = (intents: Platform.Base.Models.Intent.Model[], clarity: ClarityModel | null) => {
  const intentUtterances = intents.reduce((acc, intent) => {
    return { ...acc, [intent.id]: intent.inputs.map((input) => input.text) };
  }, {} as Record<string, string[]>);

  return intents
    .map((intent): NLUIntent => {
      const conflictingIntentIDs = getConflictingIntentIDs(intent, clarity);
      const conflictingUtterances = getConflictingUtterances(intent, intentUtterances[intent.id], clarity);
      const hasConflicts = conflictingIntentIDs.length > 0 && conflictingUtterances.length > 0;
      const clarityScore = getClarityScore(intent, clarity, hasConflicts);
      const confidence = getConfidenceScore(intent);
      const hasEntityError = hasSlotsError(intent);
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
        hasErrors:
          hasEntityError ||
          confidenceLevel === StrengthGauge.Level.WEAK ||
          clarityLevel === StrengthGauge.Level.WEAK ||
          confidenceLevel === StrengthGauge.Level.NOT_SET,
        hasEntityError,
      };
    })
    .filter((intent) => intent.name && intent.id);
};

export const mapClarityModelData = (clarity: ClarityModel, existentIntentsByIdAndName: Record<string, string[]>): ClarityModel => {
  return {
    ...clarity,
    problematicSentences: Object.keys(clarity.problematicSentences).reduce((conflicts, conflictIntentName) => {
      if (isIntentBuiltIn(conflictIntentName)) return conflicts;

      const intentConflicts = clarity.problematicSentences[conflictIntentName] as ProblematicSentence[];

      return {
        ...conflicts,
        [conflictIntentName]: intentConflicts.filter((conflict) => {
          const intentUtterances = existentIntentsByIdAndName[transformIntentName(conflictIntentName)];
          const conflictingIntentUtterances = existentIntentsByIdAndName[conflict.intentID];

          if (isIntentBuiltIn(conflict.intentID)) return false;
          if (intentUtterances && !intentUtterances.includes(conflict.sentence)) return false;
          if (conflictingIntentUtterances && !conflictingIntentUtterances.includes(conflict.conflictingSentence)) return false;

          return true;
        }),
      };
    }, {}),
  };
};

export const getDateRangeFilter = (type: DateRangeTypes): { startDate: Date; endDate: Date } => {
  const { days } = DATE_RANGE_INFO_MAP[type];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  if (days != null) {
    startDate.setDate(startDate.getDate() - days);
  }

  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
  };
};

export const searchUtterances = (
  utterances: Realtime.NLUUnclassifiedUtterances[],
  search: string,
  unclassifiedDataFilters: UnclassifiedViewFilters
) => {
  if (!search && !unclassifiedDataFilters.dataSourceIDs?.length && !unclassifiedDataFilters.dateRange) return utterances;

  const lowercasedSearch = search.toLowerCase();

  return utterances.filter(({ utterance, importedAt, datasourceID }) => {
    if (unclassifiedDataFilters.dataSourceIDs?.length && !unclassifiedDataFilters.dataSourceIDs.includes(datasourceID)) return false;

    const matchText = utterance.toLowerCase().includes(lowercasedSearch);
    if (search && !matchText) return false;

    if (unclassifiedDataFilters.dateRange && unclassifiedDataFilters.dateRange !== DateRangeTypes.ALL_TIME) {
      const importedAtDate = new Date(importedAt).getTime();
      const { startDate, endDate } = getDateRangeFilter(unclassifiedDataFilters.dateRange);

      return importedAtDate >= startDate.getTime() && importedAtDate <= endDate.getTime();
    }

    return true;
  });
};
