import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import SSMLWithVars from '@/components/SSMLWithVars';
import AudioUpload from '@/components/Upload/AudioUpload';
import VariablesInput from '@/components/VariablesInput';
import { RepromptType } from '@/constants';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { PlatformContext } from '@/pages/Project/contexts';
import { isGooglePlatform } from '@/utils/typeGuards';

import { useFocusedNodeReprompt } from './hooks';
import VoiceRepromptTypeSelect from './VoiceRepromptTypeSelect';

const AnySSMLWithVars = SSMLWithVars as any;
const AnyVariablesInput = VariablesInput as any;

const VoiceForm: React.FC = () => {
  const [reprompt, updateReprompt] = useFocusedNodeReprompt<Realtime.NodeData.VoicePrompt>();
  const platform = React.useContext(PlatformContext);

  const updateResponseType = React.useCallback((type: RepromptType) => updateReprompt({ type }), [updateReprompt]);
  const updateContent = React.useCallback(({ text: content }: { text: string }) => updateReprompt({ content }), [updateReprompt]);
  const updateVoice = React.useCallback((voice: string) => updateReprompt({ voice }), [updateReprompt]);
  const updateAudio = React.useCallback((audio: string) => updateReprompt({ audio }), [updateReprompt]);
  const updateDesc = React.useCallback(({ text: desc }: { text: string }) => updateReprompt({ desc }), [updateReprompt]);

  const isVoice = reprompt?.type === RepromptType.TEXT;

  if (!reprompt) return null;

  return (
    <Section>
      <FormControl>
        <VoiceRepromptTypeSelect value={reprompt.type} onSelect={updateResponseType} />
      </FormControl>

      <FormControl>
        {isVoice ? (
          <AnySSMLWithVars voice={reprompt.voice} value={reprompt.content} onBlur={updateContent} onChangeVoice={updateVoice} />
        ) : (
          <>
            <AudioUpload audio={reprompt.audio} update={updateAudio} />

            {isGooglePlatform(platform) && reprompt.audio && (
              <Box mt={16}>
                <AnyVariablesInput value={reprompt.desc || ''} onBlur={updateDesc} placeholder="Enter audio description" multiline />
              </Box>
            )}
          </>
        )}
      </FormControl>
    </Section>
  );
};

export default VoiceForm;
