import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';

import TextBasedEditor, { PromptInputTextEditorProps } from './TextEditor';
import VoiceBasedEditor, { PromptInputVoiceEditorProps } from './VoiceEditor';

type PromptInputProps = PromptInputTextEditorProps | PromptInputVoiceEditorProps;

const PromptInput: React.FC<PromptInputProps> = (props) => {
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);

  if (projectType === Platform.Constants.ProjectType.CHAT) {
    return <TextBasedEditor {...(props as PromptInputTextEditorProps)} />;
  }

  if (projectType === Platform.Constants.ProjectType.VOICE) {
    return <VoiceBasedEditor {...(props as PromptInputVoiceEditorProps)} />;
  }

  return null;
};

export default PromptInput;
