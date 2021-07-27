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
import { connect } from '@/hocs';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { useUpdateData } from '@/pages/Canvas/components/EditorSidebar/hooks';
import { PlatformContext } from '@/pages/Skill/contexts';

import ResponseTypeSelect from './ResponseTypeSelect';

const focusedNodeRepromptSelector = createSelector([Creator.focusedNodeDataSelector], (data) => data && data.reprompt);

const NoReplyResponseForm = ({ focus, reprompt }) => {
  const platform = React.useContext(PlatformContext);
  const updateData = useUpdateData(focus.target);
  const updateReprompt = React.useCallback((value) => updateData({ reprompt: { ...reprompt, ...value } }), [reprompt, updateData]);
  const isVoice = reprompt?.type === RepromptType.TEXT;

  const updateResponseType = React.useCallback((type) => updateReprompt({ type }), [updateReprompt]);
  const updateContent = React.useCallback(({ text: content }) => updateReprompt({ content }), [updateReprompt]);
  const updateVoice = React.useCallback((voice) => updateReprompt({ voice }), [updateReprompt]);
  const updateAudio = React.useCallback((audio) => updateReprompt({ audio }), [updateReprompt]);
  const updateDesc = React.useCallback(({ text: desc }) => updateReprompt({ desc }), [updateReprompt]);

  if (!reprompt) return null;

  return (
    <Section>
      <FormControl>
        <ResponseTypeSelect value={reprompt.type} onSelect={updateResponseType} />
      </FormControl>
      <FormControl>
        {isVoice ? (
          <SSMLWithVars voice={reprompt.voice} value={reprompt.content} onBlur={updateContent} onChangeVoice={updateVoice} />
        ) : (
          <>
            <AudioUpload audio={reprompt.audio} update={updateAudio} />
            {platform === PlatformType.GOOGLE && reprompt.audio && (
              <Box mt={16}>
                <VariablesInput value={reprompt.desc || ''} onBlur={updateDesc} placeholder="Enter audio description" multiline />
              </Box>
            )}
          </>
        )}
      </FormControl>
    </Section>
  );
};

const mapStateToProps = {
  focus: Creator.creatorFocusSelector,
  reprompt: focusedNodeRepromptSelector,
};

export default connect(mapStateToProps)(NoReplyResponseForm);
