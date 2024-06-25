import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _sampleSize from 'lodash/sampleSize';

import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useSelector, useTrackingEvents } from '@/hooks';

interface GenerateBuiltInResponsesOptions {
  defaultResponses: readonly string[];
  responsesByLocale: Partial<Record<VoiceflowConstants.Locale, readonly string[]>>;
}

export const useGenerateBuiltInResponses = ({
  defaultResponses,
  responsesByLocale,
}: GenerateBuiltInResponsesOptions) => {
  const projectTypeConfig = useActiveProjectTypeConfig();
  const [trackingEvents] = useTrackingEvents();

  const locales = useSelector(VersionV2.active.localesSelector);

  return ({ quantity }: { quantity: number }) => {
    const voiceflowLocales = locales.map(projectTypeConfig.utils.locale.toVoiceflowLocale);

    const builtInNoMatches =
      voiceflowLocales.map((locale) => responsesByLocale[locale]).find(Boolean) ?? defaultResponses;
    const generatedNoMatches = _sampleSize(builtInNoMatches, quantity);

    if (generatedNoMatches.length < quantity) {
      generatedNoMatches.push(..._sampleSize(defaultResponses, quantity - generatedNoMatches.length));
    }
    trackingEvents.trackNonAINoMatchGenerate({ quantity });

    return generatedNoMatches;
  };
};
