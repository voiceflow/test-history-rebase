import React from 'react';
import { createSelector } from 'reselect';

import SSMLWithVars from '@/componentsV2/SSMLWithVars';
import AudioUpload from '@/componentsV2/Upload/AudioUpload';
import { RepromptType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useUpdateData } from '@/pages/Canvas/components/EditSidebar/hooks';
import { FormControl, Section } from '@/pages/Canvas/components/Editor';

import ResponseTypeSelect from './ResponseTypeSelect';

const focusedNodeRepromptSelector = createSelector(
  Creator.focusedNodeDataSelector,
  (data) => data && data.reprompt
);

const NoReplyResponseForm = ({ focus, reprompt }) => {
  const updateData = useUpdateData(focus.target);
  const updateReprompt = React.useCallback((value) => updateData({ reprompt: { ...reprompt, ...value } }), [reprompt, updateData]);
  const isVoice = reprompt?.type === RepromptType.TEXT;

  const updateResponseType = React.useCallback((type) => updateReprompt({ type }), [updateReprompt]);
  const updateContent = React.useCallback(({ text: content }) => updateReprompt({ content }), [updateReprompt]);
  const updateVoice = React.useCallback((voice) => updateReprompt({ voice }), [updateReprompt]);
  const updateAudio = React.useCallback((audio) => updateReprompt({ audio }), [updateReprompt]);

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
          <AudioUpload audio={reprompt.audio} update={updateAudio} />
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
