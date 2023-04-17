import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useHasPremiumVoice, useSelector } from '@/hooks';
import { bindVoiceOptions, getPlatformVoiceOptions } from '@/utils/voice';

export const useGenerativeFooterActions = (onChange: (data: Partial<Realtime.NodeData.AIResponse>) => void) => {
  const { platform, type } = useSelector(ProjectV2.active.metaSelector);

  const { hasPremiumVoice } = useHasPremiumVoice();
  const locales = useSelector(VersionV2.active.localesSelector);

  const voiceOptions = React.useMemo(() => {
    if (!Realtime.Utils.typeGuards.isVoiceProjectType(type)) return [];

    const options = getPlatformVoiceOptions(platform, { locales, usePremiumVoice: !!hasPremiumVoice });

    return bindVoiceOptions(options, (option) => ({
      ...option,
      onClick: () => onChange({ voice: option.value }),
    }));
  }, []);

  return voiceOptions.length
    ? [
        {
          label: 'Text to speech voice',
          options: voiceOptions,
        },
      ]
    : [];
};
