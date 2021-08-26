import { PlatformType } from '@voiceflow/internal';
import { Box } from '@voiceflow/ui';
import React from 'react';
import { createSelector } from 'reselect';

import Section from '@/components/Section';
import SSMLWithVars from '@/components/SSMLWithVars';
import AudioUpload from '@/components/Upload/AudioUpload';
import VariablesInput from '@/components/VariablesInput';
import { RepromptType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
import { NodeData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { useUpdateData } from '@/pages/Canvas/components/EditorSidebar/hooks';
import { PlatformContext } from '@/pages/Skill/contexts';

import ResponseTypeSelect from './ResponseTypeSelect';

const AnySSMLWithVars = SSMLWithVars as any;
const AnyVariablesInput = VariablesInput as any;

const focusedNodeRepromptSelector = createSelector(
  Creator.focusedNodeDataSelector,
  (data) => (data && (data as NodeData<{ reprompt?: NodeData.Reprompt }>).reprompt) || null
);

const NoReplyResponseForm: React.FC = () => {
  const focus = useSelector(Creator.creatorFocusSelector);
  const reprompt = useSelector(focusedNodeRepromptSelector);
  const platform = React.useContext(PlatformContext);

  const updateData = useUpdateData(focus.target);
  const updateReprompt = React.useCallback(
    (value: Partial<NodeData.Reprompt>) => updateData({ reprompt: { ...reprompt, ...value } }),
    [reprompt, updateData]
  );
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
        <ResponseTypeSelect value={reprompt.type} onSelect={updateResponseType} />
      </FormControl>

      <FormControl>
        {isVoice ? (
          <AnySSMLWithVars voice={reprompt.voice} value={reprompt.content} onBlur={updateContent} onChangeVoice={updateVoice} />
        ) : (
          <>
            <AudioUpload audio={reprompt.audio} update={updateAudio} />

            {platform === PlatformType.GOOGLE && reprompt.audio && (
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

export default NoReplyResponseForm;
