import * as Platform from '@voiceflow/platform-config';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

interface VoiceAddButtonProps {
  onAdd: (prompt: Platform.Base.Models.Prompt.Model) => void;
  items: Platform.Base.Models.Prompt.Model[];
  multi?: boolean;
  disabled?: boolean;
}

const VoiceAddButton: React.FC<VoiceAddButtonProps> = ({ items, onAdd, disabled, multi }) => {
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const onAddSpeak = () => onAdd(Platform.Common.Voice.CONFIG.utils.prompt.textFactory({ defaultVoice }));
  const onAddAudio = () => onAdd(Platform.Common.Voice.CONFIG.utils.prompt.audioFactory());

  const isAudio = (items[0] as Platform.Common.Voice.Models.Prompt.Model)?.type === Platform.Common.Voice.Models.Prompt.PromptType.AUDIO;

  return multi ? (
    <SectionV2.AddButtonDropdown
      actions={[
        { label: 'Speak', onClick: onAddSpeak },
        { label: 'Audio', onClick: onAddAudio },
      ]}
      disabled={disabled}
    />
  ) : (
    <SectionV2.AddButton onClick={isAudio ? onAddAudio : onAddSpeak} disabled={disabled} />
  );
};

export default VoiceAddButton;
