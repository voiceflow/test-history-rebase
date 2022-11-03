import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';

import TextBasedEditor, { PromptInputTextEditorProps } from './TextEditor';
import VoiceBasedEditor, { PromptInputVoiceEditorProps } from './VoiceEditor';

type PromptInputProps = PromptInputTextEditorProps | PromptInputVoiceEditorProps;

const PromptInput: React.FC<PromptInputProps> = (props) => {
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);

  if (projectType === VoiceflowConstants.ProjectType.CHAT) {
    return <TextBasedEditor {...(props as PromptInputTextEditorProps)} />;
  }

  if (projectType === VoiceflowConstants.ProjectType.VOICE) {
    return <VoiceBasedEditor {...(props as PromptInputVoiceEditorProps)} />;
  }

  return null;
};

export default PromptInput;
