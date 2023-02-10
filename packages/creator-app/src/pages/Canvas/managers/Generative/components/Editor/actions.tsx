import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input, Label, NestedMenu, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useHasWavenet, useSelector } from '@/hooks';
import { bindVoiceOptions, getPlatformVoiceOptions } from '@/utils/voice';

import { DEFAULT_LENGTH } from '../../constants';

export const useGenerativeFooterActions = (data: Realtime.NodeData.Generative, onChange: (data: Partial<Realtime.NodeData.Generative>) => void) => {
  const { platform, type } = useSelector(ProjectV2.active.metaSelector);

  const editLengthOption = {
    label: 'Max response length',
    render: () => (
      <NestedMenu.OptionContainer>
        <Box py={16} px={20} onClick={swallowEvent()}>
          <Label fontSize={13}>Characters</Label>
          <Input.Range min={1} max={2048} value={data.length} onChange={(length) => onChange({ length })} defaultValue={DEFAULT_LENGTH} />
        </Box>
      </NestedMenu.OptionContainer>
    ),
  };

  const { hasWavenet } = useHasWavenet();
  const locales = useSelector(VersionV2.active.localesSelector);

  const voiceOptions = React.useMemo(() => {
    if (!Realtime.Utils.typeGuards.isVoiceProjectType(type)) return [];

    const options = getPlatformVoiceOptions(platform, { locales, useWavenet: !!hasWavenet });

    return bindVoiceOptions(options, (option) => ({
      ...option,
      onClick: () => onChange({ voice: option.value }),
    }));
  }, []);

  return [
    editLengthOption,
    voiceOptions.length
      ? {
          label: 'Text to speech voice',
          options: voiceOptions,
        }
      : null,
  ];
};
