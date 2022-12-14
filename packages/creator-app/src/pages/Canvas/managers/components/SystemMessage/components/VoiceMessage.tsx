import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Upload } from '@voiceflow/ui';
import React from 'react';

import SSMLWithVars from '@/components/SSMLWithVars';
import VariablesInput from '@/components/VariablesInput';
import { useActiveProjectPlatform } from '@/hooks';

import { VoiceMessageProps } from '../types';

const SpeakAudioItem: React.FC<VoiceMessageProps> = ({ message, autoFocus, onChange }) => {
  const platform = useActiveProjectPlatform();
  const isGoogle = Realtime.Utils.typeGuards.isGooglePlatform(platform);

  return Realtime.isSSML(message) ? (
    <SSMLWithVars
      icon={null}
      voice={message.voice}
      value={message.content}
      onBlur={({ text }) => onChange({ content: text })}
      autofocus={autoFocus}
      onChangeVoice={(voice) => onChange({ voice })}
    />
  ) : (
    <>
      <Upload.AudioUpload audio={message.url} update={(url) => onChange({ url: url ?? '' })} renderInput={VariablesInput.renderInput} />

      {isGoogle && message.url && (
        <Box mt={12}>
          <VariablesInput
            value={message.desc || ''}
            onBlur={({ text }) => onChange({ desc: text })}
            placeholder="Enter audio description"
            multiline
          />
        </Box>
      )}
    </>
  );
};

export default SpeakAudioItem;
