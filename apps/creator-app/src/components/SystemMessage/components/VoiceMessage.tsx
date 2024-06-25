import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Upload } from '@voiceflow/ui';
import React from 'react';

import SSMLWithVars from '@/components/SSMLWithVars';
import type { TextEditorRef } from '@/components/TextEditor/types';
import VariablesInput from '@/components/VariablesInput';
import { useActiveProjectPlatform } from '@/hooks';

import type { VoiceMessageProps, VoiceMessageRef } from '../types';

const SpeakAudioItem = React.forwardRef<VoiceMessageRef, VoiceMessageProps>(
  ({ message, placeholder, autoFocus, onChange, readOnly, onEmpty, isActive }, ref) => {
    const platform = useActiveProjectPlatform();

    const ssmlRef = React.useRef<TextEditorRef>(null);
    const isGoogle = Realtime.Utils.typeGuards.isGooglePlatform(platform);

    React.useImperativeHandle(
      ref,
      () => ({
        getCurrentValue: () =>
          Realtime.isSSML(message)
            ? { ...message, content: ssmlRef.current?.getCurrentValue()?.text ?? message.content }
            : message,
      }),
      [message]
    );

    return Realtime.isSSML(message) ? (
      <SSMLWithVars
        ref={ssmlRef}
        icon={null}
        voice={message.voice}
        value={message.content}
        onBlur={({ text }) => onChange({ content: text })}
        onEmpty={onEmpty}
        readOnly={readOnly}
        isActive={isActive}
        autofocus={autoFocus}
        onChangeVoice={(voice) => onChange({ voice })}
        placeholder={placeholder}
      />
    ) : (
      <>
        <Upload.AudioUpload
          audio={message.url}
          update={(url) => onChange({ url: url ?? '' })}
          renderInput={VariablesInput.renderInput}
        />

        {isGoogle && message.url && (
          <Box mt={12}>
            <VariablesInput
              value={message.desc || ''}
              onBlur={({ text }) => onChange({ desc: text })}
              multiline
              placeholder="Enter audio description"
            />
          </Box>
        )}
      </>
    );
  }
);

export default SpeakAudioItem;
