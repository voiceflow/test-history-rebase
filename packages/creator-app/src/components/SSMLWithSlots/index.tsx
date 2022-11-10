import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes, useSetup } from '@voiceflow/ui';
import React from 'react';

import SSML from '@/components/SSML';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useSelector } from '@/hooks';

import { isSlotsInRepromptValid } from './utils';

interface SSMLWithSlotsProps {
  icon?: SvgIconTypes.Icon | null;
  value: string;
  slots: Realtime.Slot[];
  voice?: string;
  onBlur: (data: { text: string; slots: string[] }) => void;
  autofocus?: boolean;
  placeholder?: string;
  onChangeVoice: (newVoice: string) => void;
}

export const SSMLWithSlots: React.FC<SSMLWithSlotsProps> = ({ voice, slots, autofocus, ...props }) => {
  const projectTypeConfig = useActiveProjectTypeConfig();

  const ssmlRef = React.useRef<{ forceFocusToTheEnd: VoidFunction } | null>(null);

  const locales = useSelector(VersionV2.active.localesSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);

  const updateDefaultVoice = useDispatch(Version.updateDefaultVoice);

  useSetup(() => {
    if (autofocus) {
      ssmlRef.current?.forceFocusToTheEnd();
    }
  }, []);

  return (
    <SSML
      ref={ssmlRef}
      voice={voice || defaultVoice || projectTypeConfig.project.voice.default}
      space
      locales={locales}
      platform={platform}
      variables={slots}
      creatable={false}
      projectType={projectType}
      defaultVoice={defaultVoice || projectTypeConfig.project.voice.default}
      withVariablesPlugin={isSlotsInRepromptValid(platform)}
      platformDefaultVoice={projectTypeConfig.project.voice.default}
      onChangeDefaultVoice={updateDefaultVoice}
      {...props}
    />
  );
};

export default SSMLWithSlots;
